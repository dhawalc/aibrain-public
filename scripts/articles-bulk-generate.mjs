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
  const count = Number(getArg('--count', '100'))
  const publish = getArg('--publish', 'true')

  const planPath = path.join(process.cwd(), 'data', 'keywords-plan.json')
  const raw = await readFile(planPath, 'utf-8')
  const plan = JSON.parse(raw)
  const items = (plan.items || []).slice(0, count)

  if (items.length === 0) {
    throw new Error('No topics in data/keywords-plan.json. Run keywords:plan first.')
  }

  for (const item of items) {
    await run('node', [
      'scripts/article-generator.mjs',
      '--topic',
      item.topic,
      '--category',
      item.category,
      '--author',
      'Dhawal Chheda, AI Leader at Accel4',
      '--publish',
      publish,
    ])
  }

  console.log(`Generated ${items.length} articles (publish=${publish}).`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
