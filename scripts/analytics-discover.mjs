#!/usr/bin/env node

import { execSync } from 'child_process'
import { mkdir, writeFile } from 'fs/promises'
import path from 'path'

const USER_PROJECT = process.env.GCP_QUOTA_PROJECT || 'aibrain-ceo-live-20260218'

function getToken() {
  return execSync('gcloud auth application-default print-access-token', { encoding: 'utf-8' }).trim()
}

async function apiGet(url) {
  const token = getToken()
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-goog-user-project': USER_PROJECT,
    },
  })

  const json = await response.json()
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}): ${JSON.stringify(json)}`)
  }
  return json
}

function parsePropertyId(resourceName) {
  const parts = resourceName.split('/')
  return parts[parts.length - 1] || ''
}

async function main() {
  const analytics = await apiGet('https://analyticsadmin.googleapis.com/v1beta/accountSummaries')
  const searchConsole = await apiGet('https://searchconsole.googleapis.com/webmasters/v3/sites')

  const properties = (analytics.accountSummaries || []).flatMap((acc) =>
    (acc.propertySummaries || []).map((prop) => ({
      account: acc.account,
      accountDisplayName: acc.displayName,
      property: prop.property,
      propertyId: parsePropertyId(prop.property),
      propertyDisplayName: prop.displayName,
    })),
  )

  const sites = (searchConsole.siteEntry || []).map((entry) => ({
    siteUrl: entry.siteUrl,
    permissionLevel: entry.permissionLevel,
  }))

  const outDir = path.join(process.cwd(), 'data')
  await mkdir(outDir, { recursive: true })
  const outPath = path.join(outDir, 'analytics-discovery.json')

  const payload = {
    generatedAt: new Date().toISOString(),
    quotaProject: USER_PROJECT,
    ga4Properties: properties,
    searchConsoleSites: sites,
  }

  await writeFile(outPath, JSON.stringify(payload, null, 2), 'utf-8')
  console.log(`Saved analytics discovery to ${outPath}`)

  if (properties.length > 0) {
    console.log('GA4 properties found:')
    for (const prop of properties) {
      console.log(`- ${prop.propertyDisplayName} (${prop.propertyId})`)
    }
  }

  if (sites.length > 0) {
    console.log('Search Console sites found:')
    for (const site of sites) {
      console.log(`- ${site.siteUrl}`)
    }
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
