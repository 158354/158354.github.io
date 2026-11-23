import { NavLink, Link } from 'react-router-dom'
import { Sparkles, Home, Info } from 'lucide-react'
import { useEffect, useState } from 'react'

const links = [
  { to: '/', label: '首页', icon: Home },
  { to: '/about', label: '关于', icon: Info },
]

export default function Header() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className={`glass flex items-center justify-between rounded-2xl px-4 py-3 transition-all duration-300 ${scrolled ? 'shadow-2xl shadow-black/40' : ''}`}>
          <Link to="/" className="group flex items-center gap-2.5">
            <span className="relative grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-violet-500 to-teal-400 shadow-glow">
              <Sparkles size={18} className="text-white" />
              <span className="absolute -inset-1 rounded-xl bg-gradient-to-br from-violet-500 to-teal-400 opacity-40 blur-md transition-opacity group-hover:opacity-80" />
            </span>
            <span className="flex flex-col leading-none">
              <span className="text-sm font-extrabold tracking-tight text-white">LUMEN<span className="text-accent-violet">.</span></span>
              <span className="mt-0.5 text-[9px] font-medium uppercase tracking-[0.2em] text-slate-500">creative blog</span>
            </span>
          </Link>

          <nav className="flex items-center gap-1 sm:gap-2">
            {links.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition-all sm:text-sm ${
                    isActive
                      ? 'bg-white/10 text-white shadow-inner shadow-white/5'
                      : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'
                  }`
                }
              >
                <Icon size={15} />
                <span>{label}</span>
              </NavLink>
            ))}
            <a
              href="https://github.com/158354/158354.github.io"
              target="_blank"
              rel="noreferrer"
              className="ml-1 hidden rounded-xl border border-white/10 px-3 py-2 text-xs font-semibold text-slate-300 transition-colors hover:border-violet-400/50 hover:text-white sm:block"
            >
              GitHub ↗
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
