const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? 'dhawal.chheda@accel4.com'
const DEMO_SUBJECT = encodeURIComponent('QorSync AI Demo Request')
const DEMO_BODY = encodeURIComponent(
  'Hi Dhawal,\n\nI would like a demo of QorSync AI.\n\nName:\nCompany:\nUse case:\n'
)

const DEFAULT_MAILTO_URL = `mailto:${DEMO_EMAIL}?subject=${DEMO_SUBJECT}&body=${DEMO_BODY}`
const CONFIGURED_DEMO_URL = process.env.NEXT_PUBLIC_DEMO_URL?.trim()

export const REQUEST_DEMO_URL = CONFIGURED_DEMO_URL || DEFAULT_MAILTO_URL
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://qorsync.online'

function appendUtm(url: string, source: string) {
  try {
    const parsed = new URL(url)
    parsed.searchParams.set('utm_source', source)
    parsed.searchParams.set('utm_medium', 'website')
    parsed.searchParams.set('utm_campaign', 'demo_request')
    return parsed.toString()
  } catch {
    return url
  }
}

export function demoUrl(source = 'website') {
  if (REQUEST_DEMO_URL.startsWith('http://') || REQUEST_DEMO_URL.startsWith('https://')) {
    return appendUtm(REQUEST_DEMO_URL, source)
  }
  return REQUEST_DEMO_URL
}
