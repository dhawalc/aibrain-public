import type { Metadata } from 'next'
import Link from 'next/link'
import { REQUEST_DEMO_URL, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'ERP and CRM Automation with AI Agents',
  description:
    'Automate ERP and CRM workflows with governed AI agents across SAP, Oracle, NetSuite, Salesforce, and ServiceNow with audit-ready controls.',
  alternates: {
    canonical: '/solutions/erp-crm-automation',
  },
  openGraph: {
    title: 'ERP and CRM Automation with AI Agents | QorSync AI',
    description:
      'Automate ERP and CRM workflows with governed AI agents across SAP, Oracle, NetSuite, Salesforce, and ServiceNow with audit-ready controls.',
    url: `${SITE_URL}/solutions/erp-crm-automation`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ERP and CRM Automation with AI Agents | QorSync AI',
    description:
      'Automate ERP and CRM workflows with governed AI agents across SAP, Oracle, NetSuite, Salesforce, and ServiceNow with audit-ready controls.',
  },
}

export default function ErpCrmAutomationPage() {
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
        <h1 className="mt-3 text-5xl font-bold text-white">ERP and CRM Automation with AI Agents</h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-300">
          Enterprise teams lose velocity at handoffs between ERP, CRM, ITSM, and internal systems. QorSync AI coordinates governed agent execution
          across these systems so tasks move end-to-end without brittle scripts, manual copy-paste, or untracked exceptions.
        </p>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-2xl font-bold text-white">Common Automation Gaps We Address</h2>
          <ul className="mt-5 space-y-3 text-slate-300">
            <li>• Sales-to-finance handoffs between CRM opportunities and ERP billing workflows.</li>
            <li>• Service-to-revenue exception handling when support events require finance or operations updates.</li>
            <li>• Approval-dependent workflow transitions with no consistent ownership or escalation policy.</li>
            <li>• Disconnected telemetry across systems, making SLA and root-cause analysis difficult.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold text-white">Cross-System Automation Pattern</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-xl font-semibold text-white">Discovery and Mapping</h3>
              <p className="mt-3 text-slate-300">
                Agents discover system objects, API contracts, ownership metadata, and workflow dependencies across your enterprise stack.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-xl font-semibold text-white">Execution Orchestration</h3>
              <p className="mt-3 text-slate-300">
                Tasks are sequenced across systems with policy checks, retries, fallback paths, and exception-aware routing.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-xl font-semibold text-white">Risk and Approval Control</h3>
              <p className="mt-3 text-slate-300">
                High-impact actions trigger approval workflows, while low-risk updates remain autonomous for speed.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-xl font-semibold text-white">Operational Analytics</h3>
              <p className="mt-3 text-slate-300">
                Unified telemetry tracks cycle time, exception rate, and manual intervention load by workflow and system boundary.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-8">
          <h2 className="text-2xl font-bold text-white">Deployment Sequence</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-slate-300">
            <li>Start with one cross-system workflow where manual queue time is highest.</li>
            <li>Define risk tiers and approval boundaries for every action in that workflow.</li>
            <li>Deploy governed automation and compare SLA, error rate, and throughput against baseline.</li>
            <li>Scale to adjacent workflows using shared policy and observability patterns.</li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Related Resources</h2>
          <ul className="mt-4 space-y-3 text-cyan-300">
            <li>
              <Link href="/blog/erp-crm-integration-automation" className="hover:text-cyan-200">
                ERP CRM Integration Automation Playbook
              </Link>
            </li>
            <li>
              <Link href="/blog/enterprise-task-routing-with-ai-agents" className="hover:text-cyan-200">
                Enterprise Task Routing with AI Agents
              </Link>
            </li>
            <li>
              <Link href="/tools/automation-readiness-assessment" className="hover:text-cyan-200">
                Automation Readiness Assessment Tool
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Turn system handoffs into autonomous flow</h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-300">
            We help teams deploy cross-system automations that reduce manual queue time while preserving governance and change control.
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
