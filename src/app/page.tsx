import type { Metadata } from 'next'

import { Hero } from '@/components/elements/home/Hero'
import { SITE_CONFIG } from '@/config/site'

export const metadata: Metadata = {
  alternates: {
    canonical: '/'
  }
}

const JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': `${SITE_CONFIG.url}/#organization`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/icon.svg`,
      description: SITE_CONFIG.description
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.url}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      inLanguage: SITE_CONFIG.lang,
      publisher: { '@id': `${SITE_CONFIG.url}/#organization` }
    }
  ]
}

export default function Home() {
  return (
    <main>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, `<` is escaped
        dangerouslySetInnerHTML={{ __html: JSON.stringify(JSON_LD).replace(/</g, '\\u003c') }}
      />
      <Hero />
      {/* Placeholder for the next section: full screen on a white background, empty for now */}
      <section className='h-dvh bg-white text-black' />
    </main>
  )
}
