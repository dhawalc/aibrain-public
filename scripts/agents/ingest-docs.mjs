#!/usr/bin/env node

import { readdir, readFile } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { initSchema, closeDb } from './db.mjs'
import { writeJson, getArg } from './utils.mjs'

const ROOT = process.cwd()
const TARGET_DIRS = ['docs', 'content/blog', 'app']
const CHUNK_SIZE = 1000

async function walk(dir, files = []) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const entry of entries) {
    if (entry.name.startsWith('.')) continue
    if (entry.name === 'node_modules' || entry.name === '.next') continue
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) await walk(full, files)
    else if (/\.(md|mdx|tsx|ts|js)$/i.test(entry.name)) files.push(full)
  }
  return files
}

function chunkText(text) {
  const normalized = text.replace(/\r\n/g, '\n').trim()
  if (!normalized) return []

  const out = []
  for (let start = 0; start < normalized.length; start += CHUNK_SIZE) {
    out.push(normalized.slice(start, start + CHUNK_SIZE))
  }
  return out
}

async function main() {
  const limit = Number(getArg('--limit', '800'))
  const files = []

  for (const rel of TARGET_DIRS) {
    const full = path.join(ROOT, rel)
    try {
      const found = await walk(full)
      files.push(...found)
    } catch {
      // directory may not exist in some environments
    }
  }

  const chunks = []
  for (const file of files) {
    const raw = await readFile(file, 'utf-8')
    const pieces = chunkText(raw)
    pieces.forEach((content, idx) => {
      chunks.push({
        id: randomUUID(),
        source_path: path.relative(ROOT, file),
        chunk_index: idx,
        content,
        metadata: {
          source: path.relative(ROOT, file),
          language: 'en',
          ingest_ts: new Date().toISOString(),
        },
      })
    })
    if (chunks.length >= limit) break
  }

  const trimmed = chunks.slice(0, limit)
  const outPath = path.join(ROOT, 'data', 'knowledge', 'chunks.json')
  await writeJson(outPath, {
    generatedAt: new Date().toISOString(),
    count: trimmed.length,
    chunks: trimmed,
  })

  const conn = await initSchema()
  if (conn.enabled) {
    for (const chunk of trimmed) {
      await conn.client.query(
        `INSERT INTO knowledge_chunks (id, source_path, chunk_index, content, metadata)
         VALUES ($1,$2,$3,$4,$5)
         ON CONFLICT (id) DO NOTHING`,
        [chunk.id, chunk.source_path, chunk.chunk_index, chunk.content, chunk.metadata],
      )
    }
  }

  await closeDb(conn)
  console.log(`Ingested ${trimmed.length} knowledge chunks into ${outPath}${conn.enabled ? ' and Postgres' : ''}`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
