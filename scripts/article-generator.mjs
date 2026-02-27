#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

const ALLOWED_CATEGORIES = [
  'Enterprise Architecture Discovery',
  'Cross-System Integration Patterns',
  'Agentic Automation & Orchestration',
  'Governance, Risk & Compliance',
  'Security & Platform Operations',
  'ROI & Transformation Strategy',
  'Implementation Playbooks',
  'SAP Deep Dives',
  'Oracle & NetSuite Playbooks',
  'Salesforce & GTM Operations',
]

function getArg(flag, fallback = '') {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

function pickCategory(requested) {
  if (ALLOWED_CATEGORIES.includes(requested)) return requested
  return 'Agentic Automation & Orchestration'
}

async function generateWithOpenAI(topic, category) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const prompt = `You are writing for QorSync AI (an Accel4 product), an enterprise AI operations platform.

Topic: ${topic}
Category: ${category}

Write a practical blog article for enterprise operators, architects, and transformation leaders.

Hard requirements:
- 900-1300 words
- markdown format only
- clear section headers
- concrete steps and checklists
- realistic claims (no hype, no workforce-replacement language)
- include human-in-the-loop governance guidance
- include at least one cross-system example (ERP/CRM/ITSM/data)
- include one short KPI table in markdown
- include a concise SEO line in this exact format: META_DESCRIPTION: ...
`

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      input: prompt,
      max_output_tokens: 2500,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenAI API error: ${response.status} ${text}`)
  }

  const json = await response.json()
  const text = json.output_text || ''
  if (!text) return null

  const metaMatch = text.match(/META_DESCRIPTION:\s*(.+)/i)
  const description = (metaMatch?.[1] || `A practical guide to ${topic} for enterprise teams.`).trim()
  const content = text.replace(/META_DESCRIPTION:\s*.+/i, '').trim()
  return { description, content }
}

function generateFallback(topic, category) {
  return {
    description: `A practical ${category.toLowerCase()} guide for autonomous enterprise operations with QorSync AI.`,
    content: `# ${topic}

## Why this matters

${topic} directly impacts execution speed, policy compliance, and operating cost across enterprise systems.

## What teams usually get wrong

- Automating tasks without clear ownership or risk thresholds
- Running disconnected tools across ERP, CRM, ITSM, and data stacks
- Missing approval design for high-impact actions
- Measuring activity instead of measurable business outcomes

## QorSync AI operating model

1. **Discover reality**: map systems, process objects, and dependencies
2. **Apply governance**: define risk tiers and approval checkpoints
3. **Execute with agents**: automate repetitive and low-risk work
4. **Improve continuously**: use audit logs and feedback to tune behavior

## Human-in-the-loop design checklist

- Define low, medium, and high-risk action classes
- Require explicit approval for financial, customer-impact, and security-sensitive actions
- Ensure every action is logged with context and actor lineage
- Set escalation time targets for approval queues

## KPI table

| KPI | Before | After |\n| --- | --- | --- |\n| Cycle time | 5-10 days | 1-2 days |\n| Manual touch rate | 80%+ | <20% |\n| Escalation rate | High | Controlled with risk gating |

## Implementation playbook (first 30 days)

- Week 1: baseline systems and process-object inventory
- Week 2: onboard integrations and define policy rules
- Week 3: launch pilot automations with approval gates
- Week 4: measure outcomes and expand to next workflow domain

## Final takeaways

Treat ${topic} as an operating capability, not a one-off project. Teams that combine autonomous execution with governance deliver speed without losing control.
`,
  }
}

async function main() {
  const topic = getArg('--topic')
  const requestedCategory = getArg('--category', 'Agentic Automation & Orchestration')
  const category = pickCategory(requestedCategory)
  const author = getArg('--author', 'Dhawal Chheda, AI Leader at Accel4')
  const publishArg = getArg('--publish', 'false').toLowerCase()
  const published = publishArg === 'true' || publishArg === '1' || publishArg === 'yes'
  const forceSlug = getArg('--slug')

  if (!topic) {
    throw new Error('Missing required --topic argument')
  }

  const slug = forceSlug || slugify(topic)
  const outDir = path.join(process.cwd(), 'content', 'blog')
  const outPath = path.join(outDir, `${slug}.md`)

  const generated = (await generateWithOpenAI(topic, category)) || generateFallback(topic, category)

  const markdown = `---\ntitle: "${topic.replace(/"/g, '\\"')}"\ndescription: "${generated.description.replace(/"/g, '\\"')}"\ndate: "${new Date().toISOString().slice(0, 10)}"\ncategory: "${category.replace(/"/g, '\\"')}"\nauthor: "${author.replace(/"/g, '\\"')}"\nreadTime: "8 min read"\npublished: ${published}\n---\n\n${generated.content}\n`

  await mkdir(outDir, { recursive: true })
  await writeFile(outPath, markdown, 'utf-8')

  console.log(`Generated draft article: ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
