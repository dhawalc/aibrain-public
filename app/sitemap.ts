import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllArticles()

  return [
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
      url: `${SITE_URL}/author/dhawal-chheda`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${SITE_URL}/tools`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/approval-workflow-roi-calculator`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/agent-governance-risk-matrix`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${SITE_URL}/tools/automation-readiness-assessment`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
  ]
}
