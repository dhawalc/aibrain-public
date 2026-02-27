const DEMO_EMAIL = process.env.NEXT_PUBLIC_DEMO_EMAIL ?? 'dhawal.chheda@accel4.com'
const DEMO_SUBJECT = encodeURIComponent('QorSync AI Demo Request')
const DEMO_BODY = encodeURIComponent(
  'Hi Dhawal,\n\nI would like a demo of QorSync AI.\n\nName:\nCompany:\nUse case:\n'
)

export const REQUEST_DEMO_URL = `mailto:${DEMO_EMAIL}?subject=${DEMO_SUBJECT}&body=${DEMO_BODY}`
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
