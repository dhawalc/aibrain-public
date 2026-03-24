import type { Metadata } from 'next'
import Link from 'next/link'
import { REQUEST_DEMO_URL, SITE_URL } from '@/lib/site'

const SOLUTIONS = [
  {
    slug: 'ai-approval-workflow-software',
    title: 'AI Approval Workflow Software',
    description:
      'Risk-tiered approval routing for enterprise AI actions with SLA controls, escalation policies, and full audit trails.',
    bullets: ['Approval queues by risk tier', 'SLA and escalation automation', 'Audit-ready decision history'],
  },
  {
    slug: 'enterprise-agent-governance',
    title: 'Enterprise Agent Governance',
    description:
      'Policy and control architecture for autonomous agents across ERP, CRM, ITSM, and finance-critical workflows.',
    bullets: ['Role-based control boundaries', 'Human-in-the-loop enforcement', 'Change management + rollback'],
  },
  {
    slug: 'erp-crm-automation',
    title: 'ERP and CRM Workflow Automation',
    description:
      'Cross-system automation with governed AI agents for SAP, Oracle, NetSuite, Salesforce, and ServiceNow operations.',
    bullets: ['Cross-system execution orchestration', 'Exception-aware automation', 'Operational telemetry + analytics'],
  },
]

export const metadata: Metadata = {
  title: 'Enterprise AI Automation Solutions',
  description:
    'Explore QorSync AI solutions for approval workflows, agent governance, and enterprise ERP/CRM automation with risk-tiered controls.',
  alternates: {
    canonical: '/solutions',
  },
  openGraph: {
    title: 'Enterprise AI Automation Solutions | QorSync AI',
    description:
      'Explore QorSync AI solutions for approval workflows, agent governance, and enterprise ERP/CRM automation with risk-tiered controls.',
    url: `${SITE_URL}/solutions`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise AI Automation Solutions | QorSync AI',
    description:
      'Explore QorSync AI solutions for approval workflows, agent governance, and enterprise ERP/CRM automation with risk-tiered controls.',
  },
}

export default function SolutionsPage() {
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
            <Link href="/blog" className="text-slate-300 transition hover:text-white">
              Blog
            </Link>
            <Link href="/tools" className="text-slate-300 transition hover:text-white">
              Tools
            </Link>
            <a href={REQUEST_DEMO_URL} className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </a>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-18 text-center">
        <p className="text-sm uppercase tracking-[0.18em] text-[#26AAE3]">Solutions</p>
        <h1 className="mt-3 text-5xl font-bold text-white">Enterprise AI Automation Solutions</h1>
        <p className="mx-auto mt-5 max-w-3xl text-lg text-slate-300">
          QorSync AI helps operations teams automate enterprise workflows with governed agents, approval checkpoints, and policy-aware execution.
          Use these solution pages to evaluate fit by operational problem, governance needs, and systems landscape.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-18">
        <div className="grid gap-6 md:grid-cols-3">
          {SOLUTIONS.map((solution) => (
            <Link
              key={solution.slug}
              href={`/solutions/${solution.slug}`}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-500/50 hover:bg-slate-900"
            >
              <h2 className="text-2xl font-bold text-white">{solution.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">{solution.description}</p>
              <ul className="mt-5 space-y-2">
                {solution.bullets.map((bullet) => (
                  <li key={bullet} className="text-sm text-slate-400">
                    • {bullet}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm font-semibold text-cyan-300">Explore solution</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-900/50 py-14">
        <div className="mx-auto max-w-5xl px-6 text-center">
          <h2 className="text-3xl font-bold text-white">Need a workflow-specific rollout plan?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-300">
            We map your current operations stack, define risk tiers, and launch governed automations with measurable SLA and throughput improvements.
          </p>
          <a
            href={REQUEST_DEMO_URL}
            className="mt-8 inline-flex items-center rounded-lg bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white transition hover:from-[#0A3F8F] hover:to-[#1C74BC]"
          >
            Request Demo
          </a>
        </div>
      </section>
    </div>
  )
}
