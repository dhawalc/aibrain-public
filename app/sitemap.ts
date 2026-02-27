import type { MetadataRoute } from 'next'
import { getAllArticles } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllArticles()

  return [
    {
      url: `${SITE_URL}/landing`,
      lastModified: new Date(),
    },
    {
      url: `${SITE_URL}/blog`,
      lastModified: new Date(),
    },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ]
}
