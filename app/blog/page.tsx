import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/blog'
import { REQUEST_DEMO_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'AI Brain Blog | SAP, ERP & Enterprise AI Insights',
  description:
    'Expert insights on SAP S/4HANA, enterprise architecture, AI-powered discovery, and digital transformation.',
}

export default async function BlogPage() {
  const posts = await getAllArticles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-400 to-blue-600 font-bold text-white">
              AI
            </div>
            <span className="text-xl font-bold text-white">AI Brain</span>
          </Link>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/landing" className="text-slate-300 transition hover:text-white">
              Home
            </Link>
            <a href={REQUEST_DEMO_URL} className="rounded-lg bg-cyan-600 px-4 py-2 font-medium text-white transition hover:bg-cyan-700">
              Request Demo
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-white">
          AI Brain <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Blog</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-slate-300">
          Practical guidance on SAP discovery, migration strategy, enterprise architecture, and applied AI.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        {posts.length === 0 ? (
          <div className="py-20 text-center">
            <h2 className="mb-3 text-2xl font-bold text-white">No Published Posts Yet</h2>
            <p className="text-slate-400">Add markdown files under `content/blog` with `published: true`.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-xl border border-slate-800 bg-slate-900/50 p-6 transition-all hover:border-cyan-500/50 hover:shadow-lg hover:shadow-cyan-500/10"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="rounded-full bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-400">{post.category}</span>
                  <span className="text-xs text-slate-400">{post.readTime}</span>
                </div>

                <h2 className="mb-3 line-clamp-2 text-xl font-bold text-white transition group-hover:text-cyan-400">{post.title}</h2>

                <p className="mb-4 line-clamp-3 text-sm text-slate-400">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <time className="text-xs text-slate-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-cyan-400 transition group-hover:translate-x-1">
                    Read more
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
