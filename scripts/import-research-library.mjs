#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'
import process from 'process'
import TurndownService from 'turndown'
import { gfm } from 'turndown-plugin-gfm'
import { load } from 'cheerio'

const RESEARCH_BASE_URL = process.env.RESEARCH_BASE_URL ?? 'http://localhost:4000'
const OUTPUT_DIR = path.join(process.cwd(), 'content', 'blog')

const CATEGORY_LABELS = {
  'ai-brain': 'AI Agent Memory Systems',
  'd2dt-trading': 'SPX Trading Analytics',
  'ai-breakthroughs': 'AI Breakthroughs',
}

const AUTHOR = 'QorSync AI Research Team'

const BOILERPLATE_PATTERNS = [
  /^i now have all the data needed/i,
  /^i now have comprehensive/i,
  /^now i have comprehensive/i,
  /^the comprehensive report has been written/i,
  /^the report has been written/i,
  /^report saved to:/i,
  /^i['’]?ll conduct\b/i,
  /^let me (compile|start|write|organize)\b/i,
  /^here is a summary of the key findings:?/i,
]

const DESCRIPTION_MAX_LENGTH = 180
const SHORT_BOILERPLATE_PATTERNS = [
  /^table of contents$/i,
  /^contents$/i,
  /^executive summary$/i,
  /^summary$/i,
  /^introduction$/i,
  /^overview$/i,
  /^key findings?(:)?$/i,
  /^report saved to:?$/i,
  /^source:?$/i,
]

const DESCRIPTION_BOILERPLATE_PATTERNS = [
  /^this is (a|an) (deep|comprehensive|detailed) research synthesis/i,
  /^i will (organize|cover|break down|analyze)\b/i,
]

function getArg(flag, fallback = '') {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

function hasFlag(flag) {
  return process.argv.includes(flag)
}

async function fetchJson(url) {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error(`Failed request (${response.status}): ${url}`)
  }
  return response.json()
}

function cleanTitle(raw) {
  const title = (raw || '')
    .replace(/\s+/g, ' ')
    .replace(/`/g, '')
    .trim()
  return title
}

function isSeparatorOnly(text) {
  const compact = text.replace(/\s+/g, '')
  if (!compact) return true
  return /^[*_\-=~`|.:/\\]+$/.test(compact)
}

function isPunctuationOnly(text) {
  const compact = text.replace(/\s+/g, '')
  if (!compact) return true
  return !/[\p{L}\p{N}]/u.test(compact)
}

function isBoilerplateLine(text) {
  const normalized = text
    .trim()
    .toLowerCase()
    .replace(/[’]/g, "'")
  if (!normalized) return true
  if (isSeparatorOnly(normalized) || isPunctuationOnly(normalized)) return true
  return BOILERPLATE_PATTERNS.some((pattern) => pattern.test(normalized))
}

function stripBoilerplateNodes(html) {
  const $ = load(html)
  $('script, style, .toc').remove()

  const body = $('body')
  const scope = body.length ? body : $.root()

  const firstHeading = scope.find('h1, h2').first()

  if (firstHeading.length) {
    let cursor = firstHeading.prev()
    while (cursor.length) {
      const previous = cursor.prev()
      cursor.remove()
      cursor = previous
    }
  }

  scope.find('p').each((_, element) => {
    const text = $(element).text().replace(/\s+/g, ' ').trim()
    if (isBoilerplateLine(text)) {
      $(element).remove()
    }
  })

  scope.find('hr').each((_, element) => {
    const prevText = $(element).prev().text().replace(/\s+/g, ' ').trim()
    const nextText = $(element).next().text().replace(/\s+/g, ' ').trim()
    if (isBoilerplateLine(prevText) || isBoilerplateLine(nextText)) {
      $(element).remove()
    }
  })

  return $.html(scope)
}

function extractPrimaryTitle(html, fallback) {
  const $ = load(html)
  const h1 = $('h1').first().text().replace(/\s+/g, ' ').trim()
  const candidate = cleanTitle(h1) || cleanTitle(fallback)
  return candidate.length > 5 ? candidate : cleanTitle(fallback)
}

function markdownFromHtml(html) {
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
    bulletListMarker: '-',
  })
  turndownService.use(gfm)

  let markdown = turndownService.turndown(html)
  markdown = markdown
    .replace(/\/home\/dhawal\/research\/[^\s)]+/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim()

  const lines = markdown.split('\n')
  while (lines.length && isBoilerplateLine(lines[0].replace(/^#+\s*/, ''))) {
    lines.shift()
  }

  return lines.join('\n').trim()
}

function firstParagraph(markdown) {
  const blocks = markdown
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)

  for (const block of blocks) {
    const normalized = normalizeDescriptionText(block)
    if (!normalized) continue
    if (isNonInformativeDescriptionCandidate(block, normalized)) continue
    return normalized
  }

  const lines = markdown.split('\n').map((line) => line.trim()).filter(Boolean)
  for (const line of lines) {
    const normalized = normalizeDescriptionText(line)
    if (!normalized) continue
    if (isNonInformativeDescriptionCandidate(line, normalized)) continue
    return normalized
  }

  return ''
}

function normalizeDescriptionText(text) {
  return text
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, '$1')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`{1,3}([^`]+?)`{1,3}/g, '$1')
    .replace(/[*_~]/g, '')
    .replace(/\\([\\`*_[\]{}()#+\-.!|>])/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
}

function isVeryShortBoilerplate(text) {
  const normalized = text
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim()

  if (!normalized || normalized.length > 40) return false
  return SHORT_BOILERPLATE_PATTERNS.some((pattern) => pattern.test(normalized))
}

function isNonInformativeDescriptionCandidate(raw, normalized) {
  const firstLine = raw.split('\n')[0]?.trim() ?? ''
  const normalizedFirstLine = normalizeDescriptionText(firstLine).toLowerCase()
  if (firstLine.startsWith('#')) return true
  if (firstLine.startsWith('|')) return true
  if (firstLine.startsWith('```')) return true
  if (firstLine.startsWith('- ') || firstLine.startsWith('* ') || firstLine.startsWith('+ ')) return true
  if (/^\d+\.\s+/.test(firstLine)) return true
  if (/^>\s*/.test(firstLine)) return true

  if (isSeparatorOnly(normalized)) return true
  if (isPunctuationOnly(normalized)) return true
  if (isBoilerplateLine(normalized)) return true
  if (isVeryShortBoilerplate(normalized)) return true
  if (DESCRIPTION_BOILERPLATE_PATTERNS.some((pattern) => pattern.test(normalizedFirstLine))) return true
  return false
}

function truncateDescription(text) {
  if (text.length <= DESCRIPTION_MAX_LENGTH) return text
  const hardLimit = text.slice(0, DESCRIPTION_MAX_LENGTH - 3)
  const boundary = hardLimit.lastIndexOf(' ')
  const clipped = boundary > 100 ? hardLimit.slice(0, boundary) : hardLimit
  return `${clipped.trimEnd()}...`
}

function toDescription(markdown, fallbackTitle) {
  const primary = firstParagraph(markdown)
  if (primary) return truncateDescription(primary)

  const fallback = normalizeDescriptionText(fallbackTitle)
  if (!fallback || isNonInformativeDescriptionCandidate(fallback, fallback)) {
    return 'Research insights and analysis.'
  }

  return truncateDescription(fallback)
}

function readTimeFor(markdown) {
  const words = markdown.split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.ceil(words / 220))} min read`
}

function toDateByOrder(index, total) {
  const today = new Date()
  const daysBack = Math.max(0, total - index - 1)
  const date = new Date(today)
  date.setDate(today.getDate() - daysBack)
  return date.toISOString().slice(0, 10)
}

function safeYamlValue(value) {
  return value.replace(/"/g, '\\"')
}

function withFrontmatter({ title, description, date, category, readTime, content }) {
  const headingRegex = /^#\s+.+$/m
  const body = headingRegex.test(content) ? content : `# ${title}\n\n${content}`

  return `---
title: "${safeYamlValue(title)}"
description: "${safeYamlValue(description)}"
date: "${date}"
category: "${safeYamlValue(category)}"
author: "${safeYamlValue(AUTHOR)}"
readTime: "${safeYamlValue(readTime)}"
published: true
---

${body}
`
}

async function fileExists(filePath) {
  try {
    await fs.access(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  const dryRun = hasFlag('--dry-run')
  const overwrite = hasFlag('--overwrite')
  const limitArg = Number(getArg('--limit', '0'))
  const limit = Number.isFinite(limitArg) && limitArg > 0 ? limitArg : undefined

  const catalog = await fetchJson(`${RESEARCH_BASE_URL}/api/articles`)
  const articles = limit ? catalog.articles.slice(0, limit) : catalog.articles

  await fs.mkdir(OUTPUT_DIR, { recursive: true })

  const summary = {
    total: articles.length,
    written: 0,
    skippedExisting: 0,
    failed: 0,
  }

  for (let index = 0; index < articles.length; index += 1) {
    const item = articles[index]
    const slug = item.id.trim()
    const filePath = path.join(OUTPUT_DIR, `${slug}.md`)

    if (!overwrite && (await fileExists(filePath))) {
      summary.skippedExisting += 1
      continue
    }

    try {
      const full = await fetchJson(`${RESEARCH_BASE_URL}/api/article/${encodeURIComponent(item.id)}`)
      const category = CATEGORY_LABELS[full.category_id] ?? item.category_name ?? 'Research'
      const cleanedHtml = stripBoilerplateNodes(full.html ?? '')
      const derivedTitle = extractPrimaryTitle(cleanedHtml, full.title || item.title)
      const markdown = markdownFromHtml(cleanedHtml)

      if (!markdown || markdown.length < 200) {
        summary.failed += 1
        console.error(`Skipped article ${item.id}: markdown too short after cleanup`)
        continue
      }

      const description = toDescription(markdown, derivedTitle)
      const readTime = readTimeFor(markdown)
      const date = toDateByOrder(index, articles.length)

      const output = withFrontmatter({
        title: derivedTitle,
        description,
        date,
        category,
        readTime,
        content: markdown,
      })

      if (!dryRun) {
        await fs.writeFile(filePath, output, 'utf-8')
      }

      summary.written += 1
      if (summary.written % 10 === 0 || summary.written === articles.length) {
        console.log(`Processed ${summary.written}/${articles.length}: ${slug}`)
      }
    } catch (error) {
      summary.failed += 1
      console.error(`Failed article ${item.id}:`, error instanceof Error ? error.message : String(error))
    }
  }

  console.log('\nImport summary:')
  console.log(`- Total considered: ${summary.total}`)
  console.log(`- Written: ${summary.written}`)
  console.log(`- Skipped existing: ${summary.skippedExisting}`)
  console.log(`- Failed: ${summary.failed}`)
  if (dryRun) console.log('- Dry run: no files written')
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
