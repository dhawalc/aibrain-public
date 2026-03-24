#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'

const METRICS_DIR = path.join(process.cwd(), 'data', 'metrics')
const SITE_URL = 'https://qorsync.online'

function normalizePath(pageUrl) {
  if (!pageUrl) return ''
  try {
    const url = new URL(pageUrl)
    return url.pathname
  } catch {
    return pageUrl
  }
}

async function readLatestMetrics() {
  const files = await fs.readdir(METRICS_DIR)
  const metricFiles = files.filter((file) => file.endsWith('.json')).sort()
  if (metricFiles.length === 0) {
    throw new Error(`No metrics snapshots found in ${METRICS_DIR}`)
  }
  const latestFile = metricFiles[metricFiles.length - 1]
  const raw = await fs.readFile(path.join(METRICS_DIR, latestFile), 'utf-8')
  return JSON.parse(raw)
}

function topCtrOpportunities(metrics) {
  const rows = metrics.gsc?.rows || []
  return rows
    .map((row) => ({
      page: row.page,
      path: normalizePath(row.page),
      impressions: Number(row.impressions || 0),
      clicks: Number(row.clicks || 0),
      position: Number(row.position || 0),
      ctr: Number(row.ctr || 0),
    }))
    .filter((row) => row.impressions >= 5 && row.clicks === 0)
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, 15)
}

function topPositionWins(metrics) {
  const rows = metrics.gsc?.rows || []
  return rows
    .map((row) => ({
      page: row.page,
      path: normalizePath(row.page),
      impressions: Number(row.impressions || 0),
      clicks: Number(row.clicks || 0),
      position: Number(row.position || 0),
      ctr: Number(row.ctr || 0),
    }))
    .filter((row) => row.impressions >= 5 && row.position > 0 && row.position <= 20)
    .sort((a, b) => a.position - b.position)
    .slice(0, 15)
}

function printSection(title, rows) {
  console.log(`\n## ${title}`)
  if (rows.length === 0) {
    console.log('- none')
    return
  }

  for (const row of rows) {
    console.log(
      `- ${row.path || row.page} | impressions=${row.impressions}, clicks=${row.clicks}, ctr=${(row.ctr * 100).toFixed(2)}%, position=${row.position.toFixed(1)}`,
    )
  }
}

async function main() {
  const metrics = await readLatestMetrics()
  const ctrOpps = topCtrOpportunities(metrics)
  const positionWins = topPositionWins(metrics)

  console.log('# SEO War Room Report')
  console.log(`- Generated: ${metrics.generatedAt}`)
  console.log(`- Range: ${metrics.range?.startDate} to ${metrics.range?.endDate}`)
  console.log(
    `- GA4: users=${metrics.summary?.ga4TotalUsers ?? 0}, newUsers=${metrics.summary?.ga4NewUsers ?? 0}, sessions=${metrics.summary?.ga4TotalSessions ?? 0}, views=${metrics.summary?.ga4TotalViews ?? 0}`,
  )
  console.log(`- GSC: clicks=${metrics.summary?.gscTotalClicks ?? 0}, impressions=${metrics.summary?.gscTotalImpressions ?? 0}`)

  printSection('Top CTR Opportunities (Impressions >= 5, Clicks = 0)', ctrOpps)
  printSection('Pages Positioned for Near-Term Wins (Position <= 20)', positionWins)

  console.log('\n## Next 24h Actions')
  console.log(`- Refresh title + meta description for top ${Math.min(5, ctrOpps.length)} CTR opportunities.`)
  console.log('- Add 3-5 internal links from homepage/blog hubs to those pages.')
  console.log('- Re-submit sitemap and IndexNow after updates.')
  console.log(`- Publish at least 2 distribution assets linking to priority URLs (${SITE_URL}/solutions and top blog pages).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

