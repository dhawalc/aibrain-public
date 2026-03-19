import { mkdir, readFile, writeFile } from 'fs/promises'
import path from 'path'

export function getArg(flag, fallback = '') {
  const idx = process.argv.indexOf(flag)
  if (idx === -1 || !process.argv[idx + 1]) return fallback
  return process.argv[idx + 1]
}

export function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

export async function readJson(file, fallback = null) {
  try {
    const raw = await readFile(file, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

export async function writeJson(file, payload) {
  await mkdir(path.dirname(file), { recursive: true })
  await writeFile(file, JSON.stringify(payload, null, 2), 'utf-8')
}

export function clamp(num, min = 0, max = 100) {
  return Math.max(min, Math.min(max, num))
}

export function titleCase(v) {
  return v
    .split(/\s+/)
    .map((token) => token.slice(0, 1).toUpperCase() + token.slice(1))
    .join(' ')
}

export async function openAIText({ prompt, maxOutputTokens = 2200 }) {
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) return null

  const response = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-5-mini',
      input: prompt,
      max_output_tokens: maxOutputTokens,
    }),
  })

  if (!response.ok) {
    const text = await response.text()
    throw new Error(`OpenAI API error: ${response.status} ${text}`)
  }

  const json = await response.json()
  return json.output_text || null
}

export function frontmatter(obj) {
  const lines = Object.entries(obj).map(([key, val]) => {
    if (typeof val === 'boolean' || typeof val === 'number') return `${key}: ${val}`
    if (Array.isArray(val)) return `${key}: [${val.map((v) => JSON.stringify(v)).join(', ')}]`
    return `${key}: ${JSON.stringify(String(val))}`
  })
  return `---\n${lines.join('\n')}\n---\n`
}
