// Single source for SEO data: metadata, JSON-LD, OG image, manifest, sitemap and robots
export const SITE_CONFIG = {
  // TODO: replace with the real agency name, title and description
  name: 'Cursor Agency',
  title: 'Cursor Agency — разработка сайтов и цифровых продуктов',
  description: 'Digital-агентство: проектируем и разрабатываем сайты, веб-сервисы и 3D-интерфейсы',
  // Production domain comes from NEXT_PUBLIC_SITE_URL, e.g. https://example.com
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  lang: 'ru',
  locale: 'ru_RU',
  themeColor: '#000000'
} as const
