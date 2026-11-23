import { useEffect, useRef } from 'react'

/** 跟随鼠标的柔光点，纯装饰，触屏自动隐藏 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(pointer: coarse)').matches) return

    let raf = 0
    let x = -300, y = -300, tx = -300, ty = -300
    const onMove = (e: MouseEvent) => { tx = e.clientX; ty = e.clientY }
    const loop = () => {
      x += (tx - x) * 0.14
      y += (ty - y) * 0.14
      el.style.transform = `translate3d(${x}px, ${y}px, 0) translate(-50%, -50%)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove)
    raf = requestAnimationFrame(loop)
    return () => { window.removeEventListener('mousemove', onMove); cancelAnimationFrame(raf) }
  }, [])

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[60] h-72 w-72 rounded-full opacity-[0.13] blur-3xl"
      style={{ background: 'radial-gradient(circle, var(--p-500) 0%, var(--s-400) 45%, transparent 70%)' }}
      aria-hidden
    />
  )
}
