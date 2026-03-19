#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises'
import path from 'path'
import matter from 'gray-matter'
import { writeJson } from './utils.mjs'

const ROOT = process.cwd()

async function listArticles() {
  const dir = path.join(ROOT, 'content', 'blog')
  const names = await readdir(dir)
  return names.filter((n) => n.endsWith('.md'))
}

async function loadLatestMetrics() {
  const dir = path.join(ROOT, 'data', 'metrics')
  let names = []
  try {
    names = (await readdir(dir)).filter((n) => n.endsWith('.json')).sort()
  } catch {
    return null
  }
  if (!names.length) return null
  const latest = names[names.length - 1]
  const raw = await readFile(path.join(dir, latest), 'utf-8')
  return JSON.parse(raw)
}

function scoreDecay(articleDate, metricsRow) {
  const ageDays = Math.max(1, Math.floor((Date.now() - new Date(articleDate).getTime()) / 86400000))
  const clicks = metricsRow?.clicks || 0
  const impressions = metricsRow?.impressions || 0
  const ctr = metricsRow?.ctr || 0
  const position = metricsRow?.position || 60

  const ageFactor = Math.min(1, ageDays / 60)
  const underperform = impressions > 0 && ctr < 0.01 ? 1 : 0
  const rankFactor = position > 20 ? 1 : 0.3
  const clickFactor = clicks < 10 ? 1 : 0.2

  return Math.round((ageFactor * 35 + underperform * 25 + rankFactor * 25 + clickFactor * 15) * 10) / 10
}

async function main() {
  const files = await listArticles()
  const metrics = await loadLatestMetrics()
  const gscRows = metrics?.gsc?.rows || []

  const queue = []
  for (const file of files) {
    const raw = await readFile(path.join(ROOT, 'content', 'blog', file), 'utf-8')
    const parsed = matter(raw)
    const slug = file.replace(/\.md$/, '')
    const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://qorsync.online'}/blog/${slug}`
    const row = gscRows.find((r) => (r.page || '').includes(`/blog/${slug}`) || (r.page || '') === pageUrl)

    const refreshScore = scoreDecay(parsed.data.date || new Date().toISOString(), row)
    if (refreshScore < 45) continue

    queue.push({
      slug,
      title: parsed.data.title || slug,
      refreshScore,
      reasons: [
        refreshScore > 70 ? 'High decay risk' : 'Moderate decay risk',
        row?.position > 20 ? 'Low ranking position' : 'Ranking stable',
        (row?.ctr || 0) < 0.01 ? 'Low CTR' : 'CTR acceptable',
      ],
      metrics: row || null,
    })
  }

  queue.sort((a, b) => b.refreshScore - a.refreshScore)

  const out = path.join(ROOT, 'data', 'refresh-queue.json')
  await writeJson(out, {
    generatedAt: new Date().toISOString(),
    count: queue.length,
    queue,
  })

  console.log(`Saved refresh queue (${queue.length} items) to ${out}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
