#!/usr/bin/env node

import { promises as fs } from 'fs'
import path from 'path'

const DIRECTORY_FILE = path.join(process.cwd(), 'data', 'offpage', 'directory-tracker.csv')

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

function daysSince(dateStr) {
  if (!dateStr) return null
  const now = new Date()
  const then = new Date(dateStr)
  if (Number.isNaN(then.getTime())) return null
  const diff = now.getTime() - then.getTime()
  return Math.floor(diff / (1000 * 60 * 60 * 24))
}

async function main() {
  const raw = await fs.readFile(DIRECTORY_FILE, 'utf-8')
  const rows = parseCsv(raw)
  const pending = rows.filter((row) => !row.status || ['pending', 'submitted', 'in-review'].includes(row.status.toLowerCase()))

  console.log('Directory Submission Status')
  if (pending.length === 0) {
    console.log('- no pending submissions')
    return
  }

  for (const row of pending) {
    const age = daysSince(row.submitted_on)
    const ageLabel = age === null ? 'n/a' : `${age}d`
    console.log(`- ${row.directory} | status=${row.status || 'pending'} | submitted=${row.submitted_on || '-'} | age=${ageLabel} | next_follow_up=${row.next_follow_up || '-'}`)
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})

