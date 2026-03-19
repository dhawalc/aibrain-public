#!/usr/bin/env node

import { execSync } from 'child_process'
import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { initSchema, closeDb, persistMetrics } from './agents/db.mjs'

const USER_PROJECT = process.env.GCP_QUOTA_PROJECT || 'aibrain-ceo-live-20260218'
const GA4_PROPERTY_ID = process.env.GA4_PROPERTY_ID || ''
const GSC_SITE_URL = process.env.GSC_SITE_URL || ''

function getToken() {
  return execSync('gcloud auth application-default print-access-token', { encoding: 'utf-8' }).trim()
}

function getArg(flag, fallback = '') {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

async function apiPost(url, body) {
  const token = getToken()
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-user-project': USER_PROJECT,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(`POST ${url} failed (${response.status}): ${JSON.stringify(json)}`)
  }
  return json
}

function toDateString(date) {
  return date.toISOString().slice(0, 10)
}

async function ingestGA4(startDate, endDate) {
  if (!GA4_PROPERTY_ID) {
    return {
      enabled: false,
      reason: 'GA4_PROPERTY_ID not set',
      rows: [],
    }
  }

  const body = {
    dateRanges: [{ startDate, endDate }],
    dimensions: [{ name: 'pagePath' }],
    metrics: [{ name: 'sessions' }, { name: 'engagedSessions' }, { name: 'screenPageViews' }],
    orderBys: [{ metric: { metricName: 'sessions' }, desc: true }],
    limit: '200',
  }

  const url = `https://analyticsdata.googleapis.com/v1beta/properties/${GA4_PROPERTY_ID}:runReport`
  const result = await apiPost(url, body)

  const rows = (result.rows || []).map((row) => ({
    pagePath: row.dimensionValues?.[0]?.value || '',
    sessions: Number(row.metricValues?.[0]?.value || 0),
    engagedSessions: Number(row.metricValues?.[1]?.value || 0),
    views: Number(row.metricValues?.[2]?.value || 0),
  }))

  return {
    enabled: true,
    propertyId: GA4_PROPERTY_ID,
    rows,
  }
}

async function ingestGSC(startDate, endDate) {
  if (!GSC_SITE_URL) {
    return {
      enabled: false,
      reason: 'GSC_SITE_URL not set',
      rows: [],
    }
  }

  const encodedSite = encodeURIComponent(GSC_SITE_URL)
  const url = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodedSite}/searchAnalytics/query`
  const body = {
    startDate,
    endDate,
    dimensions: ['page'],
    rowLimit: 200,
  }

  const result = await apiPost(url, body)

  const rows = (result.rows || []).map((row) => ({
    page: row.keys?.[0] || '',
    clicks: row.clicks || 0,
    impressions: row.impressions || 0,
    ctr: row.ctr || 0,
    position: row.position || 0,
  }))

  return {
    enabled: true,
    siteUrl: GSC_SITE_URL,
    rows,
  }
}

async function safeIngest(label, fn) {
  try {
    return await fn()
  } catch (error) {
    return {
      enabled: false,
      reason: error instanceof Error ? error.message : `${label} ingestion failed`,
      rows: [],
    }
  }
}

function summarize(ga4, gsc) {
  const gaSessions = ga4.rows.reduce((sum, row) => sum + row.sessions, 0)
  const gaViews = ga4.rows.reduce((sum, row) => sum + row.views, 0)
  const gscClicks = gsc.rows.reduce((sum, row) => sum + row.clicks, 0)
  const gscImpressions = gsc.rows.reduce((sum, row) => sum + row.impressions, 0)

  return {
    ga4TotalSessions: gaSessions,
    ga4TotalViews: gaViews,
    gscTotalClicks: gscClicks,
    gscTotalImpressions: gscImpressions,
  }
}

async function ensureEnvTemplateHasAnalyticsVars() {
  const file = path.join(process.cwd(), '.env.local.example')
  const raw = await readFile(file, 'utf-8')
  const additions = ['GA4_PROPERTY_ID=', 'GSC_SITE_URL=', 'GCP_QUOTA_PROJECT=aibrain-ceo-live-20260218']
  let output = raw

  for (const line of additions) {
    if (!raw.includes(line.split('=')[0])) {
      output = `${output.trimEnd()}\n${line}\n`
    }
  }

  if (output !== raw) {
    await writeFile(file, output, 'utf-8')
  }
}

async function main() {
  const days = Number(getArg('--days', '7'))
  const end = new Date()
  const start = new Date()
  start.setDate(end.getDate() - days)

  const startDate = toDateString(start)
  const endDate = toDateString(end)

  const [ga4, gsc] = await Promise.all([
    safeIngest('ga4', () => ingestGA4(startDate, endDate)),
    safeIngest('gsc', () => ingestGSC(startDate, endDate)),
  ])
  const summary = summarize(ga4, gsc)

  const payload = {
    generatedAt: new Date().toISOString(),
    range: { startDate, endDate },
    ga4,
    gsc,
    summary,
  }

  const outDir = path.join(process.cwd(), 'data', 'metrics')
  await mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, `${endDate}.json`)
  await writeFile(outPath, JSON.stringify(payload, null, 2), 'utf-8')
  await ensureEnvTemplateHasAnalyticsVars()

  const conn = await initSchema()
  const metricRows = [
    ...ga4.rows.map((row) => ({
      id: randomUUID(),
      slug: (row.pagePath || '').replace(/^\/blog\//, ''),
      page_path: row.pagePath || '',
      sessions: row.sessions || 0,
      views: row.views || 0,
      source: 'ga4',
      payload: row,
    })),
    ...gsc.rows.map((row) => ({
      id: randomUUID(),
      slug: (row.page || '').split('/blog/')[1]?.replace(/\/$/, '') || '',
      page_path: row.page || '',
      clicks: row.clicks || 0,
      impressions: row.impressions || 0,
      ctr: row.ctr || 0,
      position: row.position || 0,
      source: 'gsc',
      payload: row,
    })),
  ]
  await persistMetrics(conn, metricRows)
  await closeDb(conn)

  console.log(`Saved metrics snapshot to ${outPath}`)
  console.log(`Summary: sessions=${summary.ga4TotalSessions}, views=${summary.ga4TotalViews}, clicks=${summary.gscTotalClicks}, impressions=${summary.gscTotalImpressions}`)

  if (!ga4.enabled || !gsc.enabled) {
    console.log('Note: set GA4_PROPERTY_ID and GSC_SITE_URL to enable full ingestion.')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
