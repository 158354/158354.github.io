import raw from '../data/posts.json'
import type { Post } from '../types'

// 文章正文在构建时内联打包进 JS（import.meta.glob），
// 这样 file:// 双击打开或 GitHub Pages 子目录都无需运行时 fetch，不会白屏。
const modules = import.meta.glob('../content/posts/*.md', { query: '?raw', import: 'default', eager: true }) as Record<string, string>

export const posts = raw as Post[]

/** 把 frontmatter 从 markdown 中剥离，只保留正文 */
export function stripFrontmatter(md: string): string {
  return md.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, '')
}

/** 把 [[卡片名]] 转换成可读的强调文本 */
export function formatWikiLinks(md: string): string {
  return md.replace(/\[\[([^\]]+)\]\]/g, (_, name: string) => `**「${name}」**`)
}

/** 读取单篇 markdown（从内联 bundle 中按文件名取值） */
export async function loadPost(file: string): Promise<string> {
  // file 是 encodeURIComponent 后的文件名，解码回原始中文名
  const decoded = decodeURIComponent(file)
  const key = `../content/posts/${decoded}`
  const content = modules[key]
  if (content === undefined) throw new Error(`找不到文章内容：${decoded}`)
  return formatWikiLinks(stripFrontmatter(content))
}

export const allTags = Array.from(new Set(posts.flatMap((p) => p.tags)))
