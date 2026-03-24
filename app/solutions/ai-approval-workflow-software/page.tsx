import type { Metadata } from 'next'
import Link from 'next/link'
import { REQUEST_DEMO_URL, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'AI Approval Workflow Software for Enterprise Operations',
  description:
    'Design and deploy risk-tiered AI approval workflows with escalation controls, SLA tracking, and full auditability across enterprise systems.',
  alternates: {
    canonical: '/solutions/ai-approval-workflow-software',
  },
  openGraph: {
    title: 'AI Approval Workflow Software for Enterprise Operations | QorSync AI',
    description:
      'Design and deploy risk-tiered AI approval workflows with escalation controls, SLA tracking, and full auditability across enterprise systems.',
    url: `${SITE_URL}/solutions/ai-approval-workflow-software`,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AI Approval Workflow Software for Enterprise Operations | QorSync AI',
    description:
      'Design and deploy risk-tiered AI approval workflows with escalation controls, SLA tracking, and full auditability across enterprise systems.',
  },
}

export default function ApprovalWorkflowSolutionPage() {
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
        <h1 className="mt-3 text-5xl font-bold text-white">AI Approval Workflow Software for Enterprise Operations</h1>
        <p className="mt-6 text-lg leading-relaxed text-slate-300">
          Most enterprises do not fail automation because of model quality. They fail because approval logic is inconsistent, escalation paths are
          unclear, and high-risk actions are handled with the same workflow as low-risk tasks. QorSync AI provides a structured approval control
          layer where risk-scored actions route to the right approver with policy context, timing constraints, and full decision lineage.
        </p>

        <section className="mt-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <h2 className="text-2xl font-bold text-white">What This Solves</h2>
          <ul className="mt-5 space-y-3 text-slate-300">
            <li>• Eliminates generic approval queues that mix low-risk and high-risk actions.</li>
            <li>• Enforces role-based approval boundaries for finance, customer, and security-sensitive workflows.</li>
            <li>• Captures complete audit history: policy evaluated, approver selected, decision timestamp, and outcome.</li>
            <li>• Reduces SLA breaches by automating routing, reminders, and escalation rules.</li>
          </ul>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold text-white">Core Workflow Architecture</h2>
          <div className="mt-6 grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-xl font-semibold text-white">1. Risk Classification</h3>
              <p className="mt-3 text-slate-300">
                Every action is evaluated against explicit risk policies. The system separates routine operational updates from decisions that can
                materially impact revenue, compliance, customer trust, or system integrity.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-xl font-semibold text-white">2. Intelligent Routing</h3>
              <p className="mt-3 text-slate-300">
                Approvals route by function, ownership, and urgency. Multi-step approvals are supported for high-risk paths, with fallback chains if
                primary approvers are unavailable.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-xl font-semibold text-white">3. SLA and Escalation</h3>
              <p className="mt-3 text-slate-300">
                Time-bound approval SLAs are tracked in real time. Automatic escalation prevents stalled decisions from blocking critical operations.
              </p>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/50 p-6">
              <h3 className="text-xl font-semibold text-white">4. Continuous Governance</h3>
              <p className="mt-3 text-slate-300">
                Every workflow emits audit-grade logs and performance signals. Teams can tune policies using throughput, exception, and override data.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-12 rounded-2xl border border-cyan-500/25 bg-cyan-500/5 p-8">
          <h2 className="text-2xl font-bold text-white">Implementation Checklist</h2>
          <ol className="mt-4 list-decimal space-y-3 pl-6 text-slate-300">
            <li>Define risk-tier taxonomy for all automation actions.</li>
            <li>Map approver ownership by domain and business unit.</li>
            <li>Set SLA thresholds and escalation paths per risk tier.</li>
            <li>Configure audit schema and retention policy.</li>
            <li>Deploy in one workflow domain, then expand with policy iterations.</li>
          </ol>
        </section>

        <section className="mt-12">
          <h2 className="text-2xl font-bold text-white">Related Resources</h2>
          <ul className="mt-4 space-y-3 text-cyan-300">
            <li>
              <Link href="/blog/ai-approval-workflow" className="hover:text-cyan-200">
                AI Approval Workflow Design Template
              </Link>
            </li>
            <li>
              <Link href="/blog/ai-agent-risk-tiering-framework" className="hover:text-cyan-200">
                AI Agent Risk Tiering Framework
              </Link>
            </li>
            <li>
              <Link href="/tools/approval-workflow-roi-calculator" className="hover:text-cyan-200">
                Approval Workflow ROI Calculator
              </Link>
            </li>
          </ul>
        </section>

        <section className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/60 p-8 text-center">
          <h2 className="text-3xl font-bold text-white">Ready to operationalize governed AI approvals?</h2>
          <p className="mx-auto mt-4 max-w-3xl text-slate-300">
            We can map your current approval pipeline and launch a production-grade AI approval workflow architecture with measurable cycle-time and
            exception-rate improvements.
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
