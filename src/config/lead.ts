export const LEAD_ENDPOINT = '/api/lead'

export const LEAD_RATE_LIMIT = { limit: 5, windowMs: 10 * 60 * 1000 }

// Leave room within Telegram's 4096-character limit for labels and metadata.
export const LEAD_LIMITS = { answers: 12, values: 10, totalTextLength: 3000 }

// The message title by the chat's branch (the step the topic leads to)
export const LEAD_TITLES: Record<string, string> = {
  project: 'Новый проект',
  job: 'Отклик на вакансию',
  internship: 'Стажировка',
  something: 'Сообщение'
}

export const LEAD_TITLE_FALLBACK = 'Новая заявка'
export const LEAD_HASHTAG = '#заявка'
export const LEAD_TIME_ZONE = 'Europe/Moscow'
