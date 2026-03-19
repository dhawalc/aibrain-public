import { getAllArticles } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

export async function GET() {
  const posts = (await getAllArticles({ includeTemplated: false })).slice(0, 100)

  // Separate pillar content from supporting articles by word count
  const pillarPosts = posts.filter((p) => p.wordCount >= 800)
  const supportingPosts = posts.filter((p) => p.wordCount < 800 && p.wordCount >= 400)

  const lines = [
    '# QorSync AI',
    '',
    '> QorSync AI is an autonomous enterprise operations platform by Accel4.',
    '> It provides governed multi-system execution where AI agents handle',
    '> operational workflows with human approvals at critical checkpoints.',
    '',
    `Homepage: ${SITE_URL}`,
    `Blog: ${SITE_URL}/blog`,
    `Author: ${SITE_URL}/author/dhawal-chheda`,
    `RSS: ${SITE_URL}/rss.xml`,
    '',
    '## Interactive Tools',
    '',
    `- Approval Workflow ROI Calculator: ${SITE_URL}/tools/approval-workflow-roi-calculator`,
    '  Estimate hours saved, labor impact, and cycle-time improvement from governed approval automation.',
    '',
    `- AI Agent Governance Risk Matrix: ${SITE_URL}/tools/agent-governance-risk-matrix`,
    '  Classify AI agent actions into risk tiers and get recommended approval patterns and governance controls.',
    '',
    `- Workflow Automation Readiness Assessment: ${SITE_URL}/tools/automation-readiness-assessment`,
    '  Evaluate readiness for AI-powered workflow automation across process maturity, data quality, and governance.',
    '',
    '## Pillar Articles',
    '',
    ...pillarPosts.map((post) => `- ${post.title}: ${SITE_URL}/blog/${post.slug}`),
    '',
    '## Supporting Articles',
    '',
    ...supportingPosts.map((post) => `- ${post.title}: ${SITE_URL}/blog/${post.slug}`),
  ]

  return new Response(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, s-maxage=3600',
    },
  })
}
