#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'

const OUTREACH_FILE = path.join(process.cwd(), 'data', 'offpage', 'outreach-pipeline.csv')
const PARTNER_FILE = path.join(process.cwd(), 'data', 'offpage', 'partnership-pipeline.csv')

function parseCsv(raw) {
  const lines = raw.split('\n').map((line) => line.trim()).filter(Boolean)
  if (lines.length <= 1) return []
  const headers = lines[0].split(',').map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const cells = line.split(',')
    const row = {}
    headers.forEach((header, idx) => {
      row[header] = (cells[idx] || '').trim()
    })
    return row
  })
}

function dueRows(rows, label) {
  const today = new Date().toISOString().slice(0, 10)
  return rows
    .filter((row) => row.status && row.status.toLowerCase() !== 'closed')
    .filter((row) => !row.next_touch || row.next_touch <= today)
    .map((row) => ({
      label,
      name: row.contact || row.partner || '(missing)',
      status: row.status || 'pending',
      nextTouch: row.next_touch || today,
      target: row.target_url || '',
    }))
}

async function main() {
  const [outreachRaw, partnerRaw] = await Promise.all([fs.readFile(OUTREACH_FILE, 'utf-8'), fs.readFile(PARTNER_FILE, 'utf-8')])

  const queue = [...dueRows(parseCsv(outreachRaw), 'outreach'), ...dueRows(parseCsv(partnerRaw), 'partnership')].sort((a, b) =>
    a.nextTouch.localeCompare(b.nextTouch),
  )

  console.log('Outreach Queue (due now)')
  if (queue.length === 0) {
    console.log('- none')
    return
  }

  for (const item of queue) {
    console.log(`- [${item.label}] ${item.name} | status=${item.status} | next_touch=${item.nextTouch} | target=${item.target}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

