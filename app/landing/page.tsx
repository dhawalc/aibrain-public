import Link from 'next/link'
import { REQUEST_DEMO_URL } from '@/lib/site'

export const metadata = {
  title: 'AI Brain - Autonomous SAP Discovery in Hours, Not Weeks',
  description: 'AI-powered enterprise architecture discovery. Map your entire SAP landscape automatically in 2-4 hours vs 8-12 weeks. Used by Fortune 500 CTOs.',
  openGraph: {
    title: 'AI Brain - Autonomous SAP Discovery',
    description: 'Transform weeks of manual SAP mapping into hours of autonomous AI discovery',
    images: ['/og-image.png'],
  }
}

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-950/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white">
              AI
            </div>
            <span className="text-xl font-bold text-white">AI Brain</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/blog" className="text-slate-300 hover:text-white transition">Blog</Link>
            <Link href="/blog" className="text-slate-300 hover:text-white transition">Docs</Link>
            <a href={REQUEST_DEMO_URL} className="px-4 py-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg text-white font-medium transition">
              Request Demo
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-full text-cyan-400 text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
              Autonomous SAP Discovery
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              Map Your Entire SAP Landscape in{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Hours, Not Weeks
              </span>
            </h1>
            
            <p className="text-xl text-slate-300 mb-8 leading-relaxed">
              AI Brain autonomously discovers, maps, and analyzes your SAP S/4HANA environment. 
              What takes consultants 8-12 weeks now completes in 2-4 hours.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <a href={REQUEST_DEMO_URL} className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg text-white font-semibold transition shadow-lg shadow-cyan-500/20">
                Request Demo
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              <Link href="/blog" className="inline-flex items-center justify-center px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-lg text-white font-semibold transition border border-slate-700">
                Read Case Studies
              </Link>
            </div>

            {/* Social Proof */}
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <div>
                <div className="text-2xl font-bold text-white">67,000+</div>
                <div>SAP Objects Discovered</div>
              </div>
              <div className="w-px h-12 bg-slate-700"></div>
              <div>
                <div className="text-2xl font-bold text-white">2-4 hrs</div>
                <div>Discovery Time</div>
              </div>
              <div className="w-px h-12 bg-slate-700"></div>
              <div>
                <div className="text-2xl font-bold text-white">Fortune 500</div>
                <div>Enterprise Ready</div>
              </div>
            </div>
          </div>

          {/* Demo Visualization */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 blur-3xl"></div>
            <div className="relative bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-4 bg-slate-800/50 rounded-lg">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <div className="flex-1">
                    <div className="text-white font-medium">Autonomous Discovery</div>
                    <div className="text-slate-400 text-sm">Connected to SAP S/4HANA</div>
                  </div>
                  <div className="text-cyan-400 text-sm font-mono">ACTIVE</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">Tables</div>
                    <div className="text-white text-2xl font-bold font-mono">24,563</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">Modules</div>
                    <div className="text-white text-2xl font-bold font-mono">156</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">APIs</div>
                    <div className="text-white text-2xl font-bold font-mono">892</div>
                  </div>
                  <div className="p-4 bg-slate-800/30 rounded-lg border border-slate-700">
                    <div className="text-slate-400 text-xs mb-1">Relations</div>
                    <div className="text-white text-2xl font-bold font-mono">12K+</div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <div className="text-cyan-400 text-xs mb-2">Discovery Progress</div>
                  <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full animate-pulse"></div>
                  </div>
                  <div className="text-slate-400 text-xs mt-2">Estimated: 2h 15m remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
              The Enterprise Architecture Discovery Problem
            </h2>
            <div className="space-y-4 text-lg text-slate-300">
              <p>
                <span className="text-red-400 font-semibold">Manual SAP mapping takes 8-12 weeks</span> and costs 
                $500K+ in consultant fees. By the time you finish, the landscape has already changed.
              </p>
              <p>
                CTOs spend months chasing down tribal knowledge, piecing together spreadsheets, and 
                conducting endless stakeholder interviews — only to discover critical integrations after go-live.
              </p>
              <p className="text-white font-medium">
                What if you could automate the entire discovery process and finish in a single afternoon?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Autonomous Discovery in 3 Simple Steps
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            AI Brain connects to your SAP environment and autonomously maps everything
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="relative p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4">
              1
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Connect</h3>
            <p className="text-slate-300">
              Secure read-only connection to your SAP S/4HANA system. No data leaves your environment.
            </p>
          </div>

          <div className="relative p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4">
              2
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Discover</h3>
            <p className="text-slate-300">
              AI Brain autonomously explores tables, modules, APIs, and relationships across your entire landscape.
            </p>
          </div>

          <div className="relative p-8 bg-slate-900/50 border border-slate-800 rounded-2xl">
            <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-xl font-bold mb-4">
              3
            </div>
            <h3 className="text-xl font-bold text-white mb-3">Visualize</h3>
            <p className="text-slate-300">
              Interactive dashboards, knowledge graphs, and API documentation generated automatically.
            </p>
          </div>
        </div>
      </section>

      {/* Proof/Features Section */}
      <section className="bg-slate-900/50 border-y border-slate-800 py-20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Production-Ready from Day One
              </h2>
              <ul className="space-y-4">
                {[
                  { title: '67,000+ SAP Objects', desc: 'Tables, modules, APIs, and relationships mapped' },
                  { title: '114 Specialized Views', desc: 'Pre-built dashboards for every SAP module' },
                  { title: 'Neo4j Knowledge Graph', desc: 'Interactive exploration of your entire landscape' },
                  { title: 'Real-Time Sync', desc: 'Stay current as your SAP environment evolves' },
                  { title: 'Enterprise Security', desc: 'SOC 2 compliant, read-only access, zero data export' },
                ].map((feature, i) => (
                  <li key={i} className="flex gap-4">
                    <svg className="w-6 h-6 text-cyan-400 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div>
                      <div className="text-white font-semibold">{feature.title}</div>
                      <div className="text-slate-400 text-sm">{feature.desc}</div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
              <div className="space-y-6">
                <div>
                  <div className="text-slate-400 text-sm mb-2">Traditional Consultants</div>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-bold text-red-400">8-12 weeks</div>
                    <div className="text-slate-400 mb-1">$500K+</div>
                  </div>
                </div>

                <div className="h-px bg-slate-700"></div>

                <div>
                  <div className="text-slate-400 text-sm mb-2">AI Brain</div>
                  <div className="flex items-end gap-3">
                    <div className="text-4xl font-bold text-cyan-400">2-4 hours</div>
                    <div className="text-slate-400 mb-1">Subscription</div>
                  </div>
                </div>

                <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
                  <div className="text-cyan-400 font-semibold mb-1">ROI Impact</div>
                  <div className="text-slate-300 text-sm">
                    Deploy faster, reduce migration risk, eliminate manual documentation
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="bg-gradient-to-br from-cyan-600 to-blue-700 rounded-3xl p-12 text-center shadow-2xl shadow-cyan-500/20">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your SAP Discovery?
          </h2>
          <p className="text-xl text-cyan-100 mb-8 max-w-2xl mx-auto">
            Join Fortune 500 CTOs using AI Brain to accelerate their digital transformation
          </p>
          <a href={REQUEST_DEMO_URL} className="inline-flex items-center px-8 py-4 bg-white hover:bg-slate-100 rounded-lg text-cyan-700 font-bold text-lg transition shadow-xl">
            Request Demo
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800 bg-slate-950 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white text-sm">
                  AI
                </div>
                <span className="text-white font-bold">AI Brain</span>
              </div>
              <p className="text-slate-400 text-sm">
                Autonomous SAP discovery powered by AI
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><Link href="/blog" className="hover:text-white transition">Blog</Link></li>
                <li><Link href="/blog" className="hover:text-white transition">Documentation</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">About</a></li>
                <li><a href="#" className="hover:text-white transition">Careers</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-slate-400 text-sm">
                <li><a href="#" className="hover:text-white transition">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-400 text-sm">
            <p>© 2026 AI Brain. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
