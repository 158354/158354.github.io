export interface Post {
  slug: string
  file: string
  title: string
  date: string
  updated: string
  tags: string[]
  category: string
  icon: string
  color: 'violet' | 'teal' | 'amber'
  playUrl: string | null
  status: string
  excerpt: string
  readMinutes: number
}
