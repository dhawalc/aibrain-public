import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import rehypeHighlight from 'rehype-highlight'
import rehypeSanitize from 'rehype-sanitize'
import remarkGfm from 'remark-gfm'
import LinkedInCopyButton from '@/components/linkedin-copy-button'
import { getAllArticles, getArticleBySlug, getRelatedArticles } from '@/lib/blog'
import { REQUEST_DEMO_URL, SITE_URL } from '@/lib/site'

type Params = Promise<{ slug: string }>

export async function generateStaticParams() {
  const posts = await getAllArticles()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const post = await getArticleBySlug(slug)

  if (!post) {
    return { title: 'Post Not Found | QorSync AI Blog' }
  }

  return {
    title: `${post.title} | QorSync AI Blog`,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      type: 'article',
      publishedTime: post.date,
    },
  }
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params
  const post = await getArticleBySlug(slug)

  if (!post) {
    notFound()
  }

  const related = await getRelatedArticles(slug)
  const articleUrl = `${SITE_URL}/blog/${slug}`

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/landing" className="flex items-center gap-3">
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
            <a href={REQUEST_DEMO_URL} className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </a>
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
            <span className="rounded-full bg-[#26AAE3]/10 px-3 py-1 text-sm font-medium text-[#26AAE3]">{post.category}</span>
            <span className="text-sm text-slate-400">{post.readTime}</span>
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-white">{post.title}</h1>

          {post.description ? <p className="mb-8 text-xl text-slate-300">{post.description}</p> : null}

          <div className="flex items-center gap-4 text-sm text-slate-400">
            <span>{post.author}</span>
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
            {post.content}
          </ReactMarkdown>
        </div>

        <div className="mt-16 rounded-2xl border border-[#26AAE3]/30 bg-gradient-to-r from-cyan-600/10 to-blue-600/10 p-8">
          <h3 className="mb-3 text-2xl font-bold text-white">Ready to Run Autonomous Enterprise Operations?</h3>
          <p className="mb-6 text-slate-300">See how QorSync AI deploys governed agents across your enterprise systems.</p>
          <a
            href={REQUEST_DEMO_URL}
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white transition hover:from-[#0A3F8F] hover:to-[#1C74BC]"
          >
            Request Demo
          </a>
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
