#!/usr/bin/env node

import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

const FEEDS = [
  'https://news.google.com/rss/search?q=enterprise+ai+operations',
  'https://news.google.com/rss/search?q=agentic+workflow+automation',
  'https://news.google.com/rss/search?q=erp+crm+integration+strategy',
  'https://news.google.com/rss/search?q=governance+risk+compliance+automation',
  'https://news.google.com/rss/search?q=netsuite+oracle+salesforce+servicenow+integration',
]

function getArg(flag, fallback) {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

function decodeXml(value) {
  return value
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
}

function extractItems(xml) {
  const items = [...xml.matchAll(/<item>[\s\S]*?<\/item>/g)].map((m) => m[0])
  return items
    .map((item) => {
      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1] || item.match(/<title>(.*?)<\/title>/)?.[1] || ''
      const link = item.match(/<link>(.*?)<\/link>/)?.[1] || ''
      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] || ''
      return { title: decodeXml(title), link: decodeXml(link), pubDate }
    })
    .filter((row) => row.title)
}

function toTopic(item) {
  const normalized = item.title
    .replace(/\s*-\s*[^-]+$/, '')
    .replace(/\s+/g, ' ')
    .trim()
  return {
    topic: normalized,
    sourceUrl: item.link,
    publishedAt: item.pubDate,
    discoveredAt: new Date().toISOString(),
  }
}

async function main() {
  const limit = Number(getArg('--limit', '25'))

  const allItems = []
  for (const feed of FEEDS) {
    const response = await fetch(feed)
    if (!response.ok) {
      console.error(`Failed feed: ${feed} (${response.status})`)
      continue
    }
    const xml = await response.text()
    const items = extractItems(xml)
    allItems.push(...items)
  }

  const unique = new Map()
  for (const item of allItems) {
    const key = item.title.toLowerCase().trim()
    if (!unique.has(key)) {
      unique.set(key, toTopic(item))
    }
  }

  const topics = Array.from(unique.values()).slice(0, limit)

  const outDir = path.join(process.cwd(), 'data')
  await mkdir(outDir, { recursive: true })

  const outPath = path.join(outDir, 'trends.json')
  await writeFile(outPath, JSON.stringify({ generatedAt: new Date().toISOString(), topics }, null, 2), 'utf-8')

  console.log(`Saved ${topics.length} topics to ${outPath}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
