export interface LegalSection {
  id: string
  title: string
  paragraphs: string[]
}

// The email doubles as the address for requests and consent withdrawals
export const LEGAL_OPERATOR = {
  name: 'Мухаметдинов Артём Ильшатович',
  status: 'плательщик налога на профессиональный доход (самозанятый)',
  inn: '740414283580',
  email: 'jourjoarmani@gmail.com'
}

export const LEGAL_UPDATED_AT = '28.10.2026'

export const LEGAL_LINKS = { privacy: '/privacy', consent: '/consent' }

export const LEGAL_OPERATOR_LINE = `${LEGAL_OPERATOR.name}, ${LEGAL_OPERATOR.status}, ИНН ${LEGAL_OPERATOR.inn}, адрес электронной почты для обращений: ${LEGAL_OPERATOR.email}`

export const LEGAL_DATA_LIST =
  'имя; адрес электронной почты или имя пользователя в Telegram; ответы в чате на сайте (тема обращения, сведения о проекте, специальность, страна, сведения о себе, текст сообщения)'

export const LEGAL_TELEGRAM_RECIPIENT =
  'Telegram (Telegram FZ-LLC, Объединённые Арабские Эмираты): заявка пересылается в закрытый канал оператора'
