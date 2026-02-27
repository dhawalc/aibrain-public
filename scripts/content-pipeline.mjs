#!/usr/bin/env node

import { readFile } from 'fs/promises'
import path from 'path'
import { spawn } from 'child_process'

function getArg(flag, fallback = '') {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

function run(command, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, { stdio: 'inherit' })
    child.on('exit', (code) => {
      if (code === 0) resolve(undefined)
      else reject(new Error(`${command} ${args.join(' ')} failed with code ${code}`))
    })
  })
}

async function main() {
  const count = Number(getArg('--count', '5'))
  const trendsPath = path.join(process.cwd(), 'data', 'trends.json')
  const raw = await readFile(trendsPath, 'utf-8')
  const json = JSON.parse(raw)

  const topics = (json.topics || []).slice(0, count)
  if (topics.length === 0) {
    throw new Error('No topics in data/trends.json. Run trend-finder first.')
  }

  for (const entry of topics) {
    const topic = entry.topic || 'SAP Transformation Strategy'
    await run('node', ['scripts/article-generator.mjs', '--topic', topic, '--category', 'SAP Insights'])
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
