import { CHAT_STEPS } from '@/config/chat'
import { LEAD_HASHTAG, LEAD_TIME_ZONE, LEAD_TITLE_FALLBACK, LEAD_TITLES } from '@/config/lead'
import { SITE_CONFIG } from '@/config/site'

import type { Lead, LeadAnswer } from './lead.schema'

const SUMMARY_STEP_IDS = ['name', 'subject', 'contact']
const TELEGRAM_LINK_PATTERN = /^(?:https?:\/\/)?t\.me\//i

const dateFormat = new Intl.DateTimeFormat('ru-RU', {
  timeZone: LEAD_TIME_ZONE,
  dateStyle: 'short',
  timeStyle: 'short'
})

// Visitors' text must not turn into Telegram markup
const escapeHtml = (text: string) =>
  text.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')

// Telegram only links a username written as @name
const formatContact = (contact: string) => {
  if (contact.includes('@') && !contact.startsWith('@')) return contact
  return `@${contact.replace(TELEGRAM_LINK_PATTERN, '').replace(/^@/, '')}`
}

const formatDetail = ({ stepId, values }: LeadAnswer) => {
  const step = CHAT_STEPS[stepId]
  const label = `<b>${escapeHtml(step.label)}:</b>`
  const value = escapeHtml(values.join(', '))
  return step.isMultiline ? `${label}\n<blockquote>${value}</blockquote>` : `${label} ${value}`
}

export const formatLeadMessage = ({ answers }: Lead) => {
  const getValue = (stepId: string) => answers.find(answer => answer.stepId === stepId)?.values[0]
  const branch = answers.find(answer => Object.hasOwn(LEAD_TITLES, answer.stepId))
  const title = branch ? LEAD_TITLES[branch.stepId] : LEAD_TITLE_FALLBACK
  const name = getValue('name')
  const contact = getValue('contact')
  const details = answers.filter(answer => !SUMMARY_STEP_IDS.includes(answer.stepId))
  const site = new URL(SITE_CONFIG.url).host

  return [
    `<b>${title}</b>`,
    '',
    ...(name ? [`<b>Имя:</b> ${escapeHtml(name)}`] : []),
    ...(contact ? [`<b>Контакт:</b> ${escapeHtml(formatContact(contact))}`] : []),
    ...(details.length > 0 ? ['', ...details.map(formatDetail)] : []),
    '',
    `<i>${site} · ${dateFormat.format(new Date())} МСК</i>`,
    '<i>Согласие на обработку персональных данных получено</i>',
    LEAD_HASHTAG
  ].join('\n')
}
