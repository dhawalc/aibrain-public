import type { Metadata } from 'next'
import Link from 'next/link'
import AgentGovernanceRiskMatrix from '@/components/agent-governance-risk-matrix'
import DemoCta from '@/components/demo-cta'
import { SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'AI Agent Governance Risk Matrix | QorSync AI',
  description: 'Classify AI agent actions into risk tiers and get recommended approval patterns, audit requirements, and governance controls.',
  alternates: {
    canonical: '/tools/agent-governance-risk-matrix',
  },
  openGraph: {
    title: 'AI Agent Governance Risk Matrix',
    description: 'Classify AI agent actions into risk tiers and get recommended approval patterns, audit requirements, and governance controls.',
    url: `${SITE_URL}/tools/agent-governance-risk-matrix`,
    images: ['/og-image.svg'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Agent Governance Risk Matrix',
    description: 'Classify AI agent actions into risk tiers and get recommended approval patterns, audit requirements, and governance controls.',
    images: ['/og-image.svg'],
  },
}

export default function AgentGovernanceRiskMatrixPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'AI Agent Governance Risk Matrix',
    description: 'Classify AI agent actions into risk tiers and get recommended approval patterns, audit requirements, and governance controls.',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Any',
    url: `${SITE_URL}/tools/agent-governance-risk-matrix`,
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
            <Link href="/blog/ai-agent-risk-tiering-framework" className="text-slate-300 transition hover:text-white">
              Risk Framework
            </Link>
            <Link href="/tools" className="text-slate-300 transition hover:text-white">
              Tools
            </Link>
            <DemoCta source="governance_risk_header" className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </DemoCta>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-12 max-w-4xl">
          <p className="text-sm uppercase tracking-[0.2em] text-[#26AAE3]">Proof Asset</p>
          <h1 className="mt-4 text-5xl font-bold text-white">AI Agent Governance Risk Matrix</h1>
          <p className="mt-4 max-w-3xl text-xl leading-relaxed text-slate-300">
            Before deploying an AI agent in production, you need to classify its actions by risk level. This tool maps workflow attributes to a risk tier and
            recommends the approval pattern, audit depth, and specific controls your governance framework should enforce.
          </p>
        </div>

        <AgentGovernanceRiskMatrix />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">What this tool is good for</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Quick risk classification when scoping a new agent workflow. Use it to align engineering, compliance, and operations on the right governance posture before building.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">What it does not replace</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              A formal risk assessment, threat model, or compliance audit. This tool sizes the governance requirement; your security and legal teams validate it.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">
            <h2 className="text-lg font-bold text-white">Best next read</h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-400">
              Pair this with the{' '}
              <Link href="/blog/ai-agent-risk-tiering-framework" className="text-[#26AAE3] underline hover:text-white">
                risk tiering framework
              </Link>{' '}
              for the methodology, and the{' '}
              <Link href="/blog/hitl-governance-design-patterns" className="text-[#26AAE3] underline hover:text-white">
                HITL governance patterns
              </Link>{' '}
              for implementation details.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
