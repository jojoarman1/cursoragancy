export const YANDEX_METRIKA = {
  id: 113833411,
  options: {
    ssr: true,
    webvisor: true,
    clickmap: true,
    ecommerce: 'dataLayer',
    accurateTrackBounce: true,
    trackLinks: true
  }
}

export const COOKIE_CONSENT_KEY = 'dialog:cookie-consent'
export const COOKIE_CHOICES = ['accepted', 'declined'] as const
export type CookieChoice = (typeof COOKIE_CHOICES)[number]

// JavaScript-event goals in Metrika use these ids
export const CHAT_GOALS = {
  open: 'chat_open',
  autoOpen: 'chat_auto_open',
  send: 'chat_send',
  sent: 'chat_sent',
  sendError: 'chat_send_error'
} as const

export const getChatAnswerGoal = (stepId: string) => `chat_answer_${stepId}` as const

export type MetrikaGoal =
  | (typeof CHAT_GOALS)[keyof typeof CHAT_GOALS]
  | ReturnType<typeof getChatAnswerGoal>
