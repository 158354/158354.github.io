import { useEffect, useRef, useState } from 'react'
import { Palette, Music2, Music } from 'lucide-react'

type Theme = 'aurora' | 'sunset' | 'forest'
type Bg = 'space' | 'midnight' | 'rose' | 'mint'

const themes: { id: Theme; name: string; colors: string[] }[] = [
  { id: 'aurora', name: '极光紫', colors: ['#8b5cf6', '#d946ef', '#2dd4bf'] },
  { id: 'sunset', name: '落日暖', colors: ['#f43f5e', '#f97316', '#f59e0b'] },
  { id: 'forest', name: '森林绿', colors: ['#10b981', '#84cc16', '#06b6d4'] },
]

const backgrounds: { id: Bg; name: string; base: string; accent: string }[] = [
  { id: 'space', name: '深空黑', base: '#08090d', accent: '#5b5bd6' },
  { id: 'midnight', name: '午夜蓝', base: '#0a1024', accent: '#3b82f6' },
  { id: 'rose', name: '暮色红', base: '#15090f', accent: '#be3455' },
  { id: 'mint', name: '薄荷绿', base: '#061210', accent: '#0f9b8e' },
]

function getStoredTheme(): Theme {
  try {
    const v = localStorage.getItem('lumen-theme') as Theme
    if (v && themes.some((t) => t.id === v)) return v
  } catch { /* file:// 下 localStorage 可能不可用 */ }
  return 'aurora'
}
function getStoredBg(): Bg {
  try {
    const v = localStorage.getItem('lumen-bg') as Bg
    if (v && backgrounds.some((b) => b.id === v)) return v
  } catch { /* ignore */ }
  return 'space'
}

/* ---------- 主题 & 背景切换器 ---------- */
function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>(getStoredTheme)
  const [bg, setBg] = useState<Bg>(getStoredBg)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem('lumen-theme', theme) } catch { /* ignore */ }
  }, [theme])
  useEffect(() => {
    document.documentElement.setAttribute('data-bg', bg)
    try { localStorage.setItem('lumen-bg', bg) } catch { /* ignore */ }
  }, [bg])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        title="切换主题色与背景"
        className="glass grid h-11 w-11 place-items-center rounded-xl text-slate-300 transition-all hover:scale-105 hover:text-white"
      >
        <Palette size={19} />
      </button>
      {open && (
        <div className="glass absolute bottom-14 right-0 w-52 rounded-2xl p-3 shadow-2xl shadow-black/50">
          <div className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">主题配色</div>
          <div className="space-y-1">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left text-xs font-semibold transition-colors ${
                  theme === t.id ? 'bg-white/10 text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span className="flex">
                  {t.colors.map((c, i) => (
                    <span key={c} className="h-3.5 w-3.5 rounded-full border-2 border-[#0b0d12]" style={{ background: c, marginLeft: i ? -5 : 0 }} />
                  ))}
                </span>
                {t.name}
                {theme === t.id && <span className="ml-auto text-emerald-400">✓</span>}
              </button>
            ))}
          </div>
          <div className="my-3 h-px bg-white/10" />
          <div className="mb-2 px-1 text-[10px] font-bold uppercase tracking-widest text-slate-500">背景底色</div>
          <div className="grid grid-cols-2 gap-1.5">
            {backgrounds.map((b) => (
              <button
                key={b.id}
                onClick={() => setBg(b.id)}
                className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-2 py-2 text-left text-[11px] font-semibold transition-colors ${
                  bg === b.id ? 'bg-white/10 text-white ring-1 ring-white/20' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
                }`}
              >
                <span className="h-4 w-4 shrink-0 rounded-md border border-white/20" style={{ background: b.base, boxShadow: `inset 0 0 6px ${b.accent}` }} />
                {b.name}
                {bg === b.id && <span className="ml-auto text-emerald-400">✓</span>}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

/* ---------- 背景音乐（Web Audio 生成柔和和弦，无外部音频文件，file:// 可用） ---------- */
function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null)
  const masterRef = useRef<GainNode | null>(null)
  const timerRef = useRef<number | null>(null)
  const stepRef = useRef(0)

  const start = () => {
    try {
      if (!ctxRef.current) {
        const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
        const ctx = new AC()
        const master = ctx.createGain()
        master.gain.value = 0.035 // 音量很小
        master.connect(ctx.destination)
        ctxRef.current = ctx
        masterRef.current = master
      }
      const ctx = ctxRef.current!
      if (ctx.state === 'suspended') void ctx.resume()

      // 柔和的琶音：C 大调几个音，循环播放
      const notes = [261.63, 329.63, 392.0, 523.25, 392.0, 329.63]
      const playNote = () => {
        const t = ctx.currentTime
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.type = 'sine'
        osc.frequency.value = notes[stepRef.current % notes.length]
        gain.gain.setValueAtTime(0, t)
        gain.gain.linearRampToValueAtTime(0.6, t + 1.1)
        gain.gain.exponentialRampToValueAtTime(0.001, t + 3.6)
        osc.connect(gain)
        gain.connect(masterRef.current!)
        osc.start(t)
        osc.stop(t + 3.8)
        stepRef.current += 1
      }
      playNote()
      timerRef.current = window.setInterval(playNote, 2600)
    } catch { /* 浏览器不支持 AudioContext 时静默降级 */ }
  }

  const stop = () => {
    if (timerRef.current) { window.clearInterval(timerRef.current); timerRef.current = null }
  }

  useEffect(() => () => {
    stop()
    if (ctxRef.current) { void ctxRef.current.close(); ctxRef.current = null }
  }, [])

  return { start, stop }
}

function MusicToggle() {
  const [on, setOn] = useState(false)
  const { start, stop } = useAmbientAudio()

  const toggle = () => {
    if (on) { stop(); setOn(false) }
    else { start(); setOn(true) }
  }

  return (
    <button
      onClick={toggle}
      title={on ? '关闭背景音乐' : '开启背景音乐'}
      className={`glass grid h-11 w-11 place-items-center rounded-xl transition-all hover:scale-105 ${
        on ? 'text-emerald-300 ring-1 ring-emerald-400/40' : 'text-slate-300 hover:text-white'
      }`}
    >
      {on ? <Music size={19} /> : <Music2 size={19} />}
      {on && <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]" />}
    </button>
  )
}

/* ---------- 点击涟漪特效 ---------- */
function ClickRipples() {
  useEffect(() => {
    let last = 0
    const onDown = (e: PointerEvent) => {
      const now = Date.now()
      if (now - last < 90) return // 节流
      last = now
      const { clientX: x, clientY: y } = e

      const ring = document.createElement('div')
      ring.className = 'ripple-ring'
      ring.style.left = `${x}px`
      ring.style.top = `${y}px`
      document.body.appendChild(ring)
      window.setTimeout(() => ring.remove(), 650)

      // 几个小粒子向四周散开
      for (let i = 0; i < 5; i++) {
        const dot = document.createElement('div')
        dot.className = 'ripple-dot'
        dot.style.left = `${x}px`
        dot.style.top = `${y}px`
        const angle = (Math.PI * 2 * i) / 5 + Math.random() * 0.5
        const dist = 28 + Math.random() * 26
        dot.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
        dot.style.setProperty('--dy', `${Math.sin(angle) * dist}px`)
        document.body.appendChild(dot)
        window.setTimeout(() => dot.remove(), 580)
      }
    }
    window.addEventListener('pointerdown', onDown)
    return () => window.removeEventListener('pointerdown', onDown)
  }, [])
  return null
}

/* ---------- 汇总 ---------- */
export default function Extras() {
  return (
    <>
      <ClickRipples />
      <div className="fixed bottom-5 right-5 z-[65] flex flex-col gap-2">
        <ThemeSwitcher />
        <MusicToggle />
      </div>
    </>
  )
}
