import type { Metadata } from 'next'
import Link from 'next/link'
import { getAllArticles } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Dhawal Chheda | AI Leader at Accel4',
  description: 'Articles and operating notes by Dhawal Chheda, AI Leader at Accel4.',
}

const personJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Dhawal Chheda',
  jobTitle: 'AI Leader at Accel4',
  url: 'https://qorsync.online/author/dhawal-chheda',
}

export default async function AuthorPage() {
  const posts = await getAllArticles()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }} />
      <main className="mx-auto max-w-5xl px-6 py-16">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-8">
          <p className="text-sm uppercase tracking-widest text-[#26AAE3]">Author</p>
          <h1 className="mt-2 text-4xl font-bold text-white">Dhawal Chheda</h1>
          <p className="mt-2 text-lg text-slate-300">AI Leader at Accel4</p>
          <p className="mt-4 max-w-3xl text-slate-400">
            Dhawal writes about autonomous enterprise operations, agent governance, cross-system execution, and how to turn AI
            into measurable operational outcomes.
          </p>
          <Link href="/blog" className="mt-6 inline-flex items-center text-[#26AAE3] hover:text-cyan-300">
            View all articles
          </Link>
        </div>

        <section className="mt-10">
          <h2 className="mb-4 text-2xl font-semibold text-white">Published Articles</h2>
          <div className="grid gap-4">
            {posts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="rounded-lg border border-slate-800 bg-slate-900/50 p-5 hover:border-[#26AAE3]/50">
                <p className="text-xl font-semibold text-white">{post.title}</p>
                <p className="mt-1 text-sm text-slate-400">{post.date} • {post.category}</p>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
