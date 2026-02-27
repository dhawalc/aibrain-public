'use client'

import { useState } from 'react'

type LinkedInCopyButtonProps = {
  title: string
  description: string
  url: string
}

function buildLinkedInPost({ title, description, url }: LinkedInCopyButtonProps): string {
  return `${title}

${description}

Read more: ${url}

#QorSyncAI #Accel4 #EnterpriseAI #AgenticAI #Automation`
}

export default function LinkedInCopyButton({ title, description, url }: LinkedInCopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const payload = buildLinkedInPost({ title, description, url })
    await navigator.clipboard.writeText(payload)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="inline-flex items-center rounded-lg border border-[#26AAE3]/40 bg-slate-900 px-4 py-2 text-sm font-medium text-[#26AAE3] transition hover:bg-slate-800"
    >
      {copied ? 'Copied LinkedIn Post' : 'Copy LinkedIn Post'}
    </button>
  )
}
