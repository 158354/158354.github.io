import { useEffect, useState } from 'react'
import { useParams, Link, Navigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { motion } from 'framer-motion'
import { ArrowLeft, Clock3, CalendarDays, Tag, Link2, Check, ChevronRight, BookOpen, Gamepad2, ExternalLink } from 'lucide-react'
import { posts, loadPost } from '../lib/posts'

export default function PostDetail() {
  const { slug } = useParams()
  const post = posts.find((p) => p.slug === slug)
  const [md, setMd] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!post) return
    let alive = true
    setLoading(true); setError('')
    loadPost(post.file)
      .then((text) => { if (alive) setMd(text) })
      .catch((e) => { if (alive) setError(String(e.message || e)) })
      .finally(() => { if (alive) setLoading(false) })
    return () => { alive = false }
  }, [post])

  useEffect(() => {
    if (copied) { const t = setTimeout(() => setCopied(false), 1800); return () => clearTimeout(t) }
  }, [copied])

  if (!post) return <Navigate to="/" replace />

  const idx = posts.findIndex((p) => p.slug === slug)
  const prev = posts[idx - 1]
  const next = posts[idx + 1]

  const copyLink = () => {
    navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
  }

  return (
    <article className="mx-auto max-w-6xl px-6 pt-32">
      <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 transition-colors hover:text-violet-300">
          <ArrowLeft size={15} /> 返回文章列表
        </Link>
      </motion.div>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
            <div className="flex items-center gap-3">
              <span className="grid h-14 w-14 place-items-center rounded-2xl bg-white/[0.06] text-3xl">{post.icon}</span>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-violet-300">{post.category}</span>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                  <span className="flex items-center gap-1"><CalendarDays size={12} />{post.date}</span>
                  <span className="flex items-center gap-1"><Clock3 size={12} />约 {post.readMinutes} 分钟</span>
                </div>
              </div>
            </div>

            <h1 className="mt-7 text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl">{post.title}</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400">{post.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {post.tags.map((t) => <span key={t} className="chip">#{t}</span>)}
              <button onClick={copyLink} className="chip ml-auto hover:!border-violet-400/50 hover:!text-violet-200">
                {copied ? <Check size={12} className="text-teal-300" /> : <Link2 size={12} />}
                {copied ? '已复制' : '复制链接'}
              </button>
            </div>
            <div className="mt-8 h-px bg-gradient-to-r from-violet-500/50 via-white/10 to-transparent" />
          </motion.div>

          {post.playUrl && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
              className="relative mt-7 overflow-hidden rounded-3xl border border-violet-400/25 bg-gradient-to-br from-violet-600/20 via-fuchsia-500/10 to-teal-500/15 p-6 sm:p-8">
              <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-violet-500/20 blur-3xl" />
              <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-violet-200">
                    <Gamepad2 size={15} /> Playable Work
                  </div>
                  <h2 className="mt-2 text-2xl font-black tracking-tight text-white sm:text-3xl">青春校园模拟器</h2>
                  <p className="mt-2 max-w-lg text-sm leading-7 text-slate-300">
                    四年大学，从一个名字开始。创建角色、加入社团、结交舍友、经历考试与假期——多属性养成 + 随机事件 + 多结局图鉴，
                    所有内容都在一个网页里。现在就可以直接开玩。
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {['单文件 HTML', '属性养成', '社团系统', '社交恋爱', '多结局'].map((t) => (
                      <span key={t} className="chip !border-white/15 !bg-white/[0.06] !text-slate-200">{t}</span>
                    ))}
                  </div>
                </div>
                <a href={`${import.meta.env.BASE_URL}${post.playUrl}`} target="_blank" rel="noreferrer"
                  className="group inline-flex shrink-0 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-3.5 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5">
                  <Gamepad2 size={17} /> 立即试玩 <ExternalLink size={14} className="transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="glass mt-8 rounded-3xl p-6 sm:p-9">
            {loading && (
              <div className="space-y-4">
                {[90, 70, 80, 55, 85, 65].map((w, i) => (
                  <div key={i} className="h-4 animate-pulse rounded bg-white/[0.06]" style={{ width: `${w}%`, animationDelay: `${i * 90}ms` }} />
                ))}
              </div>
            )}
            {error && <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-sm text-rose-200">加载失败：{error}</div>}
            {!loading && !error && (
              <div className="prose-article">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{md}</ReactMarkdown>
              </div>
            )}
          </motion.div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {prev && (
              <Link to={`/post/${prev.slug}`} className="glass glass-hover group rounded-2xl p-5">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500"><ChevronRight size={12} className="rotate-180" />上一篇</div>
                <div className="mt-2 text-sm font-bold text-white transition-colors group-hover:text-violet-300">{prev.title}</div>
              </Link>
            )}
            {next && (
              <Link to={`/post/${next.slug}`} className="glass glass-hover group rounded-2xl p-5 sm:text-right">
                <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500 sm:justify-end">下一篇 <ChevronRight size={12} /></div>
                <div className="mt-2 text-sm font-bold text-white transition-colors group-hover:text-violet-300">{next.title}</div>
              </Link>
            )}
          </div>
        </div>

        {/* 侧边栏 */}
        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-4">
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-white"><Tag size={13} className="text-violet-300" />文章信息</div>
              <dl className="mt-4 space-y-3 text-xs">
                <div className="flex justify-between"><dt className="text-slate-500">分类</dt><dd className="text-slate-200">{post.category}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">发布于</dt><dd className="text-slate-200">{post.date}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">更新于</dt><dd className="text-slate-200">{post.updated || post.date}</dd></div>
                <div className="flex justify-between"><dt className="text-slate-500">状态</dt><dd className="text-teal-300">{post.status === 'active' ? '✓ 持续维护' : post.status}</dd></div>
              </dl>
            </div>
            <div className="glass rounded-2xl p-5">
              <div className="flex items-center gap-2 text-xs font-bold text-white"><BookOpen size={13} className="text-teal-300" />关于作者</div>
              <p className="mt-3 text-xs leading-6 text-slate-400">
                一名新媒体交互设计课程的学习者，喜欢把做过的东西写成文章记录下來，
                也喜欢在网页里加一点有意思的小细节。
              </p>
              <Link to="/about" className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-violet-300 hover:underline">
                了解更多 <ArrowLeft size={11} className="rotate-180" />
              </Link>
            </div>
            <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 to-teal-500/5 p-5">
              <div className="text-2xl">💡</div>
              <p className="mt-2 text-xs leading-6 text-slate-300">喜欢这篇文章？可以点右上角「复制链接」分享给朋友，或在文章底部继续读下一篇。</p>
            </div>
          </div>
        </aside>
      </div>
    </article>
  )
}
