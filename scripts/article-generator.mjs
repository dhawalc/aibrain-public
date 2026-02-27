#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

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

async function generateWithOpenAI(topic) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const prompt = `Write a practical blog article for SAP/enterprise architects on this topic: ${topic}.\n\nRequirements:\n- 1,000-1,300 words\n- clear sections\n- actionable bullets\n- no fluff\n- markdown format\n- include a concise 150-char meta description line as: META_DESCRIPTION: ...\n`;

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      input: prompt,
      max_output_tokens: 2200,
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
  const description = (metaMatch?.[1] || `Analysis and strategy for ${topic}.`).trim()
  const content = text.replace(/META_DESCRIPTION:\s*.+/i, '').trim()
  return { description, content }
}

function generateFallback(topic) {
  return {
    description: `A practical guide to ${topic} for SAP and enterprise architecture teams.`,
    content: `# ${topic}\n\n## Why this matters\n\n${topic} affects delivery speed, risk, and architecture decisions across SAP programs.\n\n## Common failure patterns\n\n- Teams optimize tooling before agreeing on operating model\n- No baseline for current-state process/object landscape\n- Governance is added late, after integration debt accumulates\n\n## Recommended approach\n\n1. Establish current-state visibility first\n2. Define target-state constraints early (security, latency, ownership)\n3. Pilot in one domain and capture measurable outcomes\n4. Scale with standard patterns and review checkpoints\n\n## Implementation checklist\n\n- Confirm stakeholders and ownership boundaries\n- Inventory integration points and data contracts\n- Define KPIs and observability signals\n- Build migration waves with rollback plans\n\n## Final takeaways\n\nTeams that treat ${topic} as an architecture capability, not a one-time project task, reduce risk and ship faster.`,
  }
}

async function main() {
  const topic = getArg('--topic')
  const category = getArg('--category', 'SAP Strategy')
  const author = getArg('--author', 'AI Brain Team')
  const forceSlug = getArg('--slug')

  if (!topic) {
    throw new Error('Missing required --topic argument')
  }

  const slug = forceSlug || slugify(topic)
  const outDir = path.join(process.cwd(), 'content', 'blog')
  const outPath = path.join(outDir, `${slug}.md`)

  const generated = (await generateWithOpenAI(topic)) || generateFallback(topic)

  const markdown = `---\ntitle: "${topic.replace(/"/g, '\\"')}"\ndescription: "${generated.description.replace(/"/g, '\\"')}"\ndate: "${new Date().toISOString().slice(0, 10)}"\ncategory: "${category.replace(/"/g, '\\"')}"\nauthor: "${author.replace(/"/g, '\\"')}"\nreadTime: "8 min read"\npublished: false\n---\n\n${generated.content}\n`

  await mkdir(outDir, { recursive: true })
  await writeFile(outPath, markdown, 'utf-8')

  console.log(`Generated draft article: ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
