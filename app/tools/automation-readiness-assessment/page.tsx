import type { Metadata } from 'next'
import Link from 'next/link'
import AutomationReadinessAssessment from '@/components/automation-readiness-assessment'
import DemoCta from '@/components/demo-cta'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Workflow Automation Readiness Assessment',
  description:
    'Evaluate your team\'s readiness for AI-powered workflow automation across process maturity, data quality, and organizational governance.',
  alternates: {
    canonical: '/tools/automation-readiness-assessment',
  },
  openGraph: {
    title: 'Workflow Automation Readiness Assessment',
    description:
      'Evaluate your team\'s readiness for AI-powered workflow automation across process maturity, data quality, and organizational governance.',
    url: `${SITE_URL}/tools/automation-readiness-assessment`,
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Workflow Automation Readiness Assessment',
    description:
      'Evaluate your team\'s readiness for AI-powered workflow automation across process maturity, data quality, and organizational governance.',
    images: ['/og-image.svg'],
  },
}

export default function AutomationReadinessAssessmentPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Workflow Automation Readiness Assessment',
    description:
      'Evaluate your team\'s readiness for AI-powered workflow automation across process maturity, data quality, and organizational governance.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: `${SITE_URL}/tools/automation-readiness-assessment`,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Accel4',
    },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
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
            <Link href="/tools" className="text-slate-300 transition hover:text-white">
              Tools
            </Link>
            <DemoCta source="readiness_assessment_header" className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </DemoCta>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-[#26AAE3]">Assessment Tool</p>
          <h1 className="mt-4 text-5xl font-bold text-white">Workflow Automation Readiness Assessment</h1>
          <p className="mt-4 max-w-3xl text-xl leading-relaxed text-slate-300">
            Before investing in automation tooling, find out where your organization stands across the three pillars
            that determine success: process maturity, data and systems readiness, and organizational governance.
          </p>
        </div>

        <AutomationReadinessAssessment />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">What this tool measures</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Process documentation, system integration, data quality, executive sponsorship, and governance maturity
              across 12 dimensions.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">How to use the results</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Identify your weakest pillar first. Addressing foundation gaps before selecting automation targets avoids
              expensive rework later.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">Takes under 3 minutes</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Answer 12 questions across three categories. Get a scored breakdown with specific next steps tailored to
              your readiness tier.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
