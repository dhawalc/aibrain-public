import { promises as fs } from 'fs'
import path from 'path'

const NOTIFY_EMAIL = process.env.SUBSCRIBE_NOTIFY_EMAIL || 'dhawal.chheda@gmail.com'
const SUBSCRIBERS_FILE = path.join(process.cwd(), 'data', 'subscribers.json')

type Subscriber = {
  email: string
  source: string
  timestamp: string
}

async function loadSubscribers(): Promise<Subscriber[]> {
  try {
    const raw = await fs.readFile(SUBSCRIBERS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function saveSubscribers(subscribers: Subscriber[]): Promise<void> {
  await fs.mkdir(path.dirname(SUBSCRIBERS_FILE), { recursive: true })
  await fs.writeFile(SUBSCRIBERS_FILE, JSON.stringify(subscribers, null, 2))
}

async function sendGmailNotification(subscriber: Subscriber): Promise<void> {
  // Use gcloud auth to get token and send via Gmail API
  // This works on Cloud Run with the service account's Gmail send scope
  try {
    const { execSync } = await import('child_process')
    const token = execSync('gcloud auth application-default print-access-token', {
      encoding: 'utf-8',
    }).trim()

    const subject = `New QorSync subscriber: ${subscriber.email}`
    const body = `New email subscriber captured!\n\nEmail: ${subscriber.email}\nSource: ${subscriber.source}\nTimestamp: ${subscriber.timestamp}`

    const rawMessage = [
      `To: ${NOTIFY_EMAIL}`,
      `Subject: ${subject}`,
      `Content-Type: text/plain; charset=utf-8`,
      '',
      body,
    ].join('\r\n')

    const encodedMessage = Buffer.from(rawMessage)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')

    await fetch(
      `https://gmail.googleapis.com/gmail/v1/users/me/messages/send?key=&quotaUser=${NOTIFY_EMAIL}`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ raw: encodedMessage }),
      }
    )
  } catch {
    // Gmail notification is best-effort — don't fail the subscription
    console.error('Gmail notification failed (non-blocking)')
  }
}

export async function POST(request: Request) {
  try {
    const { email, source } = await request.json()

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return Response.json({ error: 'Invalid email' }, { status: 400 })
    }

    const trimmedEmail = email.trim().toLowerCase()
    const subscriber: Subscriber = {
      email: trimmedEmail,
      source: source || 'unknown',
      timestamp: new Date().toISOString(),
    }

    // Save to file
    const subscribers = await loadSubscribers()
    if (!subscribers.some((s) => s.email === trimmedEmail)) {
      subscribers.push(subscriber)
      await saveSubscribers(subscribers)
    }

    // Send notification (non-blocking)
    sendGmailNotification(subscriber).catch(() => {})

    return Response.json({ ok: true })
  } catch {
    return Response.json({ error: 'Server error' }, { status: 500 })
  }
}
