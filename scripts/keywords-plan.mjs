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
    bucket: 'ai_agents',
    category: 'Agentic Automation & Orchestration',
    seeds: [
      'agent orchestration for enterprise workflows',
      'multi-agent execution playbook',
      'autonomous operations with human approval',
      'enterprise task routing with ai agents',
      'agent failure recovery strategy',
      'ai agents for enterprise operations',
      'enterprise ai agent architecture',
      'autonomous ai workflow engine',
      'agentic ai for operational excellence',
      'multi-agent systems in enterprise',
      'how to scale enterprise ai agents',
      'ai copilot vs autonomous agents',
      'agent-to-agent collaboration patterns',
      'enterprise autonomous ai strategy',
      'ai orchestration control plane',
    ],
  },
  {
    bucket: 'governance',
    category: 'Governance, Risk & Compliance',
    seeds: [
      'human in the loop governance model',
      'ai approval workflow design',
      'audit trail for autonomous systems',
      'policy-based execution controls',
      'enterprise ai compliance checklist',
      'agent governance framework',
      'ai risk controls in production',
      'reliable ai agent operations',
      'observability for ai agents',
      'rollback strategy for ai automation',
      'agent safety guardrails',
      'policy engine for ai workflows',
    ],
  },
  {
    bucket: 'systems',
    category: 'Cross-System Integration Patterns',
    seeds: [
      'erp crm integration automation',
      'cross-system process synchronization',
      'api-first operations control plane',
      'event-driven enterprise workflow automation',
      'sap ai agent integration',
      'oracle workflow automation with ai agents',
      'netsuite ai operations playbook',
      'salesforce ai agent orchestration',
    ],
  },
]

const TITLE_PATTERNS = [
  'How to {keyword}',
  '{keyword}: Complete Guide for 2026',
  '{keyword}: Implementation Blueprint',
  '{keyword}: Common Mistakes and Fixes',
  '{keyword}: Strategy Playbook',
  '{keyword}: Enterprise Operating Model',
  '{keyword}: Architecture Deep Dive',
  '{keyword}: Practical Playbook',
  '{keyword}: Best Practices',
  '{keyword}: Checklist for Teams',
  '{keyword}: 30-60-90 Day Plan',
  '{keyword}: Executive Guide',
  '{keyword}: Field Guide',
  '{keyword}: Framework and Templates',
  '{keyword}: Metrics That Matter',
  '{keyword}: Risk and Governance Guide',
  '{keyword}: Deployment Guide',
  '{keyword}: Design Patterns',
  '{keyword}: Maturity Model',
  '{keyword}: Common Pitfalls',
  '{keyword}: Troubleshooting Guide',
  '{keyword}: Team Enablement Guide',
  '{keyword}: Adoption Roadmap',
  '{keyword}: ROI Blueprint',
  '{keyword}: Decision Framework',
  '{keyword}: Product + Engineering Guide',
  '{keyword}: Workflow Optimization Guide',
  '{keyword}: Automation Playbook',
  '{keyword}: Step-by-Step Guide',
  '{keyword}: Transformation Guide',
]

async function main() {
  const count = Number(getArg('--count', '100'))
  const aiRatio = Number(getArg('--ai-ratio', '0.6'))
  const governanceRatio = Number(getArg('--governance-ratio', '0.25'))
  const systemsRatio = Number(getArg('--systems-ratio', '0.15'))
  const topics = []

  for (const group of CATEGORY_KEYWORDS) {
    for (const seed of group.seeds) {
      for (const pattern of TITLE_PATTERNS) {
        const keyword = seed
        const topic = pattern.replace('{keyword}', seed.replace(/(^\w)/, (m) => m.toUpperCase()))
        topics.push({
          bucket: group.bucket,
          topic,
          keyword,
          category: group.category,
        })
      }
    }
  }

  const byBucket = {
    ai_agents: topics.filter((item) => item.bucket === 'ai_agents'),
    governance: topics.filter((item) => item.bucket === 'governance'),
    systems: topics.filter((item) => item.bucket === 'systems'),
  }

  const targetAi = Math.round(count * aiRatio)
  const targetGovernance = Math.round(count * governanceRatio)
  const targetSystems = Math.max(0, count - targetAi - targetGovernance)

  const selected = [
    ...byBucket.ai_agents.slice(0, targetAi),
    ...byBucket.governance.slice(0, targetGovernance),
    ...byBucket.systems.slice(0, targetSystems),
  ].slice(0, count)
  const outDir = path.join(process.cwd(), 'data')
  await mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, 'keywords-plan.json')
  await writeFile(
    outPath,
    JSON.stringify(
      {
        generatedAt: new Date().toISOString(),
        count: selected.length,
        weighting: {
          ai_agents: aiRatio,
          governance: governanceRatio,
          systems: systemsRatio,
        },
        items: selected,
      },
      null,
      2,
    ),
    'utf-8',
  )

  console.log(`Saved ${selected.length} keyword topics to ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
