export interface NavigationLink {
  label: string
  href: string
}

// TODO: point at the real sections once the pages exist
export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Работы', href: '/#works' },
  { label: 'Сервис', href: '/#services' }
]

export const TELEGRAM_LINK: NavigationLink = { label: 'Telegram', href: 'https://t.me/uhoce' }

// "Кто мы" has no section of its own: it leads to the hero, which says who we are
export const FOOTER_LINKS: NavigationLink[] = [
  { label: 'Кто мы', href: '/' },
  ...NAVIGATION_LINKS,
  { label: 'Faq', href: '/#faq' }
]

// The last footer item opens the chat instead of leading somewhere
export const FOOTER_START_LABEL = 'Старт'

export const FOOTER_ID = 'footer'
