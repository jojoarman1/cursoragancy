import { SITE_CONFIG } from '@/config/site'

export interface ChatOption {
  value: string
  next?: string
}

export interface ChatStep {
  text: string
  label: string
  next?: string
  isNewParagraph?: boolean
  isMultiline?: boolean
  isMultiselect?: boolean
  inputMode?: 'text' | 'email'
  isContact?: boolean
  options?: ChatOption[]
}

export const CHAT_FIRST_STEP_ID = 'name'

export const CHAT_STEPS: Record<string, ChatStep> = {
  name: { text: 'Привет, меня зовут', label: 'Имя', next: 'subject' },
  subject: {
    text: 'и мне хотелось бы обсудить с вами',
    label: 'Тема',
    options: [
      { value: 'новый проект', next: 'project' },
      { value: 'работу у вас', next: 'job' },
      { value: `стажировку в ${SITE_CONFIG.name}`, next: 'internship' },
      { value: 'кое-что...', next: 'something' }
    ]
  },
  project: {
    text: 'Проект – это',
    label: 'Проект',
    next: 'projectNeeds',
    isNewParagraph: true,
    options: [
      { value: 'цифровая платформа / SaaS' },
      { value: 'мобильное приложение' },
      { value: 'сайт компании' },
      { value: 'онлайн-магазин' },
      { value: 'маркетинговый сайт' },
      { value: 'сайт-портфолио' },
      { value: 'другое' }
    ]
  },
  projectNeeds: {
    text: ', которому необходим',
    label: 'Нужно',
    next: 'projectDeadline',
    isMultiselect: true,
    options: [{ value: 'брендинг' }, { value: 'дизайн' }, { value: 'разработка' }]
  },
  projectDeadline: {
    text: ', и он должен быть завершен',
    label: 'Сроки',
    next: 'contact',
    options: [
      { value: 'как можно скорее' },
      { value: 'за 3 месяца' },
      { value: 'за 6 месяцев' },
      { value: 'в предложенные исполнителем сроки' },
      { value: 'другое' }
    ]
  },
  job: {
    text: 'Я –',
    label: 'Специальность',
    next: 'country',
    isNewParagraph: true,
    options: [
      { value: 'дизайнер' },
      { value: 'frontend разработчик' },
      { value: 'backend разработчик' },
      { value: 'QA специалист' },
      { value: 'менеджер проектов' },
      { value: 'другое' }
    ]
  },
  internship: {
    text: 'Меня интересует',
    label: 'Направление',
    next: 'country',
    isNewParagraph: true,
    options: [{ value: 'frontend' }, { value: 'backend' }, { value: 'управление проектами' }]
  },
  country: { text: 'Страна', label: 'Страна', next: 'about', isNewParagraph: true },
  about: {
    text: 'Немного обо мне:',
    label: 'О себе',
    next: 'contact',
    isNewParagraph: true,
    isMultiline: true
  },
  something: {
    text: 'Если коротко, речь пойдет о',
    label: 'Сообщение',
    next: 'contact',
    isNewParagraph: true,
    isMultiline: true
  },
  contact: {
    text: 'Вы можете связаться со мной через почту или телеграм',
    label: 'Почта или Telegram',
    isNewParagraph: true,
    // The email keyboard has @ for a Telegram username too
    inputMode: 'email',
    isContact: true
  }
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
// @username, username or a t.me link; 4-character usernames exist too (sold on Fragment)
const TELEGRAM_PATTERN = /^(?:@|(?:https?:\/\/)?t\.me\/)?[a-z][a-z0-9_]{3,31}$/i

export const isChatContact = (value: string) =>
  EMAIL_PATTERN.test(value) || TELEGRAM_PATTERN.test(value)

// An email is at most 254 characters
const CHAT_MAX_LENGTH = { line: 100, contact: 254, multiline: 2000 }

export const getChatMaxLength = (step: ChatStep) => {
  if (step.isContact) return CHAT_MAX_LENGTH.contact
  return step.isMultiline ? CHAT_MAX_LENGTH.multiline : CHAT_MAX_LENGTH.line
}

export const getChatThanks = (name: string) => `Спасибо, ${name}! Скоро свяжемся!`
