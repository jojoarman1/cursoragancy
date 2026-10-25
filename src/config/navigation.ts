export interface NavigationLink {
  label: string
  href: string
}

// TODO: point at the real sections once the pages exist
export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Кто мы?', href: '/#about' },
  { label: 'Работы', href: '/#works' },
  { label: 'Сервис', href: '/#services' }
]

export const TELEGRAM_LINK: NavigationLink = { label: 'Telegram', href: 'https://t.me/uhoce' }
