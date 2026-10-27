import { env } from '@/env'

const TELEGRAM_API = 'https://api.telegram.org'
const TIMEOUT_MS = 10_000

export const isTelegramConfigured = () => !!env.TELEGRAM_BOT_TOKEN && !!env.TELEGRAM_CHAT_ID

// Server only: the URL carries the bot token
export const sendTelegramMessage = async (html: string) => {
  const response = await fetch(`${TELEGRAM_API}/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: env.TELEGRAM_CHAT_ID,
      text: html,
      parse_mode: 'HTML',
      link_preview_options: { is_disabled: true }
    }),
    signal: AbortSignal.timeout(TIMEOUT_MS)
  })

  if (!response.ok) {
    throw new Error(`Telegram answered ${response.status}: ${await response.text()}`)
  }
}
