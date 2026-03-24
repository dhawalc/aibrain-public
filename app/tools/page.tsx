import type { Metadata } from 'next'
import Link from 'next/link'
import DemoCta from '@/components/demo-cta'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Enterprise AI Tools',
  description: 'Free tools to size the business case for AI-powered workflow automation, assess readiness, and design governance controls.',
  alternates: {
    canonical: '/tools',
  },
  openGraph: {
    title: 'Enterprise AI Tools | QorSync AI',
    description: 'Free tools to size the business case for AI-powered workflow automation, assess readiness, and design governance controls.',
    url: `${SITE_URL}/tools`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise AI Tools | QorSync AI',
    description: 'Free tools to size the business case for AI-powered workflow automation, assess readiness, and design governance controls.',
  },
}

const tools = [
  {
    href: '/tools/approval-workflow-roi-calculator',
    category: 'ROI Calculator',
    title: 'Approval Workflow ROI Calculator',
    description: 'Estimate hours saved, labor impact, and cycle-time improvement from governed approval automation.',
  },
  {
    href: '/tools/agent-governance-risk-matrix',
    category: 'Risk Assessment',
    title: 'AI Agent Governance Risk Matrix',
    description: 'Classify AI agent actions into risk tiers and get recommended approval patterns, audit requirements, and governance controls.',
  },
  {
    href: '/tools/automation-readiness-assessment',
    category: 'Assessment',
    title: 'Workflow Automation Readiness Assessment',
    description: 'Evaluate your team readiness for AI-powered workflow automation across process maturity, data quality, and organizational governance.',
  },
]

export default function ToolsPage() {
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
            <DemoCta source="tools_header" className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </DemoCta>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-20">
        <p className="text-sm uppercase tracking-[0.2em] text-[#26AAE3]">Interactive Tools</p>
        <h1 className="mt-4 text-5xl font-bold text-white">Enterprise AI Tools</h1>
        <p className="mt-4 max-w-3xl text-xl leading-relaxed text-slate-300">
          Free tools to size the business case for AI-powered workflow automation, assess readiness, and design governance controls.
        </p>

        <div className="mt-12 grid gap-6">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-8 transition hover:border-cyan-500/50 hover:bg-slate-900"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#26AAE3]">{tool.category}</p>
              <h2 className="mt-3 text-3xl font-bold text-white transition group-hover:text-cyan-300">{tool.title}</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-slate-400">{tool.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#26AAE3]">
                Open tool
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
