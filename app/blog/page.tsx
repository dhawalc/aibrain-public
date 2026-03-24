import type { Metadata } from 'next'
import Link from 'next/link'
import { buildBlogCategories } from '@/lib/blog-categories'
import { getAllArticles } from '@/lib/blog'
import { REQUEST_DEMO_URL, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Enterprise AI Automation Blog',
  description:
    'Implementation guides for enterprise AI automation, approval workflows, agent governance, and ERP CRM orchestration.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Enterprise AI Automation Blog | QorSync AI',
    description:
      'Implementation guides for enterprise AI automation, approval workflows, agent governance, and ERP CRM orchestration.',
    url: `${SITE_URL}/blog`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise AI Automation Blog | QorSync AI',
    description:
      'Implementation guides for enterprise AI automation, approval workflows, agent governance, and ERP CRM orchestration.',
  },
}

export default async function BlogPage() {
  const posts = await getAllArticles()
  const categories = buildBlogCategories(posts)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
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
            <Link href="/" className="text-slate-300 transition hover:text-white">
              Home
            </Link>
            <Link href="/solutions" className="text-slate-300 transition hover:text-white">
              Solutions
            </Link>
            <a href={REQUEST_DEMO_URL} className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-20 text-center">
        <h1 className="mb-6 text-5xl font-bold text-white">
          QorSync AI <span className="bg-gradient-to-r from-[#26AAE3] to-[#093E8F] bg-clip-text text-transparent">Blog</span>
        </h1>
        <p className="mx-auto max-w-2xl text-xl text-slate-300">
          Practical guidance on autonomous enterprise operations, agent execution, governance, and integration strategy.
        </p>
        {categories.length > 0 ? (
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/blog/category/${category.slug}`}
                className="rounded-full border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-sm font-medium text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-200"
              >
                {category.label} ({category.count})
              </Link>
            ))}
          </div>
        ) : null}
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-10">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-slate-300">Featured</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/blog/ai-approval-workflow', title: 'AI Approval Workflow Design for Faster Enterprise Decisions' },
            { href: '/blog/hitl-governance-design-patterns', title: 'HITL Governance Design Patterns for Enterprise AI Workflows' },
            { href: '/blog/enterprise-agent-governance-checklist', title: 'Enterprise Agent Governance Checklist for AI Operations' },
            { href: '/blog/ai-agent-risk-tiering-framework', title: 'AI Agent Risk Tiering Framework for Enterprise Teams' },
            { href: '/blog/enterprise-task-routing-with-ai-agents', title: 'Enterprise Task Routing with AI Agents' },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-center gap-3 rounded-lg border border-cyan-500/20 bg-cyan-500/5 px-4 py-3 transition hover:border-cyan-500/40"
            >
              <span className="h-2 w-2 flex-shrink-0 rounded-full bg-cyan-400" />
              <span className="text-sm font-medium text-cyan-200 group-hover:text-cyan-100">{item.title}</span>
            </Link>
          ))}
        </div>
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
                  <span className="rounded-full bg-[#26AAE3]/10 px-3 py-1 text-xs font-medium text-[#26AAE3]">{post.category}</span>
                  <span className="text-xs text-slate-400">{post.readTime}</span>
                </div>

                <h2 className="mb-3 line-clamp-2 text-xl font-bold text-white transition group-hover:text-[#26AAE3]">{post.title}</h2>

                <p className="mb-4 line-clamp-3 text-sm text-slate-400">{post.excerpt}</p>

                <div className="flex items-center justify-between">
                  <time className="text-xs text-slate-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="inline-flex items-center gap-1 text-sm font-medium text-[#26AAE3] transition group-hover:translate-x-1">
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

      <section className="border-t border-slate-800 bg-slate-900/40 py-14">
        <div className="mx-auto flex max-w-5xl flex-col items-center px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Looking for implementation-ready solution pages?</h2>
          <p className="mt-4 max-w-3xl text-slate-300">
            Explore focused guides for approval workflow software, agent governance, and cross-system ERP/CRM automation architecture.
          </p>
          <Link
            href="/solutions"
            className="mt-8 inline-flex items-center rounded-lg border border-cyan-500/40 bg-cyan-500/10 px-6 py-3 font-semibold text-cyan-300 transition hover:border-cyan-300 hover:text-cyan-200"
          >
            Explore Solutions
          </Link>
        </div>
      </section>
    </div>
  )
}
