import { useMemo, useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Search, FileText, Tags, Layers, Command, Sparkles } from 'lucide-react'
import PostCard from '../components/PostCard'
import { posts, allTags } from '../lib/posts'

const typeWords = ['交互设计', '影像叙事', '创意编程', '更多内容']
function TypeWriter() {
  const [i, setI] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const word = typeWords[i]
    const done = !deleting && text === word
    const empty = deleting && text === ''
    const delay = done ? 1800 : empty ? 250 : deleting ? 45 : 90
    const t = setTimeout(() => {
      if (done) setDeleting(true)
      else if (empty) { setDeleting(false); setI((v) => (v + 1) % typeWords.length) }
      else setText(word.slice(0, text.length + (deleting ? -1 : 1)))
    }, delay)
    return () => clearTimeout(t)
  }, [text, deleting, i])

  return <span className="text-gradient">{text}<span className="ml-0.5 inline-block h-[1em] w-[2px] translate-y-1 bg-violet-400 animate-blink" /></span>
}

export default function Home() {
  const [query, setQuery] = useState('')
  const [tag, setTag] = useState<string | null>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault(); document.getElementById('search')?.focus()
      }
      if (e.key === 'Escape') setTag(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const filtered = useMemo(() => posts.filter((p) => {
    const okTag = !tag || p.tags.includes(tag)
    const q = query.trim().toLowerCase()
    const okQuery = !q || [p.title, p.excerpt, p.category, ...p.tags].join(' ').toLowerCase().includes(q)
    return okTag && okQuery
  }), [query, tag])

  const stats = [
    { icon: FileText, n: posts.length, label: '篇文章' },
    { icon: Tags, n: allTags.length, label: '个标签' },
    { icon: Layers, n: new Set(posts.map((p) => p.category)).size, label: '个分类' },
  ]

  return (
    <div>
      {/* HERO — 精简，文章列表为主体 */}
      <section className="relative mx-auto max-w-6xl px-6 pb-10 pt-32 sm:pt-40">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
          <div className="inline-flex items-center gap-2 rounded-full border border-violet-400/25 bg-violet-500/10 px-4 py-1.5 text-xs font-semibold text-violet-200">
            <Sparkles size={13} className="animate-pulse" />
            欢迎来到我的个人博客
          </div>
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-6 max-w-3xl text-4xl font-black leading-[1.15] tracking-tight text-white sm:text-6xl lg:text-7xl">
          你好，我是<span className="text-gradient"> Lumen</span>。<br />
          记录作品、灵感与<span className="relative">创作过程
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none" preserveAspectRatio="none">
              <path d="M2 9C50 3 150 3 198 8" stroke="url(#g)" strokeWidth="3" strokeLinecap="round" />
              <defs><linearGradient id="g" x1="0" x2="200"><stop stopColor="var(--p-500)"/><stop offset="1" stopColor="var(--s-400)"/></linearGradient></defs>
            </svg>
          </span>。
        </motion.h1>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="mt-7 flex min-h-[30px] items-center gap-2 text-base font-semibold text-slate-300 sm:text-xl">
          <span className="text-slate-500">正在探索</span>
          <TypeWriter />
        </motion.div>

        <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">
          这里收集我的课程作品与创作笔记，内容会持续更新。点开卡片阅读全文，部分作品还支持直接在线体验。
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="mt-10 grid max-w-2xl grid-cols-3 gap-3">
          {stats.map(({ icon: Icon, n, label }) => (
            <div key={label} className="glass rounded-2xl px-3 py-4 text-center sm:px-6">
              <Icon size={16} className="mx-auto text-violet-300" />
              <div className="mt-2 text-2xl font-black text-white">{String(n).padStart(2, '0')}</div>
              <div className="mt-0.5 text-[10px] font-medium tracking-wider text-slate-500 sm:text-xs">{label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* ARTICLES — 页面主体 */}
      <section id="articles" className="mx-auto max-w-6xl scroll-mt-24 px-6 pt-8">
        <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-violet-300">
              <span className="h-px w-6 bg-violet-400" /> Articles
            </div>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-white sm:text-4xl">文章列表</h2>
            <p className="mt-2 text-sm text-slate-500">共 {posts.length} 篇 · 点击卡片阅读全文</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input id="search" value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="搜索文章…"
              className="w-full rounded-xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-14 text-sm text-white outline-none transition-colors placeholder:text-slate-600 focus:border-violet-400/60 focus:bg-white/[0.06]" />
            <span className="pointer-events-none absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-0.5 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-slate-500">
              <Command size={9} /> /
            </span>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2">
          <button onClick={() => setTag(null)}
            className={`chip ${!tag ? '!border-violet-400/50 !bg-violet-500/15 !text-violet-200' : ''}`}>
            全部 <span className="opacity-60">{posts.length}</span>
          </button>
          {allTags.map((t) => (
            <button key={t} onClick={() => setTag(tag === t ? null : t)}
              className={`chip ${tag === t ? '!border-violet-400/50 !bg-violet-500/15 !text-violet-200' : ''}`}>
              #{t} <span className="opacity-60">{posts.filter((p) => p.tags.includes(t)).length}</span>
            </button>
          ))}
        </div>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((post, i) => <PostCard key={post.slug} post={post} index={i} />)}
        </div>

        {filtered.length === 0 && (
          <div className="mt-12 rounded-2xl border border-dashed border-white/10 py-16 text-center">
            <div className="text-4xl">🔍</div>
            <p className="mt-4 text-sm text-slate-500">没有找到匹配的文章，换个关键词试试</p>
            <button onClick={() => { setQuery(''); setTag(null) }} className="mt-4 text-xs font-semibold text-violet-300 hover:underline">清除筛选</button>
          </div>
        )}
      </section>
    </div>
  )
}
