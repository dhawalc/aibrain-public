import type { Metadata } from 'next'
import Link from 'next/link'
import EmailCapture from '@/components/email-capture'
import { AUTHOR_NAME, AUTHOR_PATH, AUTHOR_TITLE } from '@/lib/brand'
import { getAllArticles } from '@/lib/blog'
import { REQUEST_DEMO_URL, SITE_URL } from '@/lib/site'

export const metadata: Metadata = {
  title: 'Enterprise AI Workflow Automation Software',
  description:
    'QorSync AI is enterprise AI workflow automation software for governed agent execution across ERP, CRM, and ITSM systems with risk-tiered approvals.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'QorSync AI | Enterprise AI Workflow Automation Software',
    description: 'Governed AI workflow automation across ERP, CRM, ITSM, and enterprise operations.',
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'QorSync AI | Enterprise AI Workflow Automation Software',
    description: 'Governed AI workflow automation across ERP, CRM, ITSM, and enterprise operations.',
  },
}

export default async function HomePage() {
  const latestPosts = (await getAllArticles()).slice(0, 6)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#093E8F] to-[#1C74BC] font-bold text-white">
              Q
            </div>
            <div>
              <span className="text-xl font-bold text-white">QorSync AI</span>
              <p className="text-[10px] uppercase tracking-widest text-slate-400">An Accel4 Product</p>
            </div>
          </div>
          <nav className="hidden items-center gap-8 md:flex">
            <Link href="/solutions" className="text-slate-300 transition hover:text-white">
              Solutions
            </Link>
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

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:py-32">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#26AAE3]/30 bg-[#26AAE3]/10 px-3 py-1 text-sm font-medium text-[#26AAE3]">
            <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-400" />
            Autonomous Enterprise Control Plane
          </div>

          <h1 className="mb-6 text-5xl font-bold leading-tight text-white md:text-6xl">
            Let AI Agents Run
            <span className="bg-gradient-to-r from-[#26AAE3] to-[#093E8F] bg-clip-text text-transparent"> 95% of Enterprise Operations</span>
          </h1>

          <p className="mb-8 text-xl leading-relaxed text-slate-300">
            QorSync AI discovers systems, maps workflows, executes governed actions, and keeps humans in control for high-risk decisions.
            One platform across SAP, Oracle, NetSuite, Salesforce, ServiceNow, custom APIs, and internal tools.
          </p>

          <div className="mb-12 flex flex-col gap-4 sm:flex-row">
            <a
              href={REQUEST_DEMO_URL}
              className="inline-flex items-center justify-center rounded-lg bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white shadow-lg shadow-[#1C74BC]/30 transition hover:from-[#0A3F8F] hover:to-[#1C74BC]"
            >
              Request Demo
            </a>
            <Link
              href="/solutions"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-800 px-6 py-3 font-semibold text-white transition hover:bg-slate-700"
            >
              Explore Solutions
            </Link>
          </div>

          <div className="flex items-center gap-6 text-sm text-slate-400">
            <div>
              <div className="text-2xl font-bold text-white">Multi-System</div>
              <div>ERP, CRM, ITSM, Data</div>
            </div>
            <div className="h-12 w-px bg-slate-700" />
            <div>
              <div className="text-2xl font-bold text-white">Risk-Gated</div>
              <div>Human approval workflow</div>
            </div>
            <div className="h-12 w-px bg-slate-700" />
            <div>
              <div className="text-2xl font-bold text-white">Enterprise-Ready</div>
              <div>Audit, policy, observability</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl" />
          <div className="relative rounded-2xl border border-slate-800 bg-slate-900/50 p-8 shadow-2xl backdrop-blur-sm">
            <div className="space-y-4">
              <div className="flex items-center gap-3 rounded-lg bg-slate-800/50 p-4">
                <div className="h-3 w-3 animate-pulse rounded-full bg-green-400" />
                <div className="flex-1">
                  <div className="font-medium text-white">Agent Orchestration Active</div>
                  <div className="text-sm text-slate-400">Discovery + execution + monitoring</div>
                </div>
                <div className="text-sm font-mono text-[#26AAE3]">LIVE</div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                  <div className="mb-1 text-xs text-slate-400">Connected Systems</div>
                  <div className="text-2xl font-bold text-white">27</div>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                  <div className="mb-1 text-xs text-slate-400">Active Agents</div>
                  <div className="text-2xl font-bold text-white">42</div>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                  <div className="mb-1 text-xs text-slate-400">Automated Tasks</div>
                  <div className="text-2xl font-bold text-white">95%</div>
                </div>
                <div className="rounded-lg border border-slate-700 bg-slate-800/30 p-4">
                  <div className="mb-1 text-xs text-slate-400">Approval SLA</div>
                  <div className="text-2xl font-bold text-white">&lt;5m</div>
                </div>
              </div>

              <div className="rounded-lg border border-[#26AAE3]/30 bg-[#26AAE3]/10 p-4">
                <div className="mb-2 text-xs text-[#26AAE3]">Execution Queue Health</div>
                <div className="h-2 overflow-hidden rounded-full bg-slate-800">
                  <div className="h-full w-5/6 animate-pulse rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                </div>
                <div className="mt-2 text-xs text-slate-400">Critical actions routed to approval gates automatically</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="max-w-3xl">
            <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Why Legacy Automation Breaks</h2>
            <div className="space-y-4 text-lg text-slate-300">
              <p>
                Rule-only RPA and disconnected copilots fail in dynamic enterprise environments with cross-system dependencies and constant policy changes.
              </p>
              <p>
                Teams end up with brittle workflows, manual escalations, and no unified operational truth across business and IT.
              </p>
              <p className="font-medium text-white">QorSync AI closes that gap with autonomous agents plus explicit human governance.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">From Discovery to Governed Execution</h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-300">One operational loop: map reality, run actions, learn continuously.</p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white">1</div>
            <h3 className="mb-3 text-xl font-bold text-white">Discover</h3>
            <p className="text-slate-300">Agents inventory systems, APIs, process objects, and data flows across your stack.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white">2</div>
            <h3 className="mb-3 text-xl font-bold text-white">Decide</h3>
            <p className="text-slate-300">Policy engine applies risk tiers and routes high-impact steps to humans for approval.</p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-xl font-bold text-white">3</div>
            <h3 className="mb-3 text-xl font-bold text-white">Execute</h3>
            <p className="text-slate-300">Autonomous agents execute, monitor outcomes, and continuously improve with feedback loops.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-slate-800 bg-slate-900/40 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#26AAE3]">Enterprise Solutions</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Start with your highest-impact workflow</h2>
            </div>
            <Link href="/solutions" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
              View all solutions
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <Link
              href="/solutions/ai-approval-workflow-software"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-500/50"
            >
              <h3 className="text-xl font-bold text-white">AI Approval Workflow Software</h3>
              <p className="mt-3 text-sm text-slate-300">
                Build risk-tiered approvals with SLA routing, escalation logic, and complete decision audit trails.
              </p>
            </Link>
            <Link
              href="/solutions/enterprise-agent-governance"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-500/50"
            >
              <h3 className="text-xl font-bold text-white">Enterprise Agent Governance</h3>
              <p className="mt-3 text-sm text-slate-300">
                Define policy boundaries, human checkpoints, and operational controls for autonomous enterprise agents.
              </p>
            </Link>
            <Link
              href="/solutions/erp-crm-automation"
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-500/50"
            >
              <h3 className="text-xl font-bold text-white">ERP and CRM Automation</h3>
              <p className="mt-3 text-sm text-slate-300">
                Orchestrate governed actions across SAP, Oracle, NetSuite, Salesforce, and ServiceNow workflows.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm uppercase tracking-[0.18em] text-[#26AAE3]">Featured Guides</p>
          <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">Top Resources for Enterprise AI Teams</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[
            { href: '/blog/ai-approval-workflow', title: 'AI Approval Workflow Design', desc: 'Build risk-tiered approvals with SLA routing, escalation logic, and governance controls.' },
            { href: '/blog/hitl-governance-design-patterns', title: 'HITL Governance Design Patterns', desc: 'Scale autonomous agents safely with human-in-the-loop governance patterns.' },
            { href: '/blog/enterprise-agent-governance-checklist', title: 'Agent Governance Checklist', desc: 'Define controls, ownership, and human checkpoints for enterprise AI agent deployments.' },
            { href: '/blog/ai-agent-risk-tiering-framework', title: 'AI Agent Risk Tiering Framework', desc: 'Design risk-tiered autonomy with approval gates and rollback controls.' },
            { href: '/blog/enterprise-task-routing-with-ai-agents', title: 'Enterprise Task Routing', desc: 'Architect AI agent routing with queue policies, escalation paths, and reliability controls.' },
          ].map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group rounded-xl border border-slate-800 bg-slate-900/60 p-5 transition hover:border-cyan-500/50"
            >
              <h3 className="font-bold text-white group-hover:text-cyan-300">{guide.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{guide.desc}</p>
              <span className="mt-3 inline-flex text-xs font-semibold text-cyan-300">Read guide</span>
            </Link>
          ))}
        </div>
      </section>

      {latestPosts.length > 0 ? (
        <section className="mx-auto max-w-7xl px-6 pb-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm uppercase tracking-[0.18em] text-[#26AAE3]">Latest Insights</p>
              <h2 className="mt-3 text-3xl font-bold text-white md:text-4xl">New Playbooks from the Blog</h2>
            </div>
            <Link href="/blog" className="text-sm font-semibold text-cyan-300 hover:text-cyan-200">
              View all articles
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {latestPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group rounded-2xl border border-slate-800 bg-slate-900/60 p-6 transition hover:border-cyan-500/50 hover:bg-slate-900"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#26AAE3]">{post.category}</p>
                <h3 className="mt-3 line-clamp-2 text-xl font-bold text-white transition group-hover:text-cyan-300">{post.title}</h3>
                <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-400">{post.excerpt}</p>
                <div className="mt-5 flex items-center justify-between">
                  <time className="text-xs text-slate-500">
                    {new Date(post.date).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </time>
                  <span className="text-sm font-semibold text-cyan-300 transition group-hover:translate-x-1">Read article</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ) : null}

      <section className="border-y border-slate-800 bg-slate-900/50 py-20">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-white md:text-4xl">Built for Real Enterprise Constraints</h2>
              <ul className="space-y-4">
                {[
                  { title: 'System Agnostic', desc: 'Works across ERP, CRM, ITSM, data platforms, and custom APIs' },
                  { title: 'Risk-Tiered Approvals', desc: 'Low-risk tasks auto-run; high-risk actions require human checkpoints' },
                  { title: 'Audit-First Design', desc: 'Every action is traceable with policy context and operator lineage' },
                  { title: 'Graph + Vector + Rules', desc: 'Hybrid intelligence for retrieval, reasoning, and safe execution' },
                  { title: 'Human Feedback Loop', desc: 'Analyst feedback continuously tunes agent behavior' },
                ].map((feature) => (
                  <li key={feature.title} className="flex gap-4">
                    <svg className="mt-1 h-6 w-6 flex-shrink-0 text-[#26AAE3]" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <div>
                      <div className="font-semibold text-white">{feature.title}</div>
                      <div className="text-sm text-slate-400">{feature.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <div className="mb-2 text-sm text-slate-400">Legacy Ops Model</div>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-bold text-red-400">Manual-heavy</div>
                    <div className="mb-1 text-slate-400">slow + brittle</div>
                  </div>
                </div>

                <div className="h-px bg-slate-700" />

                <div>
                  <div className="mb-2 text-sm text-slate-400">QorSync AI Model</div>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-bold text-[#26AAE3]">Agent-led</div>
                    <div className="mb-1 text-slate-400">with governance</div>
                  </div>
                </div>

                <div className="rounded-lg border border-[#26AAE3]/30 bg-[#26AAE3]/10 p-4">
                  <div className="mb-1 font-semibold text-[#26AAE3]">Outcome</div>
                  <div className="text-sm text-slate-300">Faster execution, fewer escalations, and consistent policy compliance.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <p className="text-sm uppercase tracking-widest text-[#26AAE3]">From {AUTHOR_NAME}</p>
          <p className="mt-2 text-lg text-slate-300">
            &quot;Our focus is simple: let agents handle repetitive operational work, keep humans in control for critical decisions,
            and deliver measurable outcomes across the enterprise stack.&quot;
          </p>
          <p className="mt-3 text-sm text-slate-400">{AUTHOR_TITLE}</p>
          <Link href={AUTHOR_PATH} className="mt-4 inline-flex text-[#26AAE3] hover:text-cyan-300">
            Read articles by {AUTHOR_NAME}
          </Link>
        </div>

        <div className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-8">
          <EmailCapture
            source="homepage_newsletter"
            heading="Stay ahead of enterprise AI operations"
            description="Weekly insights on agentic automation, workflow governance, and cross-system execution. Practical frameworks, not product pitches."
          />
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-cyan-600 to-blue-700 p-12 text-center shadow-2xl shadow-[#1C74BC]/30">
          <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">Run the Autonomous Enterprise with QorSync AI</h2>
          <p className="mx-auto mb-8 max-w-2xl text-xl text-cyan-100">Deploy agents fast, enforce governance, and keep humans in control where it matters most.</p>
          <a href={REQUEST_DEMO_URL} className="inline-flex items-center rounded-lg bg-white px-8 py-4 text-lg font-bold text-cyan-700 shadow-xl transition hover:bg-slate-100">
            Request Demo
          </a>
        </div>
      </section>
    </div>
  )
}
