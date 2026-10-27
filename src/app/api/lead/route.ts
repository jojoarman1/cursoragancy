import { LEAD_RATE_LIMIT } from '@/config/lead'
import { formatLeadMessage } from '@/lib/lead.message'
import { leadSchema } from '@/lib/lead.schema'
import { isRateLimited } from '@/lib/rateLimit'
import { isTelegramConfigured, sendTelegramMessage } from '@/lib/telegram'

// Behind nginx the app itself only sees 127.0.0.1
const getClientIp = (request: Request) =>
  request.headers.get('x-real-ip') ??
  request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
  'unknown'

const isSameOrigin = (request: Request) => {
  const origin = request.headers.get('origin')
  if (!origin) return true
  return URL.canParse(origin) && new URL(origin).host === request.headers.get('host')
}

export async function POST(request: Request) {
  if (!isSameOrigin(request)) return Response.json({ error: 'forbidden' }, { status: 403 })
  if (isRateLimited(getClientIp(request), LEAD_RATE_LIMIT)) {
    return Response.json({ error: 'too_many_requests' }, { status: 429 })
  }

  const body: unknown = await request.json().catch(() => null)
  const lead = leadSchema.safeParse(body)
  if (!lead.success) return Response.json({ error: 'invalid' }, { status: 400 })

  if (!isTelegramConfigured()) {
    console.error('Lead not delivered: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set')
    return Response.json({ error: 'unavailable' }, { status: 503 })
  }

  try {
    await sendTelegramMessage(formatLeadMessage(lead.data))
  } catch (error) {
    console.error('Lead not delivered to Telegram', error)
    return Response.json({ error: 'delivery_failed' }, { status: 502 })
  }

  return Response.json({ ok: true })
}
