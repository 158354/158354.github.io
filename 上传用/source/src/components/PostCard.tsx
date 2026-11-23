import { useRef, type MouseEvent } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowUpRight, Clock3, CalendarDays } from 'lucide-react'
import type { Post } from '../types'

const colorMap = {
  violet: { glow: 'from-violet-500/25', text: 'text-violet-300', dot: 'bg-violet-400' },
  teal: { glow: 'from-teal-500/25', text: 'text-teal-300', dot: 'bg-teal-400' },
  amber: { glow: 'from-amber-500/25', text: 'text-amber-300', dot: 'bg-amber-400' },
}

interface Props { post: Post; index: number; featured?: boolean }

export default function PostCard({ post, index, featured = false }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const c = colorMap[post.color]

  const onMove = (e: MouseEvent) => {
    const el = ref.current
    if (!el) return
    const r = el.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width - 0.5
    const py = (e.clientY - r.top) / r.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-py * 5}deg) rotateY(${px * 5}deg) translateY(-4px)`
  }
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.06, 0.4), ease: [0.22, 1, 0.36, 1] }}
      className={featured ? 'md:col-span-2' : ''}
    >
      <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
        className="group relative h-full rounded-2xl transition-transform duration-200 ease-out will-change-transform">
        <div className={`absolute -inset-px rounded-2xl bg-gradient-to-br ${c.glow} to-transparent opacity-0 blur-lg transition-opacity duration-500 group-hover:opacity-100`} />
        <Link to={`/post/${post.slug}`} className="glass glass-hover relative flex h-full flex-col overflow-hidden rounded-2xl p-6">
          <div className="mb-5 flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-white/[0.06] text-xl transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                {post.icon}
              </div>
              <div>
                <span className={`text-[11px] font-bold uppercase tracking-wider ${c.text}`}>{post.category}</span>
                <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-slate-500">
                  <span className={`h-1.5 w-1.5 rounded-full ${c.dot} animate-blink`} /> 已发布
                </div>
              </div>
            </div>
            <ArrowUpRight size={18} className="text-slate-600 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-white" />
          </div>

          <h3 className={`font-bold tracking-tight text-white transition-colors group-hover:text-violet-200 ${featured ? 'text-xl sm:text-2xl' : 'text-lg'}`}>
            {post.title}
          </h3>
          <p className="mt-2.5 line-clamp-3 flex-1 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>

          <div className="mt-5 flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => <span key={tag} className="chip !px-2.5 !py-0.5 !text-[10px]">#{tag}</span>)}
          </div>
          <div className="mt-5 flex items-center gap-4 border-t border-white/[0.06] pt-4 text-[11px] text-slate-500">
            <span className="flex items-center gap-1.5"><CalendarDays size={12} />{post.date}</span>
            <span className="flex items-center gap-1.5"><Clock3 size={12} />{post.readMinutes} 分钟</span>
          </div>
        </Link>
      </div>
    </motion.div>
  )
}
