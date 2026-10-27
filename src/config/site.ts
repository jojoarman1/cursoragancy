const TAGLINE = 'Студия веб-разработки и дизайна'

export const SITE_CONFIG = {
  // TODO: replace with the real agency name, email, title and description
  name: 'dialog',
  email: 'hello@bydialog.ru',
  tagline: TAGLINE,
  // The statement in the top-left corner of the hero
  slogan: 'Мы креативное агентство, специализирующееся на достижении превосходных результатов.',
  title: `dialog | ${TAGLINE}`,
  description: 'Digital-агентство: проектируем и разрабатываем сайты, веб-сервисы и 3D-интерфейсы',
  // NEXT_PUBLIC_SITE_URL overrides it (e.g. for a staging server); it is read at build time
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://bydialog.ru',
  lang: 'ru',
  locale: 'ru_RU',
  themeColor: '#e8e8e3'
} as const
