import { env } from '@/env'

const TAGLINE = 'Студия веб-разработки и дизайна'

export const SITE_CONFIG = {
  // TODO: replace with the real agency name, email, title and description
  name: 'dialog',
  email: 'hello@bydialog.ru',
  tagline: TAGLINE,
  // The page's h1, top-left in the hero
  slogan: 'Разрабатываем сайты и цифровые продукты для бизнеса',
  title: 'Разработка сайтов и веб-дизайн на заказ - студия dialog',
  description:
    'Студия dialog: разработка сайтов, интернет-магазинов и веб-сервисов, дизайн и айдентика для бизнеса по всей России - от стратегии до запуска и поддержки.',
  // NEXT_PUBLIC_SITE_URL overrides it (e.g. for a staging server); it is read at build time
  url: env.NEXT_PUBLIC_SITE_URL ?? 'https://bydialog.ru',
  lang: 'ru',
  locale: 'ru_RU',
  themeColor: '#e8e8e3',
  // The favicon's dark tile and its light letter, for images drawn in the logo's style
  logoColors: { tile: '#0c0c0c', mark: '#e8e8e3' }
} as const
