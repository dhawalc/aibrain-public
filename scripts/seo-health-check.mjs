#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

const TITLE_BOILERPLATE_PATTERNS = [
  /the comprehensive report has been written/i,
  /i(?:'ll| will) conduct/i,
  /deep research:/i,
  /^untitled$/i,
]

function clean(value) {
  return String(value || '').replace(/\s+/g, ' ').trim()
}

async function loadPosts() {
  const files = await fs.readdir(BLOG_DIR)
  const posts = []

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue
    const filePath = path.join(BLOG_DIR, file)
    const raw = await fs.readFile(filePath, 'utf-8')
    const { data, content } = matter(raw)
    const words = content.trim().split(/\s+/).filter(Boolean).length
    posts.push({
      slug: file.replace(/\.mdx?$/, ''),
      filePath,
      title: clean(data.title),
      description: clean(data.description),
      category: clean(data.category),
      date: clean(data.date),
      readTime: clean(data.readTime),
      published: Boolean(data.published),
      words,
    })
  }

  return posts
}

function audit(posts) {
  const findings = []
  let publishedCount = 0

  for (const post of posts) {
    if (!post.published) continue
    publishedCount += 1

    if (!post.title) {
      findings.push({ severity: 'high', slug: post.slug, issue: 'Missing title' })
    } else if (TITLE_BOILERPLATE_PATTERNS.some((pattern) => pattern.test(post.title))) {
      findings.push({ severity: 'high', slug: post.slug, issue: 'Boilerplate-like title' })
    } else if (post.title.length < 35 || post.title.length > 75) {
      findings.push({ severity: 'medium', slug: post.slug, issue: `Title length ${post.title.length} outside 35-75` })
    }

    if (!post.description) {
      findings.push({ severity: 'high', slug: post.slug, issue: 'Missing description' })
    } else if (post.description.length < 100 || post.description.length > 180) {
      findings.push({
        severity: 'medium',
        slug: post.slug,
        issue: `Description length ${post.description.length} outside 100-180`,
      })
    }

    if (!post.category) {
      findings.push({ severity: 'medium', slug: post.slug, issue: 'Missing category' })
    }
    if (!post.date) {
      findings.push({ severity: 'medium', slug: post.slug, issue: 'Missing date' })
    }
    if (post.words < 600) {
      findings.push({ severity: 'high', slug: post.slug, issue: `Thin content (${post.words} words)` })
    }
  }

  const severityCounts = findings.reduce(
    (acc, finding) => {
      acc[finding.severity] += 1
      return acc
    },
    { high: 0, medium: 0, low: 0 },
  )

  return {
    totals: {
      posts: posts.length,
      publishedPosts: publishedCount,
      findings: findings.length,
      high: severityCounts.high,
      medium: severityCounts.medium,
      low: severityCounts.low,
    },
    findings,
  }
}

async function main() {
  const posts = await loadPosts()
  const report = audit(posts)

  console.log('SEO Health Check')
  console.log(`- Published posts: ${report.totals.publishedPosts}`)
  console.log(`- Findings: ${report.totals.findings} (high=${report.totals.high}, medium=${report.totals.medium})`)

  const topFindings = report.findings.slice(0, 30)
  for (const finding of topFindings) {
    console.log(`  [${finding.severity}] ${finding.slug} -> ${finding.issue}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

