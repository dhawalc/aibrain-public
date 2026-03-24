import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Page Not Found',
  robots: {
    index: false,
    follow: false,
  },
}

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 px-6 py-20">
      <main className="mx-auto max-w-2xl rounded-2xl border border-slate-800 bg-slate-900/70 p-10 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-[#26AAE3]">404</p>
        <h1 className="mt-4 text-4xl font-bold text-white">Page not found</h1>
        <p className="mt-4 text-slate-300">The page you requested does not exist or was moved.</p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/" className="rounded-lg bg-[#093E8F] px-5 py-2.5 font-medium text-white transition hover:bg-[#0A3F8F]">
            Go home
          </Link>
          <Link href="/blog" className="rounded-lg border border-slate-700 px-5 py-2.5 font-medium text-slate-200 transition hover:bg-slate-800">
            Browse blog
          </Link>
        </div>
      </main>
    </div>
  )
}
