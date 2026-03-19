'use client'

import { useState } from 'react'

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

type EmailCaptureProps = {
  source: string
  heading: string
  description: string
  className?: string
}

export default function EmailCapture({ source, heading, description, className }: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')

    const trimmed = email.trim()
    if (!trimmed || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setError('Please enter a valid email address.')
      return
    }

    setSubmitting(true)

    // POST to API route
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmed, source }),
      })
      if (!res.ok) throw new Error('Subscribe failed')
    } catch {
      // Fallback: store locally if API fails
      try {
        const existing = JSON.parse(localStorage.getItem('qorsync_emails') || '[]') as string[]
        if (!existing.includes(trimmed)) {
          existing.push(trimmed)
          localStorage.setItem('qorsync_emails', JSON.stringify(existing))
        }
      } catch {
        // ignore
      }
    }

    // Fire GA event
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'email_capture', {
        event_category: 'engagement',
        event_label: source,
        value: 1,
      })
    }

    setSubmitting(false)
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className={`rounded-2xl border border-[#26AAE3]/30 bg-slate-900/60 p-8 ${className ?? ''}`}>
        <div className="flex items-center gap-3">
          <svg className="h-6 w-6 flex-shrink-0 text-[#26AAE3]" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <p className="text-lg font-medium text-white">
            You&apos;re in. We&apos;ll send workflow insights that are worth reading.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className={`rounded-2xl border border-slate-800 bg-slate-900/60 p-8 ${className ?? ''}`}>
      <h3 className="mb-2 text-xl font-bold text-white">{heading}</h3>
      <p className="mb-6 text-sm leading-relaxed text-slate-400">{description}</p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com"
          className="flex-1 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder-slate-500 outline-none transition focus:border-[#26AAE3]"
        />
        <button
          type="submit"
          disabled={submitting}
          className="rounded-xl bg-gradient-to-r from-[#093E8F] to-[#1C74BC] px-6 py-3 font-semibold text-white transition hover:from-[#0A3F8F] hover:to-[#26AAE3] disabled:opacity-50"
        >
          {submitting ? 'Subscribing...' : 'Subscribe'}
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-red-400">{error}</p> : null}
    </div>
  )
}
