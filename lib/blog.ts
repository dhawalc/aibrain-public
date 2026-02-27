import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  category: string
  author: string
  readTime: string
  published: boolean
  excerpt: string
}

export type BlogPost = BlogPostMeta & {
  content: string
}

type Frontmatter = Partial<{
  title: string
  description: string
  date: string
  category: string
  author: string
  readTime: string
  published: boolean
}>

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function toMeta(slug: string, data: Frontmatter, content: string): BlogPostMeta {
  const words = content.trim().split(/\s+/).length
  const excerpt = stripMarkdown(content).slice(0, 150)

  return {
    slug,
    title: data.title ?? 'Untitled',
    description: data.description ?? excerpt,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    category: data.category ?? 'General',
    author: data.author ?? 'AI Brain Team',
    readTime: data.readTime ?? `${Math.max(1, Math.ceil(words / 220))} min read`,
    published: data.published ?? false,
    excerpt: excerpt.length === 150 ? `${excerpt}...` : excerpt,
  }
}

export async function getAllArticles(): Promise<BlogPostMeta[]> {
  let files: string[] = []
  try {
    files = await fs.readdir(BLOG_DIR)
  } catch {
    return []
  }

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx?$/, '')
        const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
        const { data, content } = matter(raw)
        return toMeta(slug, data as Frontmatter, content)
      }),
  )

  return posts
    .filter((post) => post.published)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getArticleBySlug(slug: string): Promise<BlogPost | null> {
  const candidates = [path.join(BLOG_DIR, `${slug}.md`), path.join(BLOG_DIR, `${slug}.mdx`)]

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const meta = toMeta(slug, data as Frontmatter, content)
      if (!meta.published) return null
      return { ...meta, content }
    } catch {
      continue
    }
  }

  return null
}

export async function getRelatedArticles(currentSlug: string, limit = 3): Promise<BlogPostMeta[]> {
  const all = await getAllArticles()
  return all.filter((post) => post.slug !== currentSlug).slice(0, limit)
}
