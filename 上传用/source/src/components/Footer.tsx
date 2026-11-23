import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative mt-24 border-t border-white/[0.07] py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 text-center sm:flex-row sm:text-left">
        <div>
          <div className="flex items-center justify-center gap-2 sm:justify-start">
            <Sparkles size={16} className="text-accent-violet" />
            <span className="font-extrabold tracking-tight text-white">LUMEN<span className="text-accent-violet">.</span></span>
          </div>
          <p className="mt-2 text-xs text-slate-500">记录作品、灵感与创作过程。</p>
        </div>
        <div className="flex items-center gap-5 text-xs text-slate-500">
          <Link to="/" className="transition-colors hover:text-violet-300">首页</Link>
          <Link to="/about" className="transition-colors hover:text-violet-300">关于</Link>
          <span className="text-slate-700">|</span>
          <span>Built with Vite · React · Tailwind</span>
        </div>
      </div>
      <p className="mt-6 text-center text-[10px] tracking-wider text-slate-700">© 2026 LUMEN · 新媒体交互设计课程作业</p>
    </footer>
  )
}
