#!/usr/bin/env node

import path from 'path'
import { readJson, writeJson } from './utils.mjs'

const ROOT = process.cwd()

function intentScore(text) {
  const low = text.toLowerCase()
  let score = 40
  if (low.includes('playbook') || low.includes('implementation') || low.includes('deployment')) score += 20
  if (low.includes('roi') || low.includes('cost') || low.includes('decision')) score += 15
  if (low.includes('checklist') || low.includes('template')) score += 10
  return Math.min(100, score)
}

function rankabilityScore(text) {
  const tokenCount = text.split(/\s+/).length
  return tokenCount <= 8 ? 72 : tokenCount <= 12 ? 65 : 55
}

function freshnessBoost(text) {
  const low = text.toLowerCase()
  if (low.includes('2026') || low.includes('today') || low.includes('latest')) return 15
  if (low.includes('new') || low.includes('emerging')) return 10
  return 5
}

async function main() {
  const plan = await readJson(path.join(ROOT, 'data', 'keywords-plan.json'), { items: [] })
  const metrics = await readJson(path.join(ROOT, 'data', 'metrics', `${new Date().toISOString().slice(0, 10)}.json`), null)

  const scored = (plan.items || []).map((item) => {
    const topic = item.topic || item.keyword || ''
    const intent = intentScore(topic)
    const rankability = rankabilityScore(topic)
    const freshness = freshnessBoost(topic)
    const business = item.bucket === 'ai_agents' ? 85 : item.bucket === 'governance' ? 80 : 72
    const opportunity = Math.round(intent * 0.35 + business * 0.3 + rankability * 0.25 + freshness * 0.1)

    return {
      ...item,
      scoring: {
        intent,
        business,
        rankability,
        freshness,
        opportunity,
      },
    }
  })

  scored.sort((a, b) => b.scoring.opportunity - a.scoring.opportunity)

  const outPath = path.join(ROOT, 'data', 'topic-priority.json')
  await writeJson(outPath, {
    generatedAt: new Date().toISOString(),
    sourceMetricsDate: metrics?.generatedAt || null,
    count: scored.length,
    top20: scored.slice(0, 20),
    all: scored,
  })

  console.log(`Saved topic priority model to ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
