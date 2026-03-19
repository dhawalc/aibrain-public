import type { Metadata } from 'next'
import Link from 'next/link'
import ApprovalWorkflowRoiCalculator from '@/components/approval-workflow-roi-calculator'
import DemoCta from '@/components/demo-cta'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Approval Workflow ROI Calculator | QorSync AI',
  description: 'Estimate the labor savings and cycle-time impact of governed approval automation.',
  alternates: {
    canonical: '/tools/approval-workflow-roi-calculator',
  },
  openGraph: {
    title: 'Approval Workflow ROI Calculator',
    description: 'Estimate the labor savings and cycle-time impact of governed approval automation.',
    url: `${SITE_URL}/tools/approval-workflow-roi-calculator`,
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Approval Workflow ROI Calculator',
    description: 'Estimate the labor savings and cycle-time impact of governed approval automation.',
    images: ['/og-image.svg'],
  },
}

export default function ApprovalWorkflowRoiCalculatorPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Approval Workflow ROI Calculator',
    description: 'Estimate the labor savings and cycle-time impact of governed approval automation.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: `${SITE_URL}/tools/approval-workflow-roi-calculator`,
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
            <Link href="/blog/ai-approval-workflow" className="text-slate-300 transition hover:text-white">
              Approval Guide
            </Link>
            <Link href="/tools" className="text-slate-300 transition hover:text-white">
              Tools
            </Link>
            <DemoCta source="approval_roi_header" className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </DemoCta>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 max-w-4xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#26AAE3]">Proof Asset</p>
          <h1 className="mt-4 text-5xl font-bold text-white">Approval Workflow ROI Calculator</h1>
          <p className="mt-4 max-w-3xl text-xl leading-relaxed text-slate-300">
            Most enterprise teams do not need a giant transformation model to decide whether approval automation is worth it. They need a fast way to size
            the opportunity using real approval volume, handling time, and escalation behavior.
          </p>
        </div>

        <ApprovalWorkflowRoiCalculator />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">What this tool is good for</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Early business-case sizing for finance, operations, IT, and shared services workflows with approval bottlenecks.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">What it does not replace</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Detailed process mapping, exception analysis, or the policy design needed for a production rollout.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">Best next read</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Pair this with the approval workflow guide to decide where auto-approval is safe and where human review should remain.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
