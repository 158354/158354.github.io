import { motion } from 'framer-motion'
import { PenLine, Sparkles, Globe2, Palette, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const features = [
  { icon: PenLine, n: '01', title: '作品展示', desc: '把课程里做的东西认真整理成文章——有故事、有方法，也有踩过的坑。', c: 'from-violet-500 to-indigo-500' },
  { icon: Sparkles, n: '02', title: '持续更新', desc: '这里不是一次性的作业快照。以后做的每个新作品，都会慢慢补充进来。', c: 'from-fuchsia-500 to-violet-500' },
  { icon: Palette, n: '03', title: '注重体验', desc: '换了主题色、加了背景音乐和点击特效，希望你看文章时也能有点好心情。', c: 'from-teal-500 to-cyan-500' },
  { icon: Globe2, n: '04', title: '在线可玩', desc: '部分作品可以直接在博客里打开体验，不用下载、不用装环境。', c: 'from-amber-500 to-orange-500' },
]

const stack = ['Vite', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'React Markdown', 'Git / GitHub']

export default function About() {
  return (
    <div className="mx-auto max-w-6xl px-6 pt-32">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/25 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-200">
          <Sparkles size={13} /> About Me
        </div>
        <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl">关于这个博客</h1>
        <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-400">
          你好，我是 Lumen。这是《新媒体交互设计》课程的个人博客，用来收集我的作品与创作笔记。
          内容会持续更新——现在有的，以后会有的，都放在这里。
        </p>
      </motion.div>

      <section className="mt-16">
        <h2 className="text-2xl font-bold text-white">这里有什么</h2>
        <div className="mt-7 grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: Icon, n, title, desc, c }, i) => (
            <motion.div key={n} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="glass group relative overflow-hidden rounded-2xl p-6">
              <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br ${c} opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-20`} />
              <div className="relative flex items-start gap-4">
                <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${c}`}>
                  <Icon size={22} className="text-white" />
                </div>
                <div>
                  <div className="text-[10px] font-black tracking-widest text-slate-600">0{n}</div>
                  <h3 className="mt-1 text-base font-bold text-white">{title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-400">{desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="glass rounded-3xl p-7">
          <h2 className="text-xl font-bold text-white">关于创作</h2>
          <p className="mt-4 text-sm leading-8 text-slate-400">
            我喜欢把"做东西"和"写下来"放在一起。一个作品如果只留在文件夹里，过段时间就忘了当时为什么这么设计；
            写成文章，既是对自己的记录，也方便别人参考。
          </p>
          <p className="mt-4 text-sm leading-8 text-slate-400">
            这个博客就是这样一个地方——不追求完美，但求真实、清楚、能复用。
          </p>
        </div>
        <div className="glass rounded-3xl p-7">
          <h2 className="text-xl font-bold text-white">技术栈</h2>
          <div className="mt-5 flex flex-wrap gap-2">
            {stack.map((s) => <span key={s} className="chip !text-xs">{s}</span>)}
          </div>
          <div className="mt-7 rounded-xl border border-teal-400/20 bg-teal-500/5 p-4">
            <div className="text-xs font-bold text-teal-200">✓ 发布链路</div>
            <p className="mt-2 text-xs leading-6 text-slate-400">
              本地开发预览 → 上传 GitHub 仓库 → 由 GitHub Pages 发布上线。
            </p>
          </div>
        </div>
      </section>

      <div className="mt-16 flex flex-col items-center rounded-3xl border border-violet-400/20 bg-gradient-to-br from-violet-500/10 via-transparent to-teal-500/10 px-6 py-12 text-center">
        <div className="text-3xl">🚀</div>
        <h2 className="mt-4 text-2xl font-black text-white">看看我做了什么</h2>
        <p className="mt-2 text-sm text-slate-400">从文章列表开始，慢慢了解吧。</p>
        <Link to="/" className="group mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-500 px-6 py-3 text-sm font-bold text-white shadow-glow transition-all hover:-translate-y-0.5">
          返回首页 <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
