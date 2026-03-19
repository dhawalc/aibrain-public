import { getAllArticles } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export async function GET() {
  const posts = (await getAllArticles({ includeTemplated: false })).slice(0, 80)
  const lines = [
    'User-agent: *',
    `Homepage: ${SITE_URL}/landing`,
    `Blog Index: ${SITE_URL}/blog`,
    '',
    'About:',
    'QorSync AI is an autonomous enterprise operations platform for governed multi-system execution.',
    '',
    'High-value articles:',
    ...posts.map((post) => `- ${SITE_URL}/blog/${post.slug}`),
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
