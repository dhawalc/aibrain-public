import type { MetadataRoute } from 'next'
import { buildBlogCategories, toCategorySlug } from '@/lib/blog-categories'
import { getAllArticles } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllArticles()
  const requestedMaxPosts = Number(process.env.SITEMAP_MAX_POSTS ?? 1000)
  const maxPosts = Number.isFinite(requestedMaxPosts) && requestedMaxPosts > 0 ? requestedMaxPosts : posts.length
  const sitemapPosts = posts.slice(0, maxPosts)
  const categories = buildBlogCategories(posts)
  const categoryLastModified = new Map<string, Date>()

  for (const post of sitemapPosts) {
    const categorySlug = toCategorySlug(post.category)
    const nextDate = new Date(post.date)
    const existing = categoryLastModified.get(categorySlug)
    if (!existing || nextDate.getTime() > existing.getTime()) {
      categoryLastModified.set(categorySlug, nextDate)
    }
  }

  return [
    // Core pages
    {
      url: `${SITE_URL}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/solutions`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/solutions/ai-approval-workflow-software`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/solutions/enterprise-agent-governance`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/solutions/erp-crm-automation`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.85,
    },
    {
      url: `${SITE_URL}/author/dhawal-chheda`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    // Interactive tools (high-value conversion pages)
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/approval-workflow-roi-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/agent-governance-risk-matrix`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    {
      url: `${SITE_URL}/tools/automation-readiness-assessment`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.9,
    },
    // Blog category hubs
    ...categories.map((category) => ({
      url: `${SITE_URL}/blog/category/${category.slug}`,
      lastModified: categoryLastModified.get(category.slug) ?? new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })),
    // Blog posts
    ...sitemapPosts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ]
}
