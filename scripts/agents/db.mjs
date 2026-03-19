import { randomUUID } from 'crypto'
import path from 'path'
import { writeJson } from './utils.mjs'

let pgModule = null

async function getPg() {
  if (!process.env.DATABASE_URL) return null
  if (!pgModule) {
    try {
      pgModule = await import('pg')
    } catch {
      return null
    }
  }
  const { Client } = pgModule
  const client = new Client({ connectionString: process.env.DATABASE_URL, ssl: process.env.PGSSL === 'false' ? false : undefined })
  await client.connect()
  return client
}

export async function initSchema() {
  const client = await getPg()
  if (!client) return { enabled: false }

  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS content_runs (
        id TEXT PRIMARY KEY,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        topic_id TEXT NOT NULL,
        topic TEXT NOT NULL,
        status TEXT NOT NULL,
        quality_score NUMERIC,
        citation_score NUMERIC,
        fact_score NUMERIC,
        seo_score NUMERIC,
        brand_score NUMERIC,
        readability_score NUMERIC,
        payload JSONB NOT NULL
      );

      CREATE TABLE IF NOT EXISTS content_stage_outputs (
        id TEXT PRIMARY KEY,
        run_id TEXT NOT NULL,
        stage_name TEXT NOT NULL,
        output JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS knowledge_chunks (
        id TEXT PRIMARY KEY,
        source_path TEXT NOT NULL,
        chunk_index INTEGER NOT NULL,
        content TEXT NOT NULL,
        metadata JSONB NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS article_metrics (
        id TEXT PRIMARY KEY,
        captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        slug TEXT,
        page_path TEXT,
        sessions NUMERIC,
        views NUMERIC,
        clicks NUMERIC,
        impressions NUMERIC,
        ctr NUMERIC,
        position NUMERIC,
        source TEXT NOT NULL,
        payload JSONB NOT NULL
      );
    `)
    return { enabled: true, client }
  } catch (error) {
    await client.end()
    throw error
  }
}

export async function closeDb(conn) {
  if (conn?.client) await conn.client.end()
}

export async function persistRun(conn, payload) {
  const diskPath = path.join(process.cwd(), 'data', 'runs', `${payload.id}.json`)
  await writeJson(diskPath, payload)

  if (!conn?.enabled) return { mode: 'file', diskPath }

  await conn.client.query(
    `INSERT INTO content_runs (id, topic_id, topic, status, quality_score, citation_score, fact_score, seo_score, brand_score, readability_score, payload)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     ON CONFLICT (id) DO UPDATE SET
       status=EXCLUDED.status,
       quality_score=EXCLUDED.quality_score,
       citation_score=EXCLUDED.citation_score,
       fact_score=EXCLUDED.fact_score,
       seo_score=EXCLUDED.seo_score,
       brand_score=EXCLUDED.brand_score,
       readability_score=EXCLUDED.readability_score,
       payload=EXCLUDED.payload`,
    [
      payload.id,
      payload.topic_id,
      payload.topic,
      payload.status,
      payload.scores.quality,
      payload.scores.citation,
      payload.scores.fact,
      payload.scores.seo,
      payload.scores.brand,
      payload.scores.readability,
      payload,
    ],
  )

  for (const stage of payload.stages) {
    await conn.client.query(
      `INSERT INTO content_stage_outputs (id, run_id, stage_name, output)
       VALUES ($1,$2,$3,$4)
       ON CONFLICT (id) DO UPDATE SET output=EXCLUDED.output`,
      [randomUUID(), payload.id, stage.agent, stage],
    )
  }

  return { mode: 'db+file', diskPath }
}

export async function persistMetrics(conn, rows) {
  if (!rows.length) return
  if (!conn?.enabled) return

  for (const row of rows) {
    await conn.client.query(
      `INSERT INTO article_metrics (id, slug, page_path, sessions, views, clicks, impressions, ctr, position, source, payload)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
       ON CONFLICT (id) DO UPDATE SET payload=EXCLUDED.payload`,
      [
        row.id || randomUUID(),
        row.slug || null,
        row.page_path || null,
        row.sessions || 0,
        row.views || 0,
        row.clicks || 0,
        row.impressions || 0,
        row.ctr || 0,
        row.position || 0,
        row.source || 'unknown',
        row,
      ],
    )
  }
}
