import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { buildBlogCategories, filterPostsByCategorySlug } from '@/lib/blog-categories'
import { getAllArticles } from '@/lib/blog'
import { SITE_URL } from '@/lib/site'

type Params = Promise<{ category: string }>

export async function generateStaticParams() {
  const posts = await getAllArticles()
  const categories = buildBlogCategories(posts)
  return categories.map((category) => ({ category: category.slug }))
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { category } = await params
  const posts = await getAllArticles()
  const categories = buildBlogCategories(posts)
  const categoryMeta = categories.find((item) => item.slug === category)

  if (!categoryMeta) {
    return {
      title: 'Category Not Found',
      robots: { index: false, follow: false },
    }
  }

  const canonicalPath = `/blog/category/${categoryMeta.slug}`
  const title = `${categoryMeta.label} Articles`
  const description = `Browse ${categoryMeta.count} articles in ${categoryMeta.label}. Practical playbooks on enterprise AI operations.`

  return {
    title,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}${canonicalPath}`,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function BlogCategoryPage({ params }: { params: Params }) {
  const { category } = await params
  const posts = await getAllArticles()
  const categories = buildBlogCategories(posts)
  const categoryMeta = categories.find((item) => item.slug === category)

  if (!categoryMeta) {
    notFound()
  }

  const categoryPosts = filterPostsByCategorySlug(posts, categoryMeta.slug)

  if (categoryPosts.length === 0) {
    notFound()
  }

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
            <Link href="/blog" className="text-slate-300 transition hover:text-white">
              Blog
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-16">
        <Link href="/blog" className="inline-flex items-center text-sm text-[#26AAE3] hover:text-cyan-300">
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          All blog articles
        </Link>
        <p className="mt-8 text-sm uppercase tracking-[0.18em] text-[#26AAE3]">Category</p>
        <h1 className="mt-3 text-5xl font-bold text-white">{categoryMeta.label}</h1>
        <p className="mt-4 text-lg text-slate-300">
          {categoryMeta.count} article{categoryMeta.count === 1 ? '' : 's'} with practical frameworks and implementation guidance.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-20">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {categoryPosts.map((post) => (
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

              <time className="text-xs text-slate-500">
                {new Date(post.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
