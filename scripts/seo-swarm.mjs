#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

const SITE_URL = 'https://qorsync.online'
const METRICS_DIR = path.join(process.cwd(), 'data', 'metrics')
const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')
const APP_DIR = path.join(process.cwd(), 'app')
const OFFPAGE_DIR = path.join(process.cwd(), 'data', 'offpage')
const SWARM_OUT_DIR = path.join(process.cwd(), 'data', 'swarm')

const DEFAULT_LIMIT = 10
const MIN_IMPRESSIONS = 5

const MESSAGE_HOOKS = [
  'Approvals are where most enterprise AI programs stall.',
  'Agent adoption fails when governance is bolted on after deployment.',
  'Cross-system automation breaks at handoffs, not at prompts.',
  'The speed/compliance tradeoff is usually an operating-model issue.',
  'Most teams automate tasks but miss approval routing economics.',
]

const PRIORITY_PATH_GUIDANCE = {
  '/': {
    title: 'Enterprise AI Workflow Automation Software | QorSync AI',
    description:
      'Automate enterprise workflows across ERP, CRM, and ITSM with governed AI agents, risk-tiered approvals, and full auditability.',
    hook: 'Start with your highest-friction workflow and map approval bottlenecks in under 10 minutes.',
  },
  '/solutions': {
    title: 'Enterprise AI Automation Solutions | QorSync AI',
    description:
      'Compare enterprise AI automation solutions for approval workflows, agent governance, and ERP/CRM orchestration with rollout guidance.',
    hook: 'Pick one workflow lane to deploy first: approvals, governance, or cross-system handoffs.',
  },
  '/solutions/ai-approval-workflow-software': {
    title: 'AI Approval Workflow Software for Enterprise Ops | QorSync AI',
    description:
      'Deploy risk-tiered AI approval workflow software with SLA routing, escalation logic, and audit-ready decision records.',
    hook: 'Route low-risk approvals instantly and escalate critical actions with policy checkpoints.',
  },
  '/solutions/enterprise-agent-governance': {
    title: 'Enterprise Agent Governance Platform | QorSync AI',
    description:
      'Define policy boundaries, human checkpoints, and controls for enterprise AI agents across ERP, CRM, and ITSM operations.',
    hook: 'Set autonomy boundaries before scaling agent execution across critical systems.',
  },
  '/solutions/erp-crm-automation': {
    title: 'ERP and CRM Workflow Automation with AI Agents | QorSync AI',
    description:
      'Automate SAP, Oracle, NetSuite, Salesforce, and ServiceNow handoffs with governed AI agent orchestration and exception handling.',
    hook: 'Eliminate queue delays between ERP and CRM teams with governed multi-system automation.',
  },
  '/tools/approval-workflow-roi-calculator': {
    title: 'Approval Workflow ROI Calculator | QorSync AI',
    description:
      'Estimate cycle-time savings, labor impact, and ROI from governed approval workflow automation in enterprise operations.',
    hook: 'Use current approval volume to quantify time and cost savings before implementation.',
  },
  '/tools/agent-governance-risk-matrix': {
    title: 'AI Agent Governance Risk Matrix Tool | QorSync AI',
    description:
      'Classify agent actions by risk and generate recommended human-in-the-loop controls, audit requirements, and policy gates.',
    hook: 'Map each action to autonomy, notify, or approval tiers in minutes.',
  },
  '/tools/automation-readiness-assessment': {
    title: 'Workflow Automation Readiness Assessment | QorSync AI',
    description:
      'Assess process maturity, data readiness, and governance fit for enterprise AI workflow automation rollout.',
    hook: 'Score readiness across process, data, and policy before scaling automation.',
  },
  '/blog/ai-agent-risk-tiering-framework': {
    title: 'AI Agent Risk Tiering Framework for Enterprise Teams',
    description:
      'Learn how to design risk-tiered autonomy with approval gates, rollback controls, and auditability for enterprise AI operations.',
    hook: 'Turn ambiguous governance into concrete risk tiers your teams can execute.',
  },
  '/blog/ai-approval-workflow': {
    title: 'AI Approval Workflow Design for Faster Enterprise Decisions',
    description:
      'Build AI approval workflows with SLA routing, escalation logic, and governance controls to reduce cycle-time without losing oversight.',
    hook: 'Cut approval latency while preserving compliance using risk-aware routing.',
  },
  '/blog/enterprise-agent-governance-checklist': {
    title: 'Enterprise Agent Governance Checklist for AI Operations',
    description:
      'Use this practical checklist to define controls, ownership, and human checkpoints for enterprise AI agent deployments.',
    hook: 'Audit your current governance stack against a production-grade control checklist.',
  },
  '/blog/enterprise-task-routing-with-ai-agents': {
    title: 'Enterprise Task Routing with AI Agents: Architecture and Controls',
    description:
      'Design AI agent routing across enterprise systems with queue policies, escalation paths, and reliability controls.',
    hook: 'Fix queue backlogs by combining routing intelligence with governance rules.',
  },
  '/blog/hitl-governance-design-patterns': {
    title: 'HITL Governance Design Patterns for Enterprise AI Workflows',
    description:
      'Explore human-in-the-loop governance patterns to scale autonomous agents safely across enterprise workflows.',
    hook: 'Use proven HITL patterns to avoid runaway autonomy and manual bottlenecks.',
  },
}

function getArg(flag, fallback = '') {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

function normalizePath(pageUrl) {
  if (!pageUrl) return ''
  try {
    const parsed = new URL(pageUrl)
    return parsed.pathname || '/'
  } catch {
    return pageUrl.startsWith('/') ? pageUrl : `/${pageUrl}`
  }
}

function titleCase(slug) {
  return slug
    .split('-')
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(' ')
}

function fallbackGuidance(pathname) {
  const slug = pathname.replace(/^\/+|\/+$/g, '').split('/').pop() || 'Enterprise AI Automation'
  const label = titleCase(slug)
  return {
    title: `${label} | QorSync AI`,
    description:
      'Practical implementation guidance for enterprise AI workflow automation, governance controls, and cross-system execution reliability.',
    hook: `Use this page to evaluate ${label.toLowerCase()} rollout fit and governance boundaries.`,
  }
}

async function readLatestMetrics() {
  const files = await fs.readdir(METRICS_DIR)
  const snapshots = files.filter((file) => file.endsWith('.json')).sort()
  if (snapshots.length === 0) {
    throw new Error(`No metrics snapshots found in ${METRICS_DIR}`)
  }
  const latestSnapshot = snapshots[snapshots.length - 1]
  const raw = await fs.readFile(path.join(METRICS_DIR, latestSnapshot), 'utf-8')
  return JSON.parse(raw)
}

async function loadPublishedBlogPosts() {
  const postsByPath = new Map()
  const files = await fs.readdir(BLOG_DIR)

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    const filePath = path.join(BLOG_DIR, file)
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data } = matter(raw)
    if (data.published !== true) continue
    const slug = file.replace(/\.mdx?$/, '')
    postsByPath.set(`/blog/${slug}`, {
      title: String(data.title || '').trim(),
      description: String(data.description || '').trim(),
      category: String(data.category || 'General').trim(),
      date: String(data.date || '').trim(),
    })
  }

  return postsByPath
}

function parseCsv(raw) {
  const lines = raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
  if (lines.length < 2) return []
  const headers = lines[0].split(',').map((value) => value.trim())
  return lines.slice(1).map((line) => {
    const cells = line.split(',')
    const row = {}
    headers.forEach((header, index) => {
      row[header] = (cells[index] || '').trim()
    })
    return row
  })
}

async function readCsvOrEmpty(filePath) {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return parseCsv(raw)
  } catch {
    return []
  }
}

async function collectInternalLinkCoverage(paths) {
  const allFiles = []
  const appFiles = await fs.readdir(APP_DIR, { recursive: true })
  for (const file of appFiles) {
    if (typeof file !== 'string') continue
    if (!file.endsWith('.tsx') && !file.endsWith('.ts') && !file.endsWith('.md') && !file.endsWith('.mdx')) continue
    allFiles.push(path.join(APP_DIR, file))
  }

  const contentFiles = await fs.readdir(BLOG_DIR)
  for (const file of contentFiles) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    allFiles.push(path.join(BLOG_DIR, file))
  }

  const counts = new Map(paths.map((value) => [value, 0]))
  await Promise.all(
    allFiles.map(async (filePath) => {
      const raw = await fs.readFile(filePath, 'utf-8')
      for (const targetPath of paths) {
        const absoluteUrl = `${SITE_URL}${targetPath}`
        const patternCount =
          (raw.match(new RegExp(targetPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length +
          (raw.match(new RegExp(absoluteUrl.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length
        if (patternCount > 0) {
          counts.set(targetPath, (counts.get(targetPath) || 0) + patternCount)
        }
      }
    }),
  )

  return counts
}

function getCtrOpportunities(metrics, limit) {
  const rows = metrics.gsc?.rows || []
  return rows
    .map((row) => {
      const pathname = normalizePath(row.page)
      return {
        page: row.page || `${SITE_URL}${pathname}`,
        path: pathname,
        impressions: Number(row.impressions || 0),
        clicks: Number(row.clicks || 0),
        ctr: Number(row.ctr || 0),
        position: Number(row.position || 0),
      }
    })
    .filter((row) => row.impressions >= MIN_IMPRESSIONS && row.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, limit)
}

function getPositionOpportunities(metrics, limit) {
  const rows = metrics.gsc?.rows || []
  return rows
    .map((row) => {
      const pathname = normalizePath(row.page)
      return {
        page: row.page || `${SITE_URL}${pathname}`,
        path: pathname,
        impressions: Number(row.impressions || 0),
        clicks: Number(row.clicks || 0),
        ctr: Number(row.ctr || 0),
        position: Number(row.position || 0),
      }
    })
    .filter((row) => row.impressions >= MIN_IMPRESSIONS && row.position > 0 && row.position <= 20)
    .sort((a, b) => a.position - b.position)
    .slice(0, limit)
}

function findLegacySlugRows(rows) {
  const legacyMarkers = ['-implementation-bluepri', '-practical-playbook', '/human-in-the-loop-governance-model']
  return rows.filter((row) => legacyMarkers.some((marker) => row.path.includes(marker)))
}

function buildCtrRecommendations(opportunities, blogMap) {
  return opportunities.map((row) => {
    const mapped = PRIORITY_PATH_GUIDANCE[row.path] || fallbackGuidance(row.path)
    const blogPost = blogMap.get(row.path)

    return {
      ...row,
      suggestedTitle: mapped.title,
      suggestedDescription: mapped.description,
      hook: mapped.hook,
      sourceHint: blogPost ? `blog:${blogPost.category || 'General'}` : row.path.startsWith('/tools') ? 'tool' : 'page',
    }
  })
}

function pickPriorityUrls(ctrRows, positionRows) {
  const byPath = new Map()
  for (const row of [...ctrRows, ...positionRows]) {
    if (!byPath.has(row.path)) byPath.set(row.path, row)
  }
  return Array.from(byPath.values())
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 5)
    .map((row) => row.path)
}

function buildDistributionDrafts(priorityPaths) {
  const picks = priorityPaths.length > 0 ? priorityPaths : ['/solutions', '/blog/ai-approval-workflow']
  const drafts = []
  for (let index = 0; index < 5; index += 1) {
    const pathPick = picks[index % picks.length]
    const url = `${SITE_URL}${pathPick}`
    const hook = MESSAGE_HOOKS[index % MESSAGE_HOOKS.length]
    drafts.push(
      `Draft ${index + 1}: ${hook} If you are scaling enterprise AI workflows, this breakdown is practical and implementation-first: ${url}`,
    )
  }
  return drafts
}

function buildOutreachDrafts(priorityPaths) {
  const picks = priorityPaths.length > 0 ? priorityPaths : ['/solutions', '/tools/approval-workflow-roi-calculator']
  const outreach = []
  for (let index = 0; index < 5; index += 1) {
    const pathPick = picks[index % picks.length]
    const url = `${SITE_URL}${pathPick}`
    outreach.push(
      [
        `Template ${index + 1}:`,
        'Subject: Practical enterprise AI workflow resource for your audience',
        '',
        `Hi [Name], sharing a resource that your enterprise operations audience may find useful: ${url}`,
        'It focuses on governed AI execution with risk-tiered approvals and measurable workflow outcomes.',
        'If useful, happy to provide a concise summary or screenshot pack for your roundup/newsletter.',
      ].join('\n'),
    )
  }
  return outreach
}

function formatPct(value) {
  return `${(value * 100).toFixed(2)}%`
}

function todayDate() {
  return new Date().toISOString().slice(0, 10)
}

function estimateKpiTargets(metrics) {
  const users = Number(metrics.summary?.ga4TotalUsers || 0)
  const sessions = Number(metrics.summary?.ga4TotalSessions || 0)
  const impressions = Number(metrics.summary?.gscTotalImpressions || 0)
  const clicks = Number(metrics.summary?.gscTotalClicks || 0)

  const targetUsers = Math.max(10, Math.ceil(users * 3))
  const targetSessions = Math.max(12, Math.ceil(sessions * 3))
  const targetImpressions = Math.max(300, Math.ceil(impressions * 1.8))
  const targetClicks = Math.max(8, Math.ceil(clicks + Math.max(5, impressions * 0.02)))

  return { targetUsers, targetSessions, targetImpressions, targetClicks }
}

function createReport({
  metrics,
  ctrRecommendations,
  positionOpportunities,
  legacyRows,
  internalCoverage,
  priorityPaths,
  directoryRows,
  outreachRows,
  partnerRows,
}) {
  const summary = metrics.summary || {}
  const targets = estimateKpiTargets(metrics)

  const lines = [
    '# SEO Expert Swarm Board',
    '',
    '- Model tier: `gpt-5.4`',
    '- Reasoning profile: `xhigh`',
    `- Generated: ${new Date().toISOString()}`,
    `- Date range: ${metrics.range?.startDate || '-'} to ${metrics.range?.endDate || '-'}`,
    '',
    '## Baseline',
    `- Users: ${summary.ga4TotalUsers ?? 0}`,
    `- New users: ${summary.ga4NewUsers ?? 0}`,
    `- Sessions: ${summary.ga4TotalSessions ?? 0}`,
    `- Views: ${summary.ga4TotalViews ?? 0}`,
    `- GSC clicks: ${summary.gscTotalClicks ?? 0}`,
    `- GSC impressions: ${summary.gscTotalImpressions ?? 0}`,
    '',
    '## Swarm Targets (next 7 days)',
    `- Users: ${targets.targetUsers}+`,
    `- Sessions: ${targets.targetSessions}+`,
    `- Impressions: ${targets.targetImpressions}+`,
    `- Clicks: ${targets.targetClicks}+`,
    '',
    '## Technical SEO Lead',
    legacyRows.length > 0
      ? `- P0: Legacy indexed URLs detected (${legacyRows.length}). Add/verify redirects + canonical on those legacy slugs before scaling distribution.`
      : '- P0: No legacy indexed URL pattern detected in the top opportunity set.',
    `- P0: Add internal links to top priority pages with low coverage (${priorityPaths
      .filter((pathValue) => (internalCoverage.get(pathValue) || 0) < 3)
      .join(', ') || 'none'}).`,
    '- P1: Re-submit sitemap and IndexNow immediately after metadata and internal-link updates.',
    '- P1: Keep solution and tool pages in priority sitemaps with daily or weekly refresh cadence.',
    '',
    '## On-Page + CTR Lead (Top Opportunities)',
  ]

  for (const item of ctrRecommendations.slice(0, 10)) {
    lines.push(
      `- ${item.path} | imp=${item.impressions}, pos=${item.position.toFixed(1)}, ctr=${formatPct(item.ctr)} | title="${item.suggestedTitle}" | desc="${item.suggestedDescription}" | hook="${item.hook}"`,
    )
  }

  if (positionOpportunities.length > 0) {
    lines.push('', '## Position Wins (<=20)', ...positionOpportunities.slice(0, 10).map((item) => `- ${item.path} | imp=${item.impressions}, pos=${item.position.toFixed(1)}`))
  }

  lines.push('', '## Off-Page + Distribution Lead')

  const pendingDirectories = directoryRows.filter((row) => ['pending', 'submitted', 'in-review', ''].includes((row.status || '').toLowerCase()))
  const dueOutreach = outreachRows.filter((row) => (row.status || '').toLowerCase() !== 'closed')
  const duePartners = partnerRows.filter((row) => (row.status || '').toLowerCase() !== 'closed')

  lines.push(`- Directory queue pending: ${pendingDirectories.length}`)
  lines.push(`- Outreach queue open: ${dueOutreach.length}`)
  lines.push(`- Partnership queue open: ${duePartners.length}`)
  lines.push(`- Priority URLs for distribution: ${priorityPaths.map((value) => `${SITE_URL}${value}`).join(', ') || `${SITE_URL}/solutions`}`)
  lines.push('- Distribution quota today: publish 2+ assets, send 10+ outreach touches, follow up all overdue directory submissions.')

  lines.push('', '## Analytics + Experimentation Lead')
  lines.push('- Track daily: users, sessions, impressions, clicks, and demo-intent events.')
  lines.push('- Run metadata A/B variants for top 3 impression pages until at least one page reaches >1.5% CTR.')
  lines.push('- Kill channels that produce traffic but zero tool starts after 7 days.')
  lines.push('', '## 24h Execution Checklist')
  lines.push('- [ ] Update title + description + first-screen copy for top 5 CTR opportunities.')
  lines.push('- [ ] Add 3 to 5 internal links from homepage, blog index, and solution pages to those URLs.')
  lines.push('- [ ] Publish 2 distribution posts and 1 community post with UTM-tagged links.')
  lines.push('- [ ] Run `npm run indexnow:submit` after publishing updates.')
  lines.push('- [ ] Record end-of-day metrics and compare against baseline.')

  return lines.join('\n')
}

function createDistributionPack(priorityPaths) {
  const distribution = buildDistributionDrafts(priorityPaths)
  const outreach = buildOutreachDrafts(priorityPaths)

  const lines = ['# Distribution Pack', '', `- Date: ${todayDate()}`, '', '## Channel Drafts']
  distribution.forEach((draft, index) => lines.push(`${index + 1}. ${draft}`))
  lines.push('', '## Outreach Drafts')
  outreach.forEach((draft, index) => {
    lines.push(`${index + 1}.`)
    lines.push('')
    lines.push(draft)
    lines.push('')
  })

  return lines.join('\n')
}

async function saveOutput(fileName, content) {
  await fs.mkdir(SWARM_OUT_DIR, { recursive: true })
  const outputPath = path.join(SWARM_OUT_DIR, fileName)
  await fs.writeFile(outputPath, content, 'utf-8')
  return outputPath
}

async function main() {
  const limitArg = Number(getArg('--limit', String(DEFAULT_LIMIT)))
  const limit = Number.isFinite(limitArg) && limitArg > 0 ? limitArg : DEFAULT_LIMIT
  const shouldSave = !hasFlag('--no-save')

  const [metrics, blogMap, directoryRows, outreachRows, partnerRows] = await Promise.all([
    readLatestMetrics(),
    loadPublishedBlogPosts(),
    readCsvOrEmpty(path.join(OFFPAGE_DIR, 'directory-tracker.csv')),
    readCsvOrEmpty(path.join(OFFPAGE_DIR, 'outreach-pipeline.csv')),
    readCsvOrEmpty(path.join(OFFPAGE_DIR, 'partnership-pipeline.csv')),
  ])

  const ctrOpportunities = getCtrOpportunities(metrics, limit)
  const positionOpportunities = getPositionOpportunities(metrics, limit)
  const legacyRows = findLegacySlugRows(ctrOpportunities)
  const priorityPaths = pickPriorityUrls(ctrOpportunities, positionOpportunities)
  const internalCoverage = await collectInternalLinkCoverage(priorityPaths)
  const ctrRecommendations = buildCtrRecommendations(ctrOpportunities, blogMap)

  const report = createReport({
    metrics,
    ctrRecommendations,
    positionOpportunities,
    legacyRows,
    internalCoverage,
    priorityPaths,
    directoryRows,
    outreachRows,
    partnerRows,
  })

  const pack = createDistributionPack(priorityPaths)

  console.log(report)
  console.log('\n## Distribution Pack (preview)')
  for (const line of pack.split('\n').slice(0, 18)) {
    console.log(line)
  }

  if (shouldSave) {
    const date = todayDate()
    const reportPath = await saveOutput(`seo-swarm-${date}.md`, report)
    const packPath = await saveOutput(`distribution-pack-${date}.md`, pack)
    console.log(`\nSaved swarm report: ${reportPath}`)
    console.log(`Saved distribution pack: ${packPath}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
