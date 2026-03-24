import type { Metadata } from 'next'
import Link from 'next/link'
import { REQUEST_DEMO_URL, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Enterprise Agent Governance Platform',
  description:
    'Implement enterprise AI agent governance with risk boundaries, approval controls, audit trails, and policy-driven execution across critical operations.',
  alternates: {
    canonical: '/solutions/enterprise-agent-governance',
  },
  openGraph: {
    title: 'Enterprise Agent Governance Platform | QorSync AI',
    description:
      'Implement enterprise AI agent governance with risk boundaries, approval controls, audit trails, and policy-driven execution across critical operations.',
    url: `${SITE_URL}/solutions/enterprise-agent-governance`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Enterprise Agent Governance Platform | QorSync AI',
    description:
      'Implement enterprise AI agent governance with risk boundaries, approval controls, audit trails, and policy-driven execution across critical operations.',
  },
}

export default function EnterpriseAgentGovernancePage() {
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
            <Link href="/solutions" className="text-slate-300 transition hover:text-white">
              Solutions
            </Link>
            <Link href="/blog" className="text-slate-300 transition hover:text-white">
              Blog
            </Link>
            <a href={REQUEST_DEMO_URL} className="rounded-lg bg-[#093E8F] px-4 py-2 font-medium text-white transition hover:bg-[#0A3F8F]">
              Request Demo
            </a>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm uppercase tracking-[0.18em] text-[#26AAE3]">Solution</p>
        <h1 className="mt-3 text-5xl font-bold text-white">Enterprise Agent Governance Platform</h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-300">
          Agent adoption stalls when governance is treated as a compliance checklist instead of an operational control system. QorSync AI helps
          enterprises define what agents can do, when humans must approve, and how decisions are logged, reviewed, and improved over time.
        </p>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-2xl font-bold text-white">Governance Framework Components</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div>
              <h3 className="text-xl font-semibold text-white">Risk Tiering</h3>
              <p className="mt-3 text-slate-300">
                Classify agent actions by operational and regulatory risk. Low-risk actions can run autonomously, while medium and high-risk actions
                route through explicit approval paths.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Policy Enforcement</h3>
              <p className="mt-3 text-slate-300">
                Use policy-as-code controls to enforce business rules, data access constraints, and role-based execution boundaries before any action
                is committed.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Audit and Lineage</h3>
              <p className="mt-3 text-slate-300">
                Capture full decision lineage including context used, policy checks evaluated, approval chain, and final state mutation for every
                action.
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">Operational Controls</h3>
              <p className="mt-3 text-slate-300">
                Apply kill switches, rollback workflows, escalation policies, and exception analytics to keep autonomous operations safe under load.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold text-white">What Mature Governance Looks Like</h2>
          <ul className="mt-5 space-y-3 text-slate-300">
            <li>• Every agent action maps to an owner, risk tier, and policy contract.</li>
            <li>• Approval boundaries are enforced in the workflow runtime, not just documented in policy docs.</li>
            <li>• Governance metrics are reviewed weekly: override rates, SLA breaches, policy violations, and rollback incidents.</li>
            <li>• Model confidence is treated as one signal, not a governance substitute.</li>
            <li>• Deployment and governance changes follow controlled release management.</li>
          </ul>
        </section>

        <section className="mt-12 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-8">
          <h2 className="text-2xl font-bold text-white">90-Day Rollout Sequence</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-slate-300">
            <li>Establish agent inventory and classify all actions by risk and business impact.</li>
            <li>Deploy approval and policy gates on one high-value workflow domain.</li>
            <li>Instrument audit and operational KPIs, then run exception drills.</li>
            <li>Expand governance coverage to adjacent workflows with controlled autonomy ramps.</li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Related Governance Resources</h2>
          <ul className="mt-4 space-y-3 text-cyan-300">
            <li>
              <Link href="/blog/enterprise-agent-governance-checklist" className="hover:text-cyan-200">
                Enterprise AI Agent Governance Checklist
              </Link>
            </li>
            <li>
              <Link href="/blog/hitl-governance-design-patterns" className="hover:text-cyan-200">
                Human-in-the-Loop Governance Design Patterns
              </Link>
            </li>
            <li>
              <Link href="/tools/agent-governance-risk-matrix" className="hover:text-cyan-200">
                Agent Governance Risk Matrix Tool
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Build trustworthy autonomous operations</h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-300">
            We help teams stand up governance architecture that enables autonomy without sacrificing control, accountability, or compliance posture.
          </p>
          <a
            href={REQUEST_DEMO_URL}
            className="mt-8 inline-flex items-center rounded-lg bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white transition hover:from-[#0A3F8F] hover:to-[#1C74BC]"
          >
            Request Demo
          </a>
        </section>
      </main>
    </div>
  )
}
