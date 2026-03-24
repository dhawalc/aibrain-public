import type { BlogPostMeta } from '@/lib/blog'

export type BlogCategory = {
  slug: string
  label: string
  count: number
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function toCategorySlug(category: string): string {
  const normalized = category.trim()
  const slug = slugify(normalized)
  return slug || 'general'
}

function normalizeCategory(category: string | undefined): string {
  const normalized = category?.trim()
  return normalized && normalized.length > 0 ? normalized : 'General'
}

export function buildBlogCategories(posts: Array<Pick<BlogPostMeta, 'category'>>): BlogCategory[] {
  const categoryMap = new Map<string, BlogCategory>()

  for (const post of posts) {
    const label = normalizeCategory(post.category)
    const slug = toCategorySlug(label)
    const existing = categoryMap.get(slug)

    if (existing) {
      existing.count += 1
      continue
    }

    categoryMap.set(slug, { slug, label, count: 1 })
  }

  return Array.from(categoryMap.values()).sort((a, b) => {
    if (b.count !== a.count) return b.count - a.count
    return a.label.localeCompare(b.label)
  })
}

export function filterPostsByCategorySlug(posts: BlogPostMeta[], slug: string): BlogPostMeta[] {
  return posts.filter((post) => toCategorySlug(normalizeCategory(post.category)) === slug)
}

