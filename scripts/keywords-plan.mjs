#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

function getArg(flag, fallback = '') {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

const CATEGORY_KEYWORDS = [
  {
    category: 'Agentic Automation & Orchestration',
    seeds: [
      'agent orchestration for enterprise workflows',
      'multi-agent execution playbook',
      'autonomous operations with human approval',
      'enterprise task routing with ai agents',
      'agent failure recovery strategy',
    ],
  },
  {
    category: 'Cross-System Integration Patterns',
    seeds: [
      'erp crm integration automation',
      'cross-system process synchronization',
      'api-first operations control plane',
      'data contract governance for integrations',
      'event-driven enterprise workflow automation',
    ],
  },
  {
    category: 'Governance, Risk & Compliance',
    seeds: [
      'human in the loop governance model',
      'ai approval workflow design',
      'audit trail for autonomous systems',
      'policy-based execution controls',
      'enterprise ai compliance checklist',
    ],
  },
  {
    category: 'ROI & Transformation Strategy',
    seeds: [
      'autonomous enterprise roi model',
      'reduce manual operations cost with ai',
      'transformation roadmap with ai agents',
      'change management for autonomous operations',
      'kpi framework for enterprise ai execution',
    ],
  },
  {
    category: 'Implementation Playbooks',
    seeds: [
      '30-60-90 day autonomous operations plan',
      'how to deploy enterprise ai control plane',
      'pilot to production ai operations rollout',
      'enterprise ai onboarding checklist',
      'operational readiness for ai agents',
    ],
  },
]

const TITLE_PATTERNS = [
  'How to {keyword}',
  '{keyword}: Complete Guide for 2026',
  '{keyword}: Implementation Blueprint',
  '{keyword}: Common Mistakes and Fixes',
  '{keyword}: Strategy Playbook',
]

async function main() {
  const count = Number(getArg('--count', '100'))
  const topics = []

  for (const group of CATEGORY_KEYWORDS) {
    for (const seed of group.seeds) {
      for (const pattern of TITLE_PATTERNS) {
        const keyword = seed
        const topic = pattern.replace('{keyword}', seed.replace(/(^\w)/, (m) => m.toUpperCase()))
        topics.push({
          topic,
          keyword,
          category: group.category,
        })
      }
    }
  }

  const selected = topics.slice(0, count)
  const outDir = path.join(process.cwd(), 'data')
  await mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, 'keywords-plan.json')
  await writeFile(
    outPath,
    JSON.stringify({ generatedAt: new Date().toISOString(), count: selected.length, items: selected }, null, 2),
    'utf-8',
  )

  console.log(`Saved ${selected.length} keyword topics to ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
