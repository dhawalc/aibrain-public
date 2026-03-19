'use client'

import EmailCapture from '@/components/email-capture'

type NewsletterCtaProps = {
  source: string
  articleTitle: string
}

export default function NewsletterCta({ source, articleTitle }: NewsletterCtaProps) {
  // articleTitle is included for GA tracking context via the source prop
  void articleTitle

  return (
    <EmailCapture
      source={source}
      heading="Get workflow automation insights that cut through the noise"
      description="One email per week. Practical frameworks, not product pitches."
    />
  )
}
