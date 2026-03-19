#!/usr/bin/env node

import { mkdir, writeFile, access } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { AGENT_ORDER, stageEnvelope } from './contracts.mjs'
import { clamp, frontmatter, getArg, openAIText, readJson, slugify, titleCase, writeJson } from './utils.mjs'
import { closeDb, initSchema, persistRun } from './db.mjs'

const ROOT = process.cwd()
const BANNED_HYPE = ['replace thousands of employees', 'guaranteed', 'zero risk', 'fully autonomous no oversight']

function nowDate() {
  return new Date().toISOString().slice(0, 10)
}

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function keywordFromTopic(topic) {
  return topic
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter((v) => v.length > 3)
    .slice(0, 4)
}

function computeScores({ markdown, citations, title, description }) {
  const words = markdown.split(/\s+/).filter(Boolean)
  const sentenceCount = Math.max(1, markdown.split(/[.!?]+/).length)
  const avgSentence = words.length / sentenceCount

  const citationMentions = (markdown.match(/\[CIT-\d+\]/g) || []).length
  const uniqueCitationIds = new Set((markdown.match(/\[CIT-(\d+)\]/g) || []).map((m) => Number(m.replace(/\D/g, ''))))
  const citationCoverage = citations.length ? uniqueCitationIds.size / citations.length : 0

  const citationScore = clamp(Math.round(citationCoverage * 100))
  const seoStructure = clamp(
    Math.round(
      (title.length >= 40 && title.length <= 68 ? 35 : 20) +
        (description.length >= 120 && description.length <= 170 ? 25 : 15) +
        (markdown.includes('##') ? 20 : 10) +
        (citationMentions >= 3 ? 20 : 10),
    ),
  )

  const hypeHits = BANNED_HYPE.filter((term) => markdown.toLowerCase().includes(term)).length
  const brandScore = clamp(100 - hypeHits * 25)

  const readabilityPenalty = avgSentence > 28 ? 20 : avgSentence > 24 ? 10 : 0
  const readabilityScore = clamp(100 - readabilityPenalty)

  const factScore = clamp(Math.round(citationScore * 0.75 + (citationMentions >= 4 ? 25 : 10)))

  const quality = clamp(Math.round(citationScore * 0.3 + factScore * 0.3 + seoStructure * 0.2 + brandScore * 0.1 + readabilityScore * 0.1))

  return {
    quality,
    citation: citationScore,
    fact: factScore,
    seo: seoStructure,
    brand: brandScore,
    readability: readabilityScore,
  }
}

function gate(scores, citationsFound) {
  const issues = []
  if (scores.citation < 70) issues.push('Citation score below threshold (70).')
  if (scores.fact < 75) issues.push('Fact score below threshold (75).')
  if (scores.seo < 70) issues.push('SEO score below threshold (70).')
  if (scores.brand < 85) issues.push('Brand compliance below threshold (85).')
  if (scores.quality < 80) issues.push('Overall quality below threshold (80).')
  if (citationsFound < 3) issues.push('At least 3 citations required.')

  return {
    passed: issues.length === 0,
    issues,
  }
}

function normalizeTopic(topicRaw) {
  const topic = topicRaw && topicRaw.trim().length ? topicRaw.trim() : 'autonomous enterprise operations governance'
  const topicId = `${slugify(topic)}-${Date.now()}`
  return { topic, topicId }
}

async function loadKnowledge() {
  const data = await readJson(path.join(ROOT, 'data', 'knowledge', 'chunks.json'), { chunks: [] })
  return data?.chunks || []
}

function retrieveCitations(topic, chunks, max = 5) {
  if (!chunks.length) return []

  const kws = keywordFromTopic(topic)
  const scored = chunks
    .map((chunk) => {
      const body = String(chunk.content || '').toLowerCase()
      const score = kws.reduce((acc, kw) => acc + (body.includes(kw) ? 1 : 0), 0)
      return { chunk, score }
    })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, max)

  return scored.map((row, idx) => ({
    id: `CIT-${idx + 1}`,
    source: row.chunk.source_path,
    excerpt: String(row.chunk.content || '').slice(0, 240).replace(/\s+/g, ' ').trim(),
  }))
}

function fallbackArticle({ topic, citations }) {
  const citationBlock = citations.map((c) => `- [${c.id}] ${c.source}: ${c.excerpt}`).join('\n')
  return {
    title: titleCase(topic),
    description: `Practical implementation guide for ${topic} with governance-first execution and measurable outcomes.`,
    markdown: `# ${titleCase(topic)}\n\n## Why it matters\n${topic} impacts execution speed, compliance posture, and cost-to-serve for enterprise operations. [CIT-1]\n\n## Operating model\n1. Define risk tiers and approval boundaries. [CIT-2]\n2. Automate low-risk workflows with explicit guardrails. [CIT-3]\n3. Track outcomes weekly and refresh weak pages. [CIT-4]\n\n## Implementation checklist\n- Create policy gates for financial, customer, and security actions. [CIT-1]\n- Instrument GA4 + GSC and track conversion from organic traffic. [CIT-2]\n- Maintain audit trails and rollback strategy for risky automations. [CIT-3]\n\n## Citations\n${citationBlock || '- [CIT-1] Internal docs: no knowledge chunks found'}\n`,
  }
}

function parseGenerated(output, fallback) {
  if (!output) return fallback
  const title = output.match(/TITLE:\s*(.+)/i)?.[1]?.trim() || fallback.title
  const description = output.match(/DESCRIPTION:\s*(.+)/i)?.[1]?.trim() || fallback.description
  const body = output.replace(/TITLE:\s*.+/i, '').replace(/DESCRIPTION:\s*.+/i, '').trim()
  return {
    title,
    description,
    markdown: body || fallback.markdown,
  }
}

async function writeApprovalPacket({ runId, slug, gateResult, scores, title, description, citations, stages }) {
  const baseDir = path.join(ROOT, 'data', 'approvals', runId)
  await mkdir(baseDir, { recursive: true })

  const packet = {
    runId,
    slug,
    title,
    description,
    gateResult,
    scores,
    citations,
    stageCount: stages.length,
    generatedAt: new Date().toISOString(),
  }

  const packetJson = path.join(baseDir, 'approval.json')
  const packetMd = path.join(baseDir, 'approval.md')
  await writeJson(packetJson, packet)

  const md = [
    `# Approval Packet: ${title}`,
    '',
    `- Run ID: ${runId}`,
    `- Slug: ${slug}`,
    `- Gate Passed: ${gateResult.passed}`,
    `- Quality Score: ${scores.quality}`,
    `- Citation Score: ${scores.citation}`,
    `- Fact Score: ${scores.fact}`,
    `- SEO Score: ${scores.seo}`,
    '',
    '## Gate Issues',
    gateResult.issues.length ? gateResult.issues.map((x) => `- ${x}`).join('\n') : '- none',
    '',
    '## Citations',
    citations.length ? citations.map((c) => `- [${c.id}] ${c.source}: ${c.excerpt}`).join('\n') : '- none',
    '',
    '## Stage Outputs',
    ...stages.map((s) => `- ${s.agent}: next=${s.next_action}`),
    '',
  ].join('\n')

  await writeFile(packetMd, md, 'utf-8')
  return { packetJson, packetMd }
}

function pickTopicFromSources(trends, keywords, forcedTopic) {
  if (forcedTopic) return forcedTopic
  const candidates = []
  for (const t of trends?.topics || []) candidates.push(t.topic)
  for (const k of keywords?.items || []) candidates.push(k.keyword || k.topic)
  return candidates.length ? pick(candidates) : 'autonomous enterprise operations governance'
}

async function runOne({ forcedTopic = '' }) {
  const runId = randomUUID()
  const trends = await readJson(path.join(ROOT, 'data', 'trends.json'), { topics: [] })
  const keywords = await readJson(path.join(ROOT, 'data', 'keywords-plan.json'), { items: [] })
  const knowledge = await loadKnowledge()

  const pickedTopic = pickTopicFromSources(trends, keywords, forcedTopic)
  const { topic, topicId } = normalizeTopic(pickedTopic)
  const stages = []

  const trendStage = stageEnvelope({
    runId,
    agent: 'trend_scout',
    topicId,
    input: { trendsCount: (trends.topics || []).length },
    output: { topic },
    scores: { confidence: 85 },
    nextAction: 'keyword_hunter',
  })
  stages.push(trendStage)

  const keywordCandidates = keywordFromTopic(topic)
  const keywordStage = stageEnvelope({
    runId,
    agent: 'keyword_hunter',
    topicId,
    input: { topic },
    output: { primary_keyword: keywordCandidates[0] || topic, support_keywords: keywordCandidates.slice(1) },
    scores: { confidence: 82 },
    nextAction: 'content_strategist',
  })
  stages.push(keywordStage)

  const strategyStage = stageEnvelope({
    runId,
    agent: 'content_strategist',
    topicId,
    input: keywordStage.output,
    output: {
      angle: 'governance-first enterprise execution',
      intent: 'transactional-informational',
      cta: 'Request Demo',
      category: 'Agentic Automation & Orchestration',
    },
    scores: { confidence: 84 },
    nextAction: 'research_summarizer',
  })
  stages.push(strategyStage)

  const citations = retrieveCitations(topic, knowledge, 5)
  const researchStage = stageEnvelope({
    runId,
    agent: 'research_summarizer',
    topicId,
    input: { topic, knowledge_chunks: knowledge.length },
    output: { citations },
    scores: { confidence: citations.length ? 90 : 35 },
    nextAction: 'article_writer',
  })
  stages.push(researchStage)

  const citationText = citations.map((c) => `[${c.id}] ${c.source}: ${c.excerpt}`).join('\n')
  const prompt = `Write a markdown article for QorSync AI (an Accel4 product).\n\nTopic: ${topic}\n\nRequirements:\n- 900-1300 words\n- Practical and evidence-backed\n- Must cite sources inline with tags like [CIT-1], [CIT-2]\n- Include sections: Why now, Implementation plan, Governance controls, KPI table, Next 30 days\n- No hype claims\n\nOutput format:\nTITLE: ...\nDESCRIPTION: ...\n<markdown body>\n\nAllowed citations:\n${citationText || '[CIT-1] docs/AUTONOMOUS_CONTENT_ENGINE_MASTER_PLAN.md: canonical plan reference'}\n`

  const fallback = fallbackArticle({ topic, citations })
  const generatedText = await openAIText({ prompt, maxOutputTokens: 2600 })
  const generated = parseGenerated(generatedText, fallback)

  const writerStage = stageEnvelope({
    runId,
    agent: 'article_writer',
    topicId,
    input: { topic, citation_count: citations.length },
    output: generated,
    scores: { confidence: generatedText ? 86 : 60 },
    nextAction: 'seo_optimizer',
  })
  stages.push(writerStage)

  const seoTitle = generated.title.length > 68 ? generated.title.slice(0, 68) : generated.title
  const seoDescription = generated.description.length > 170 ? generated.description.slice(0, 170) : generated.description
  const seoStage = stageEnvelope({
    runId,
    agent: 'seo_optimizer',
    topicId,
    input: generated,
    output: { ...generated, title: seoTitle, description: seoDescription },
    scores: { confidence: 88 },
    nextAction: 'brand_editor',
  })
  stages.push(seoStage)

  const editedMarkdown = BANNED_HYPE.reduce((acc, phrase) => acc.replaceAll(phrase, 'high-confidence outcome with human oversight'), seoStage.output.markdown)
  const brandStage = stageEnvelope({
    runId,
    agent: 'brand_editor',
    topicId,
    input: seoStage.output,
    output: { ...seoStage.output, markdown: editedMarkdown },
    scores: { confidence: 90 },
    nextAction: 'fact_checker',
  })
  stages.push(brandStage)

  const citationRefs = (editedMarkdown.match(/\[CIT-\d+\]/g) || []).length
  const factStage = stageEnvelope({
    runId,
    agent: 'fact_checker',
    topicId,
    input: { citation_refs: citationRefs, citations_available: citations.length },
    output: {
      citation_refs: citationRefs,
      citations_available: citations.length,
      status: citationRefs >= 3 && citations.length >= 3 ? 'pass' : 'fail',
    },
    scores: { confidence: citationRefs >= 3 ? 85 : 45 },
    nextAction: 'publisher',
  })
  stages.push(factStage)

  const scores = computeScores({ markdown: editedMarkdown, citations, title: seoTitle, description: seoDescription })
  const gateResult = gate(scores, citationRefs)

  const slug = slugify(seoTitle)
  const shouldAutoPublish = (getArg('--auto-publish', 'false') || '').toLowerCase() === 'true'
  const publish = shouldAutoPublish && gateResult.passed
  const articleFm = frontmatter({
    title: seoTitle,
    description: seoDescription,
    date: nowDate(),
    category: strategyStage.output.category,
    author: 'Dhawal Chheda, AI Leader at Accel4',
    readTime: '8 min read',
    published: publish,
    qualityScore: scores.quality,
    citationScore: scores.citation,
    runId,
  })

  await mkdir(path.join(ROOT, 'content', 'blog'), { recursive: true })
  const outPath = path.join(ROOT, 'content', 'blog', `${slug}.md`)
  await writeFile(outPath, `${articleFm}\n${editedMarkdown}\n`, 'utf-8')

  const publisherStage = stageEnvelope({
    runId,
    agent: 'publisher',
    topicId,
    input: { outPath, publishRequested: shouldAutoPublish },
    output: { outPath, published: publish, status: gateResult.passed ? (publish ? 'published' : 'approved_pending_manual') : 'blocked' },
    scores: { confidence: gateResult.passed ? 88 : 55 },
    nextAction: 'performance_analyst',
  })
  stages.push(publisherStage)

  const perfStage = stageEnvelope({
    runId,
    agent: 'performance_analyst',
    topicId,
    input: { slug, path: `/blog/${slug}` },
    output: { refresh_check_due_days: 14, metrics_targets: { min_clicks: 20, min_ctr: 0.015 } },
    scores: { confidence: 78 },
    nextAction: 'complete',
  })
  stages.push(perfStage)

  const approval = await writeApprovalPacket({
    runId,
    slug,
    gateResult,
    scores,
    title: seoTitle,
    description: seoDescription,
    citations,
    stages,
  })

  const runPayload = {
    id: runId,
    created_at: new Date().toISOString(),
    topic_id: topicId,
    topic,
    slug,
    status: gateResult.passed ? 'approved' : 'needs_review',
    scores,
    citations,
    gates: gateResult,
    artifacts: {
      article: outPath,
      approval,
    },
    stages,
  }

  return runPayload
}

function extractTopicsFromList(raw) {
  if (!raw) return []
  if (Array.isArray(raw)) {
    return raw
      .map((item) => {
        if (typeof item === 'string') return item
        if (item?.topic) return item.topic
        if (item?.keyword) return item.keyword
        return ''
      })
      .filter(Boolean)
  }
  return []
}

async function loadTopicsFile(filePath) {
  if (!filePath) return []
  const abs = path.isAbsolute(filePath) ? filePath : path.join(ROOT, filePath)
  const data = await readJson(abs, null)
  if (!data) return []
  if (Array.isArray(data)) return extractTopicsFromList(data)
  return [
    ...extractTopicsFromList(data.topics),
    ...extractTopicsFromList(data.top20),
    ...extractTopicsFromList(data.items),
    ...extractTopicsFromList(data.all),
    ...extractTopicsFromList(data.queue),
  ].filter(Boolean)
}

async function fileExists(filePath) {
  try {
    await access(filePath)
    return true
  } catch {
    return false
  }
}

async function main() {
  const forcedTopic = getArg('--topic', '')
  const runsCount = Number(getArg('--count', '1'))
  const topicsFile = getArg('--topics-file', '')
  const skipExisting = (getArg('--skip-existing', 'true') || '').toLowerCase() !== 'false'
  const topicsFromFile = await loadTopicsFile(topicsFile)

  if (!AGENT_ORDER.length) {
    throw new Error('Agent order is empty')
  }

  const conn = await initSchema()
  const results = []

  const candidateTopics = topicsFromFile.length ? topicsFromFile : Array.from({ length: runsCount }).map((_, i) => (i === 0 ? forcedTopic : ''))
  const uniqueTopics = []
  const seen = new Set()
  for (const topic of candidateTopics) {
    const t = String(topic || '').trim()
    if (!t) continue
    const key = t.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)

    if (skipExisting) {
      const slug = slugify(t)
      const outPath = path.join(ROOT, 'content', 'blog', `${slug}.md`)
      if (await fileExists(outPath)) continue
    }

    uniqueTopics.push(t)
    if (uniqueTopics.length >= runsCount) break
  }

  const selectedTopics = uniqueTopics

  for (let i = 0; i < selectedTopics.length; i += 1) {
    const payload = await runOne({ forcedTopic: selectedTopics[i] })
    await persistRun(conn, payload)
    results.push({
      id: payload.id,
      topic: payload.topic,
      slug: payload.slug,
      status: payload.status,
      quality: payload.scores.quality,
      article: payload.artifacts.article,
      approval: payload.artifacts.approval.packetMd,
    })
  }

  await closeDb(conn)
  const out = path.join(ROOT, 'data', 'runs', 'latest-summary.json')
  await writeJson(out, { generatedAt: new Date().toISOString(), runs: results })

  console.log(JSON.stringify({ runs: results.length, out, results }, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
