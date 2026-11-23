/**
 * 把 LLM-Wiki 知识卡（wiki/*.md）同步为博客文章。
 * - 复制 markdown 到 public/posts/（原样保留，由前端 fetch 渲染）
 * - 解析 frontmatter，生成 src/data/posts.json 元数据清单
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const WIKI_DIR = path.resolve(process.env.WIKI_DIR || 'F:/LLM-Wiki/wiki')
const POSTS_DIR = path.join(root, 'public', 'posts')
const CONTENT_DIR = path.join(root, 'src', 'content', 'posts')
const DATA_FILE = path.join(root, 'src', 'data', 'posts.json')

const CATEGORY_MAP = {
  '作品-Assignment1-名著影像解读网页': { category: '影像作品', icon: '🎞️', color: 'amber' },
  '作品-校园模拟小游戏': { category: '交互游戏', icon: '🎮', color: 'violet', playUrl: 'game/index.html' },
}

function parseFrontmatter(text) {
  const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)
  if (!m) return { meta: {}, body: text }
  const meta = {}
  for (const line of m[1].split(/\r?\n/)) {
    const kv = line.match(/^([^:]+):\s*(.*)$/)
    if (!kv) continue
    const key = kv[1].trim()
    let val = kv[2].trim()
    if (val.startsWith('[') && val.endsWith(']')) {
      val = val.slice(1, -1).split(',').map((s) => s.trim().replace(/^['"]|['"]$/g, '')).filter(Boolean)
    } else {
      val = val.replace(/^['"]|['"]$/g, '')
    }
    meta[key] = val
  }
  return { meta, body: text.slice(m[0].length) }
}

function excerpt(body) {
  const clean = body
    .replace(/^#{1,6}\s+.*$/gm, '')
    .replace(/\[\[([^\]]+)\]\]/g, '$1')
    .replace(/[*_`>|]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
  return clean.slice(0, 110) + (clean.length > 110 ? '…' : '')
}

// slug 用原始名称；react-router 会自动编码到 URL，useParams 取回时也是解码后的原始名称
function slugify(name) {
  return name
}
function encodeFile(name) {
  return encodeURIComponent(name)
}

if (!fs.existsSync(WIKI_DIR)) {
  console.error('找不到知识库目录:', WIKI_DIR)
  process.exit(1)
}

fs.mkdirSync(POSTS_DIR, { recursive: true })
fs.mkdirSync(CONTENT_DIR, { recursive: true })
fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true })

const files = fs.readdirSync(WIKI_DIR).filter((f) => f.endsWith('.md') && !f.startsWith('_'))
const posts = []

for (const file of files) {
  const src = path.join(WIKI_DIR, file)
  const text = fs.readFileSync(src, 'utf8')
  fs.copyFileSync(src, path.join(POSTS_DIR, file))
  fs.copyFileSync(src, path.join(CONTENT_DIR, file))

  const { meta, body } = parseFrontmatter(text)
  const baseName = file.replace(/\.md$/, '')
  const preset = CATEGORY_MAP[baseName] || { category: '笔记', icon: '📝', color: 'violet' }
  const words = body.replace(/\s/g, '').length

  posts.push({
    slug: slugify(baseName),
    file: encodeFile(file),
    title: meta.title || baseName,
    date: String(meta.created || '2026-11-23'),
    updated: String(meta.updated || meta.created || ''),
    tags: Array.isArray(meta.tags) ? meta.tags : [],
    category: preset.category,
    icon: preset.icon,
    color: preset.color,
    playUrl: preset.playUrl || null,
    status: meta.status || 'active',
    excerpt: excerpt(body),
    readMinutes: Math.max(1, Math.round(words / 300)),
  })
}

posts.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
fs.writeFileSync(DATA_FILE, JSON.stringify(posts, null, 2) + '\n', 'utf8')
console.log(`✓ 已同步 ${posts.length} 篇知识卡 → public/posts/ + src/content/posts/（内联打包）`)
console.log(`✓ 元数据清单 → src/data/posts.json`)
for (const p of posts) console.log(`  - ${p.title}`)
