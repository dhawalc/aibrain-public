#!/usr/bin/env node

/**
 * IndexNow URL Submission Script
 *
 * Pings Bing and Yandex via the IndexNow protocol for instant indexing.
 *
 * Usage:
 *   node scripts/indexnow-submit.mjs                # Submit all current URLs
 *   node scripts/indexnow-submit.mjs --urls /blog/my-post /tools/new-tool   # Submit specific paths
 *   node scripts/indexnow-submit.mjs --dry-run      # Preview without submitting
 */

import { promises as fs } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const BLOG_DIR = path.join(__dirname, '..', 'content', 'blog')

const SITE_URL = 'https://qorsync.online'
const HOST = 'qorsync.online'
const API_KEY = '216b1b205097c014b135977655252a6b'
const KEY_LOCATION = `${SITE_URL}/${API_KEY}.txt`

const INDEXNOW_ENDPOINTS = [
  'https://api.indexnow.org/indexnow',
  'https://www.bing.com/indexnow',
  'https://yandex.com/indexnow',
]

// Max URLs per IndexNow batch request
const BATCH_SIZE = 100

async function getAllBlogSlugs() {
  let files = []
  try {
    files = await fs.readdir(BLOG_DIR)
  } catch {
    console.warn('Warning: content/blog directory not found, skipping blog URLs')
    return []
  }

  const slugs = []
  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
    // Quick check for published: true in frontmatter
    const frontmatterMatch = raw.match(/^---\s*\n([\s\S]*?)\n---/)
    if (frontmatterMatch) {
      const fm = frontmatterMatch[1]
      if (/published:\s*true/i.test(fm)) {
        slugs.push(file.replace(/\.mdx?$/, ''))
      }
    }
  }
  return slugs
}

function buildAllUrls(blogSlugs) {
  const staticUrls = [
    `${SITE_URL}`,
    `${SITE_URL}/blog`,
    `${SITE_URL}/author/dhawal-chheda`,
    `${SITE_URL}/tools`,
    `${SITE_URL}/tools/approval-workflow-roi-calculator`,
    `${SITE_URL}/tools/agent-governance-risk-matrix`,
    `${SITE_URL}/tools/automation-readiness-assessment`,
  ]

  const blogUrls = blogSlugs.map((slug) => `${SITE_URL}/blog/${slug}`)

  return [...staticUrls, ...blogUrls]
}

async function submitBatch(urls, endpoint) {
  const payload = {
    host: HOST,
    key: API_KEY,
    keyLocation: KEY_LOCATION,
    urlList: urls,
  }

  const res = await fetch(endpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify(payload),
  })

  return { status: res.status, ok: res.ok }
}

async function main() {
  const args = process.argv.slice(2)
  const dryRun = args.includes('--dry-run')
  const urlsIndex = args.indexOf('--urls')

  let urls

  if (urlsIndex !== -1) {
    // Submit specific paths passed as arguments
    const paths = args.slice(urlsIndex + 1).filter((a) => !a.startsWith('--'))
    if (paths.length === 0) {
      console.error('Error: --urls requires at least one path argument')
      process.exit(1)
    }
    urls = paths.map((p) => (p.startsWith('http') ? p : `${SITE_URL}${p.startsWith('/') ? '' : '/'}${p}`))
  } else {
    // Submit all known URLs
    const slugs = await getAllBlogSlugs()
    urls = buildAllUrls(slugs)
  }

  console.log(`IndexNow submission: ${urls.length} URL(s)`)

  if (dryRun) {
    console.log('\n--- DRY RUN (no requests sent) ---')
    urls.forEach((u) => console.log(`  ${u}`))
    console.log(`\nWould submit to: ${INDEXNOW_ENDPOINTS.join(', ')}`)
    return
  }

  // Submit in batches
  for (let i = 0; i < urls.length; i += BATCH_SIZE) {
    const batch = urls.slice(i, i + BATCH_SIZE)
    const batchNum = Math.floor(i / BATCH_SIZE) + 1
    const totalBatches = Math.ceil(urls.length / BATCH_SIZE)

    console.log(`\nBatch ${batchNum}/${totalBatches} (${batch.length} URLs)`)

    for (const endpoint of INDEXNOW_ENDPOINTS) {
      try {
        const { status, ok } = await submitBatch(batch, endpoint)
        const label = ok ? 'OK' : 'FAIL'
        console.log(`  ${label} ${endpoint} -> HTTP ${status}`)
      } catch (err) {
        console.log(`  ERR ${endpoint} -> ${err.message}`)
      }
    }

    // Small delay between batches to be polite
    if (i + BATCH_SIZE < urls.length) {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }

  console.log('\nDone.')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
