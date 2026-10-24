export interface NavigationLink {
  label: string
  href: string
}

// TODO: point at the real sections once the pages exist
export const NAVIGATION_LINKS: NavigationLink[] = [
  { label: 'Кто мы?', href: '/#about' },
  { label: 'Работы', href: '/#works' },
  { label: 'Сервис', href: '/#services' },
  { label: 'Faq', href: '/#faq' },
  { label: 'Старт', href: '/#start' }
]

export const SOCIAL_LINKS: NavigationLink[] = [{ label: 'Telegram', href: 'https://t.me/uhoce' }]
