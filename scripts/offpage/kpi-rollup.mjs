#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'

const METRICS_DIR = path.join(process.cwd(), 'data', 'metrics')
const OUT_DIR = path.join(process.cwd(), 'data', 'offpage')

async function latestMetricsFile() {
  const files = await fs.readdir(METRICS_DIR)
  const metricFiles = files.filter((file) => file.endsWith('.json')).sort()
  if (metricFiles.length === 0) {
    throw new Error('No metrics files found')
  }
  return path.join(METRICS_DIR, metricFiles[metricFiles.length - 1])
}

async function main() {
  const metricsPath = await latestMetricsFile()
  const raw = await fs.readFile(metricsPath, 'utf-8')
  const metrics = JSON.parse(raw)
  const dateKey = metrics.range?.endDate || new Date().toISOString().slice(0, 10)

  const lines = [
    `# Weekly KPI Snapshot (${dateKey})`,
    '',
    `- Generated at: ${metrics.generatedAt}`,
    `- GA4 users: ${metrics.summary?.ga4TotalUsers ?? 0}`,
    `- GA4 new users: ${metrics.summary?.ga4NewUsers ?? 0}`,
    `- GA4 sessions: ${metrics.summary?.ga4TotalSessions ?? 0}`,
    `- GA4 views: ${metrics.summary?.ga4TotalViews ?? 0}`,
    `- GSC clicks: ${metrics.summary?.gscTotalClicks ?? 0}`,
    `- GSC impressions: ${metrics.summary?.gscTotalImpressions ?? 0}`,
    '',
    '## Notes',
    '- Add distribution actions completed this week.',
    '- Add best-performing channels and referral sources.',
    '- Add next week priority URLs.',
    '',
  ]

  await fs.mkdir(OUT_DIR, { recursive: true })
  const outPath = path.join(OUT_DIR, `kpi-weekly-${dateKey}.md`)
  await fs.writeFile(outPath, lines.join('\n'), 'utf-8')
  console.log(`Saved ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

