'use client'

import { useState } from 'react'
import Link from 'next/link'
import EmailCapture from '@/components/email-capture'

type SecondaryCtaProps = {
  source: string
}

export default function SecondaryCta({ source }: SecondaryCtaProps) {
  const [showEmailCapture, setShowEmailCapture] = useState(false)

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        <Link
          href="/blog/enterprise-agent-governance-checklist"
          className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-4 text-sm font-medium text-white transition hover:border-[#26AAE3]/50 hover:bg-slate-800"
        >
          <svg className="h-5 w-5 flex-shrink-0 text-[#26AAE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download the governance checklist
        </Link>

        <Link
          href="/tools/approval-workflow-roi-calculator"
          className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-4 text-sm font-medium text-white transition hover:border-[#26AAE3]/50 hover:bg-slate-800"
        >
          <svg className="h-5 w-5 flex-shrink-0 text-[#26AAE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Try the ROI calculator
        </Link>

        <button
          type="button"
          onClick={() => setShowEmailCapture(true)}
          className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-800/50 px-5 py-4 text-sm font-medium text-white transition hover:border-[#26AAE3]/50 hover:bg-slate-800"
        >
          <svg className="h-5 w-5 flex-shrink-0 text-[#26AAE3]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
          </svg>
          Get weekly insights
        </button>
      </div>

      {showEmailCapture ? (
        <EmailCapture
          source={`secondary_cta_${source}`}
          heading="Stay ahead of enterprise AI operations"
          description="Weekly frameworks and implementation patterns. No fluff."
        />
      ) : null}
    </div>
  )
}
