import { promises as fs } from 'fs'
import path from 'path'
import matter from 'gray-matter'

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog')

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  date: string
  category: string
  author: string
  readTime: string
  published: boolean
  excerpt: string
  wordCount: number
  isTemplated: boolean
  topicKey: string
}

export type FaqItem = { q: string; a: string }

export type BlogPost = BlogPostMeta & {
  content: string
  faq?: FaqItem[]
}

type Frontmatter = Partial<{
  title: string
  description: string
  date: string
  category: string
  author: string
  readTime: string
  published: boolean
  qualityScore: number
  citationScore: number
}>

const TOPIC_VARIANT_SUFFIX =
  /-(30-60-90-day-plan|adoption-roadmap|architecture-deep-dive|automation-playbook|best-practices|checklist-for-teams|common-mistakes-and-fixes|common-pitfalls|complete-guide-for-2026|decision-framework|deployment-guide|design-patterns|executive-guide|field-guide|framework-and-template|framework-and-templates|implementation-bluepri|implementation-blueprint|maturity-model|metrics-that-matter|practical-playbook|product-engineering-guide|risk-and-governance-guide|roi-blueprint|step-by-step-guide|strategy-playbook|team-enablement-guide|transformation-guide|troubleshooting-guide|workflow-optimization-guide)$/

const LEGACY_SLUG_REDIRECTS: Record<string, string> = {
  'agent-orchestration-for-enterprise-workflows-framework-and-template': 'multi-agent-execution-playbook',
  'agent-orchestration-for-enterprise-workflows-implementation-bluepri': 'multi-agent-execution-playbook',
  'agent-orchestration-for-enterprise-workflows-implementation-blueprint': 'multi-agent-execution-playbook',
  'ai-approval-workflow-design-implementation-blueprint': 'approval-workflow-design-patterns',
  'ai-approval-workflow-design-practical-playbook': 'approval-workflow-design-patterns',
  'enterprise-task-routing-with-ai-agents-practical-playbook': 'enterprise-task-routing-with-ai-agents',
  'erp-crm-integration-automation-deployment-guide': 'erp-crm-handoff-automation',
  'human-in-the-loop-governance-model': 'hitl-governance-design-patterns',
  'human-in-the-loop-governance-model-practical-playbook': 'hitl-governance-design-patterns',
  'multi-agent-execution-playbook-design-patterns': 'multi-agent-execution-playbook',
  'multi-agent-execution-playbook-transformation-guide': 'multi-agent-execution-playbook',
}

const LEGACY_TEMPLATE_MARKERS = [
  '## Why this matters',
  '## What teams usually get wrong',
  '## QorSync AI operating model',
  '## Human-in-the-loop design checklist',
  '## KPI table',
  '## Implementation playbook (first 30 days)',
  '## Final takeaways',
]

const TEMPLATE_MARKERS = ['## Why it matters', '## Operating model', '## Implementation checklist', '## Citations']

const TEMPLATE_PHRASES = [
  'impacts execution speed, compliance posture, and cost-to-serve for enterprise operations.',
  'Define risk tiers and approval boundaries.',
  'Automate low-risk workflows with explicit guardrails.',
  'Track outcomes weekly and refresh weak pages.',
  'Create policy gates for financial, customer, and security actions.',
  'Maintain audit trails and rollback strategy for risky automations.',
]

const MIN_INDEXABLE_WORD_COUNT = 600

function stripMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, ' ')
    .replace(/`[^`]*`/g, ' ')
    .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/\[[^\]]*\]\([^)]*\)/g, ' ')
    .replace(/^#{1,6}\s+/gm, '')
    .replace(/[>*_~#-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function sanitizeSnippet(text: string): string {
  return text
    .replace(/\b(?:deep\s+research|comprehensive\s+research\s+report)\b:?\s*/gi, '')
    .replace(/\bi(?:'ll| will)\s+(?:compile|conduct|organize|cover)\b[^.?!]*[.?!]?\s*/gi, '')
    .replace(/\s+/g, ' ')
    .trim()
}

function toTopicKey(slug: string): string {
  return slug.replace(TOPIC_VARIANT_SUFFIX, '')
}

function normalizeSlug(slug: string): string {
  return slug.trim().replace(/^\/+|\/+$/g, '')
}

function isBoilerplateArticle(content: string, wordCount: number): boolean {
  const legacyMarkerHits = LEGACY_TEMPLATE_MARKERS.reduce((sum, marker) => sum + Number(content.includes(marker)), 0)
  const markerHits = TEMPLATE_MARKERS.reduce((sum, marker) => sum + Number(content.includes(marker)), 0)
  const phraseHits = TEMPLATE_PHRASES.reduce((sum, phrase) => sum + Number(content.includes(phrase)), 0)
  const citationRefs = (content.match(/\[CIT-\d+\]/g) || []).length

  if (legacyMarkerHits >= 6 && wordCount <= 450) {
    return true
  }

  if (markerHits >= 4 && citationRefs >= 4 && wordCount <= 450) {
    return true
  }

  if (phraseHits >= 4 && citationRefs >= 3 && wordCount <= 450) {
    return true
  }

  return false
}

function toMeta(slug: string, data: Frontmatter, content: string): BlogPostMeta {
  const words = content.trim().split(/\s+/).length
  const descriptionText = sanitizeSnippet(stripMarkdown(data.description ?? ''))
  const contentText = sanitizeSnippet(stripMarkdown(content))
  const excerptSource = descriptionText || contentText
  const excerpt = excerptSource.slice(0, 150)
  const normalizedDescription = descriptionText || excerpt
  const isTemplated = isBoilerplateArticle(content, words)

  return {
    slug,
    title: data.title ?? 'Untitled',
    description: normalizedDescription,
    date: data.date ?? new Date().toISOString().slice(0, 10),
    category: data.category ?? 'General',
    author: data.author ?? 'Dhawal Chheda, AI Leader at Accel4',
    readTime: data.readTime ?? `${Math.max(1, Math.ceil(words / 220))} min read`,
    published: data.published ?? false,
    excerpt: excerpt.length === 150 ? `${excerpt}...` : excerpt,
    wordCount: words,
    isTemplated,
    topicKey: toTopicKey(slug),
  }
}

type ArticleListOptions = {
  includeTemplated?: boolean
}

function slugTokens(value: string): string[] {
  return value
    .replace(TOPIC_VARIANT_SUFFIX, '')
    .split('-')
    .map((token) => token.trim().toLowerCase())
    .filter((token) => token.length > 2)
}

function scoreCanonicalCandidate(slug: string, post: BlogPostMeta): { overlap: number; score: number; exactTopic: boolean } {
  const requestedTopic = toTopicKey(slug)
  const requestedTokens = slugTokens(requestedTopic)
  const candidateTokens = slugTokens(post.topicKey)
  const candidateTokenSet = new Set(candidateTokens)
  const overlap = requestedTokens.filter((token) => candidateTokenSet.has(token)).length
  const exactTopic = post.topicKey === requestedTopic
  const requestedContainsCandidate = requestedTopic.includes(post.topicKey) ? 1 : 0
  const candidateContainsRequested = post.topicKey.includes(requestedTopic) ? 1 : 0

  return {
    overlap,
    exactTopic,
    score: (exactTopic ? 100 : 0) + overlap * 5 + requestedContainsCandidate * 2 + candidateContainsRequested,
  }
}

export async function getAllArticles(options: ArticleListOptions = {}): Promise<BlogPostMeta[]> {
  const { includeTemplated = false } = options
  let files: string[] = []
  try {
    files = await fs.readdir(BLOG_DIR)
  } catch {
    return []
  }

  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async (file) => {
        const slug = file.replace(/\.mdx?$/, '')
        const raw = await fs.readFile(path.join(BLOG_DIR, file), 'utf-8')
        const { data, content } = matter(raw)
        return toMeta(slug, data as Frontmatter, content)
      }),
  )

  return posts
    .filter((post) => post.published)
    .filter((post) => includeTemplated || (!post.isTemplated && post.wordCount >= MIN_INDEXABLE_WORD_COUNT))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getArticleBySlug(slug: string): Promise<BlogPost | null> {
  const candidates = [path.join(BLOG_DIR, `${slug}.md`), path.join(BLOG_DIR, `${slug}.mdx`)]

  for (const filePath of candidates) {
    try {
      const raw = await fs.readFile(filePath, 'utf-8')
      const { data, content } = matter(raw)
      const meta = toMeta(slug, data as Frontmatter, content)
      if (!meta.published) return null
      const faq = Array.isArray((data as Record<string, unknown>).faq)
        ? ((data as Record<string, unknown>).faq as FaqItem[])
        : undefined
      return { ...meta, content, faq }
    } catch {
      continue
    }
  }

  return null
}

export async function getRelatedArticles(currentSlug: string, limit = 3, includeTemplated = false): Promise<BlogPostMeta[]> {
  const all = await getAllArticles({ includeTemplated })
  const current = all.find((post) => post.slug === currentSlug)
  if (!current) {
    return all.filter((post) => post.slug !== currentSlug).slice(0, limit)
  }

  const currentTokens = new Set(slugTokens(current.topicKey))

  return all
    .filter((post) => post.slug !== currentSlug)
    .map((post) => {
      const overlap = slugTokens(post.topicKey).filter((token) => currentTokens.has(token)).length
      const sameTopic = post.topicKey === current.topicKey ? 100 : 0
      const sameCategory = post.category === current.category ? 2 : 0
      return {
        post,
        score: sameTopic + overlap + sameCategory,
      }
    })
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })
    .slice(0, limit)
    .map(({ post }) => post)
}

export async function resolveCanonicalArticleSlug(rawSlug: string): Promise<string | null> {
  const slug = normalizeSlug(rawSlug)
  if (!slug) return null

  const direct = await getArticleBySlug(slug)
  if (direct) {
    const redirectTarget = LEGACY_SLUG_REDIRECTS[slug]
    if (redirectTarget) {
      const mapped = await getArticleBySlug(redirectTarget)
      if (mapped) return mapped.slug
    }
    return direct.slug
  }

  const mappedSlug = LEGACY_SLUG_REDIRECTS[slug]
  if (mappedSlug) {
    const mapped = await getArticleBySlug(mappedSlug)
    if (mapped) return mapped.slug
  }

  const all = await getAllArticles({ includeTemplated: true })
  if (all.length === 0) return null

  const requestTokens = slugTokens(slug)
  if (requestTokens.length === 0) return null

  const scored = all
    .filter((post) => !post.isTemplated)
    .map((post) => ({ post, ...scoreCanonicalCandidate(slug, post) }))
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score
      return new Date(b.post.date).getTime() - new Date(a.post.date).getTime()
    })

  const best = scored[0]
  if (!best) return null

  if (best.exactTopic) {
    return best.post.slug
  }

  if (best.overlap >= Math.min(3, requestTokens.length) && best.score >= 10) {
    return best.post.slug
  }

  if (requestTokens.length <= 3 && best.overlap >= 2) {
    return best.post.slug
  }

  return null
}
