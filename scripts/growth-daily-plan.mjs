#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import process from 'process'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const SITE_URL = 'https://qorsync.online'
const CTR_PRIORITY_SLUGS = [
  'ai-agent-risk-tiering-framework',
  'ai-approval-workflow',
  'enterprise-agent-governance-checklist',
  'enterprise-task-routing-with-ai-agents',
  'hitl-governance-design-patterns',
]

const DAY_PLAYBOOK = {
  1: [
    'Submit updated sitemap and priority sitemap in Search Console and Bing Webmaster Tools.',
    'Publish 1 LinkedIn founder post + 1 carousel using governance article cluster.',
    'Submit profiles to 3 free directories (SaaSHub, AlternativeTo, Peerlist).',
  ],
  2: [
    'Publish 1 technical breakdown post featuring AI approval workflow and ROI calculator.',
    'Post one discussion thread in a relevant community (Reddit, Hacker News, or LinkedIn groups).',
    'Email 10 target partners for newsletter swaps or roundup inclusion.',
  ],
  3: [
    'Publish 1 case-study style post on task routing outcomes and SLA gains.',
    'Submit to 2 additional directories (Capterra, G2).',
    'Add 3 contextual internal links from older posts into priority CTR pages.',
  ],
  4: [
    'Publish one short video demo clip showing approval flow + tool workflow.',
    'Launch 1 founder comment sprint: 20 comments on relevant AI operations threads.',
    'Request indexing for 5 newly published or updated URLs.',
  ],
  5: [
    'Publish “governance checklist” post and link to tool pages.',
    'Run outreach to 10 podcasts/newsletters in enterprise AI automation.',
    'Resubmit IndexNow for updated URL set.',
  ],
  6: [
    'Publish one comparison post (manual process vs governed agents) with metrics table.',
    'Create 1 Reddit or Hacker News post with neutral educational framing.',
    'Review GSC queries and add 5 FAQ-style paragraph updates to underperforming pages.',
  ],
  7: [
    'Ship weekly recap thread with top insights + links to best performing pages.',
    'Follow up all pending directory submissions.',
    'Refresh sitemap submission and verify crawl stats.',
  ],
  8: [
    'Start second-week cycle with AI memory systems topic cluster.',
    'Publish one architecture post + one image carousel.',
    'Pitch 10 AI infra newsletters for curated inclusion.',
  ],
  9: [
    'Publish one “lessons learned” post from deployment decisions.',
    'Add 5 new internal links from memory cluster to governance cluster.',
    'Request indexing for newly updated URLs.',
  ],
  10: [
    'Publish one benchmark or decision-matrix thread.',
    'Run outreach to 10 consultants or boutique agencies for co-distribution.',
    'Add one downloadable checklist or template CTA to top post.',
  ],
  11: [
    'Publish one short-form post focused on a single pain point keyword.',
    'Share same topic in 2 communities with channel-specific framing.',
    'Audit title/description CTR on top 20 impression URLs and update lowest 5.',
  ],
  12: [
    'Publish one video or slide explainer for enterprise approval design.',
    'Submit to any pending directories with manual review queues.',
    'Run IndexNow + sitemap resubmission.',
  ],
  13: [
    'Publish one founder POV post on governance mistakes and fixes.',
    'Re-engage all prior outreach contacts with new assets.',
    'Add one reciprocal internal link section to newest 3 posts.',
  ],
  14: [
    'Publish sprint recap: what worked, what failed, and next experiments.',
    'Compile KPI outcomes and freeze winning templates for next sprint.',
    'Plan next 14 days based on top-converting queries and pages.',
  ],
}

function getArg(flag, fallback = '') {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

function inferTopicBucket(post) {
  const category = (post.category || '').toLowerCase()
  const slug = post.slug.toLowerCase()

  if (category.includes('governance') || slug.includes('approval') || slug.includes('risk') || slug.includes('governance')) {
    return 'governance'
  }
  if (category.includes('memory') || slug.includes('memory') || slug.includes('knowledge-graph')) {
    return 'memory'
  }
  if (category.includes('trading') || slug.includes('spx') || slug.includes('0dte') || slug.includes('gex')) {
    return 'trading'
  }
  return 'general'
}

async function loadPosts() {
  const files = await fs.readdir(BLOG_DIR)
  const posts = []

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
    const { data, content } = matter(raw)
    if (data.published !== true) continue

    posts.push({
      slug: file.replace(/\.mdx?$/, ''),
      title: data.title || 'Untitled',
      category: data.category || 'General',
      date: data.date || '1970-01-01',
      words: content.split(/\s+/).filter(Boolean).length,
    })
  }

  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

function pickTop(posts, bucket, limit) {
  return posts.filter((post) => inferTopicBucket(post) === bucket).slice(0, limit)
}

async function main() {
  const dayArg = Number(getArg('--day', '1'))
  const day = Number.isFinite(dayArg) && dayArg >= 1 && dayArg <= 14 ? dayArg : 1

  const posts = await loadPosts()
  const governance = pickTop(posts, 'governance', 4)
  const memory = pickTop(posts, 'memory', 4)
  const trading = pickTop(posts, 'trading', 3)
  const recent = posts.slice(0, 6)
  const slugSet = new Set(posts.map((post) => post.slug))
  const priority = CTR_PRIORITY_SLUGS.filter((slug) => slugSet.has(slug))

  console.log(`# Growth Sprint Day ${day}`)
  console.log('')
  console.log('## Daily Actions')
  for (const task of DAY_PLAYBOOK[day] || []) {
    console.log(`- ${task}`)
  }
  console.log('')
  console.log('## Priority URLs')
  console.log(`- ${SITE_URL}/blog`)
  console.log(`- ${SITE_URL}/tools`)
  for (const slug of priority) {
    console.log(`- ${SITE_URL}/blog/${slug}`)
  }
  for (const post of recent) {
    console.log(`- ${SITE_URL}/blog/${post.slug}`)
  }
  console.log('')
  console.log('## Topic Queue: Governance')
  for (const post of governance) {
    console.log(`- ${post.title} (${SITE_URL}/blog/${post.slug})`)
  }
  console.log('')
  console.log('## Topic Queue: Memory Systems')
  for (const post of memory) {
    console.log(`- ${post.title} (${SITE_URL}/blog/${post.slug})`)
  }
  console.log('')
  console.log('## Topic Queue: SPX / Trading')
  for (const post of trading) {
    console.log(`- ${post.title} (${SITE_URL}/blog/${post.slug})`)
  }
  console.log('')
  console.log('## KPI Targets For Today')
  console.log('- Publish at least 2 distribution assets (post, thread, or video).')
  console.log('- Generate at least 5 referring-domain outreach touches.')
  console.log('- Update and request indexing for at least 5 URLs.')
  console.log('- Record end-of-day metrics: impressions, clicks, average position, sessions.')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
