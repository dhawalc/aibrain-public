import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { SITE_URL } from '@/lib/site'

const CANONICAL_HOST = new URL(SITE_URL).hostname
const LOCALHOST_HOSTS = new Set(['localhost', '127.0.0.1'])

export function middleware(request: NextRequest) {
  const hostHeader = request.headers.get('host') || ''
  const host = hostHeader.split(':')[0].toLowerCase()

  if (!host || LOCALHOST_HOSTS.has(host) || host.startsWith('192.168.')) {
    return NextResponse.next()
  }

  if (host === CANONICAL_HOST) {
    return NextResponse.next()
  }

  const redirectUrl = request.nextUrl.clone()
  redirectUrl.protocol = 'https'
  redirectUrl.hostname = CANONICAL_HOST
  redirectUrl.port = ''
  return NextResponse.redirect(redirectUrl, 308)
}

export const config = {
  matcher: '/:path*',
}
