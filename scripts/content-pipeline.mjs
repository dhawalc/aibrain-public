#!/usr/bin/env node

import { spawn } from 'child_process'

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
  const passThrough = process.argv.slice(2)

  await run('node', ['scripts/agents/ingest-docs.mjs'])
  await run('node', ['scripts/agents/run-autonomous-pipeline.mjs', ...passThrough])
  await run('node', ['scripts/agents/topic-scoring.mjs'])
  await run('node', ['scripts/metrics-ingest.mjs', '--days', '7'])
  await run('node', ['scripts/agents/build-refresh-queue.mjs'])
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
