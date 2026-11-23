export default function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      <div className="absolute inset-0 grid-bg" />
      {/* 光斑颜色跟随主题变量，背景底色独立可选 */}
      <div className="absolute -left-40 -top-40 h-[38rem] w-[38rem] rounded-full opacity-25 blur-[130px] animate-float"
        style={{ background: 'var(--p-600)' }} />
      <div className="absolute -right-40 top-1/4 h-[34rem] w-[34rem] rounded-full opacity-20 blur-[130px] animate-float [animation-delay:-5s]"
        style={{ background: 'var(--s-500)' }} />
      <div className="absolute bottom-0 left-1/3 h-[30rem] w-[30rem] rounded-full opacity-15 blur-[130px] animate-float [animation-delay:-9s]"
        style={{ background: 'var(--a-500)' }} />
      <div className="absolute inset-0 transition-all duration-500" style={{ background: 'var(--bg-overlay)' }} />
    </div>
  )
}
