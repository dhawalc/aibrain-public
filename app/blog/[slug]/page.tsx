import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound, permanentRedirect } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import DemoCta from '@/components/demo-cta'
import LinkedInCopyButton from '@/components/linkedin-copy-button'
import NewsletterCta from '@/components/newsletter-cta'
import SecondaryCta from '@/components/secondary-cta'
import { toCategorySlug } from '@/lib/blog-categories'
import { AUTHOR_NAME, AUTHOR_PATH, AUTHOR_TITLE } from '@/lib/brand'
import { getAllArticles, getArticleBySlug, getRelatedArticles, resolveCanonicalArticleSlug } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

/** Strip the first `# Heading` line from markdown to avoid duplicate H1 with the template heading */
function stripFirstH1(markdown: string): string {
  return markdown.replace(/^#\s+.+\n*/, '')
}

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const posts = await getAllArticles()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const canonicalSlug = await resolveCanonicalArticleSlug(slug)

  if (!canonicalSlug) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    }
  }

  const post = await getArticleBySlug(canonicalSlug)

  if (!post) {
    return {
      title: 'Post Not Found',
      robots: { index: false, follow: false },
    }
  }

  const canonicalPath = `/blog/${canonicalSlug}`
  const canonicalUrl = `${SITE_URL}${canonicalPath}`

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: AUTHOR_NAME }],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
      url: canonicalUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
    },
    robots:
      post.isTemplated || post.wordCount < 600
        ? { index: false, follow: true }
        : { index: true, follow: true },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const canonicalSlug = await resolveCanonicalArticleSlug(slug)

  if (!canonicalSlug) {
    notFound()
  }

  if (canonicalSlug !== slug) {
    permanentRedirect(`/blog/${canonicalSlug}`)
  }

  const post = await getArticleBySlug(canonicalSlug)

  if (!post) {
    notFound()
  }

  const related = await getRelatedArticles(canonicalSlug)
  const articleUrl = `${SITE_URL}/blog/${canonicalSlug}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: AUTHOR_NAME,
      jobTitle: AUTHOR_TITLE,
      url: `${SITE_URL}${AUTHOR_PATH}`,
    },
    publisher: {
      '@type': 'Organization',
      name: 'Accel4',
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  }
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: articleUrl },
    ],
  }

  const faqJsonLd =
    post.faq && post.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {faqJsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} /> : null}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#093E8F] to-[#1C74BC] font-bold text-white">
              Q
            </div>
            <div>
              <span className="text-xl font-bold text-white">QorSync AI</span>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">An Accel4 Product</p>
            </div>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/blog" className="text-slate-300 transition hover:text-white">
              Blog
            </Link>
            <Link href="/solutions" className="text-slate-300 transition hover:text-white">
              Solutions
            </Link>
            <Link href="/tools" className="text-slate-300 transition hover:text-white">
              Tools
            </Link>
            <DemoCta source="article_header" className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </DemoCta>
          </nav>
        </div>
      </header>

      <article className="mx-auto max-w-4xl px-6 py-12">
        <Link href="/blog" className="mb-8 inline-flex items-center text-[#26AAE3] transition hover:text-cyan-300">
          <svg className="mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <header className="mb-12">
          <div className="mb-4 flex items-center gap-3">
            <Link
              href={`/blog/category/${toCategorySlug(post.category)}`}
              className="rounded-full bg-[#26AAE3]/10 px-3 py-1 text-sm font-medium text-[#26AAE3] transition hover:bg-[#26AAE3]/20"
            >
              {post.category}
            </Link>
            <span className="text-sm text-slate-400">{post.readTime}</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-white">{post.title}</h1>

          {post.description ? <p className="mb-8 text-xl text-slate-300">{post.description}</p> : null}

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <Link href={AUTHOR_PATH} className="text-[#26AAE3] hover:text-cyan-300">
              {AUTHOR_NAME}
            </Link>
            <span>•</span>
            <span>{AUTHOR_TITLE}</span>
            <span>•</span>
            <time>
              {new Date(post.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span>•</span>
            <LinkedInCopyButton title={post.title} description={post.description} url={articleUrl} />
          </div>
        </header>

        <div className="space-y-6 text-slate-300">
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize, rehypeHighlight]}
            components={{
              h1: ({ ...props }) => <h1 className="mt-12 mb-6 text-4xl font-bold text-white" {...props} />,
              h2: ({ ...props }) => <h2 className="mt-10 mb-4 text-3xl font-bold text-white" {...props} />,
              h3: ({ ...props }) => <h3 className="mt-8 mb-3 text-2xl font-bold text-white" {...props} />,
              p: ({ ...props }) => <p className="leading-relaxed" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc space-y-2 pl-6" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal space-y-2 pl-6" {...props} />,
              a: ({ ...props }) => <a className="text-[#26AAE3] underline hover:text-cyan-300" {...props} />,
              code: ({ className, ...props }) => {
                const isBlock = Boolean(className)
                if (isBlock) {
                  return <code className={className} {...props} />
                }
                return <code className="rounded bg-slate-900 px-2 py-1 text-sm text-cyan-300" {...props} />
              },
              pre: ({ ...props }) => (
                <pre className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-900 p-4 text-sm" {...props} />
              ),
            }}
          >
            {stripFirstH1(post.content)}
          </ReactMarkdown>
        </div>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-6">
          <h2 className="text-2xl font-bold text-white">Implementation Solution Pages</h2>
          <p className="mt-3 text-sm text-slate-300">
            If you are evaluating production rollout, start with these solution pages for architecture and governance-fit details.
          </p>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <Link
              href="/solutions/ai-approval-workflow-software"
              className="rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm text-cyan-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              AI Approval Workflow Software
            </Link>
            <Link
              href="/solutions/enterprise-agent-governance"
              className="rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm text-cyan-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              Enterprise Agent Governance
            </Link>
            <Link
              href="/solutions/erp-crm-automation"
              className="rounded-lg border border-slate-700 bg-slate-800/60 p-3 text-sm text-cyan-300 transition hover:border-cyan-400/50 hover:text-cyan-200"
            >
              ERP and CRM Automation
            </Link>
          </div>
        </section>

        <NewsletterCta source={`article_newsletter_${canonicalSlug}`} articleTitle={post.title} />

        <div className="mt-16 rounded-2xl border border-[#26AAE3]/30 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 p-8">
          <h3 className="mb-3 text-2xl font-bold text-white">Ready to Run Autonomous Enterprise Operations?</h3>
          <p className="mb-6 text-slate-300">See how QorSync AI deploys governed agents across your enterprise systems.</p>
          <DemoCta
            source={`article_bottom_${canonicalSlug}`}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white transition hover:from-[#0A3F8F] hover:to-[#1C74BC]"
          >
            Request Demo
          </DemoCta>
          <div className="mt-6 border-t border-slate-700 pt-6">
            <p className="mb-4 text-sm text-slate-400">Not ready for a demo? Start here instead:</p>
            <SecondaryCta source={canonicalSlug} />
          </div>
        </div>

        {related.length > 0 ? (
          <section className="mt-16">
            <h2 className="mb-4 text-2xl font-bold text-white">Related Articles</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link
                  key={item.slug}
                  href={`/blog/${item.slug}`}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-4 text-slate-300 transition hover:border-cyan-500/50"
                >
                  <p className="font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm text-slate-400">{item.readTime}</p>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </div>
  )
}
