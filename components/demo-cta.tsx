'use client'

import type { ReactNode } from 'react'
import { demoUrl } from '@/lib/site'

type DemoCtaProps = {
  source: string
  className?: string
  children: ReactNode
}

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
  }
}

export default function DemoCta({ source, className, children }: DemoCtaProps) {
  const href = demoUrl(source)

  const onClick = () => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'generate_lead', {
        event_category: 'engagement',
        event_label: source,
        value: 1,
      })
    }
  }

  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  )
}
