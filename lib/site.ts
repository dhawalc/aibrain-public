const defaultPrivateAppUrl = 'https://aibrain-frontend-375423256919.us-central1.run.app'

export const PRIVATE_APP_URL = process.env.NEXT_PUBLIC_PRIVATE_APP_URL ?? defaultPrivateAppUrl
export const REQUEST_DEMO_URL = `${PRIVATE_APP_URL}/auth/signin`
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'
