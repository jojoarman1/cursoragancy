import { FAQ_ITEMS } from '@/config/faq'
import { TELEGRAM_LINK } from '@/config/navigation'
import { SERVICES } from '@/config/services'
import { SITE_CONFIG } from '@/config/site'
import { TESTIMONIAL } from '@/config/testimonial'

const ORGANIZATION_ID = `${SITE_CONFIG.url}/#organization`

export const HOME_JSON_LD = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': ORGANIZATION_ID,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      logo: `${SITE_CONFIG.url}/web-app-manifest-512x512.png`,
      description: SITE_CONFIG.description,
      email: SITE_CONFIG.email,
      sameAs: [TELEGRAM_LINK.href],
      areaServed: { '@type': 'Country', name: 'Россия' },
      founder: { '@type': 'Person', name: TESTIMONIAL.author.name, jobTitle: 'CEO' },
      contactPoint: {
        '@type': 'ContactPoint',
        contactType: 'sales',
        email: SITE_CONFIG.email,
        url: TELEGRAM_LINK.href,
        availableLanguage: 'Russian'
      },
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Услуги',
        itemListElement: SERVICES.map(service => ({
          '@type': 'Offer',
          itemOffered: { '@type': 'Service', name: service.title }
        }))
      }
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_CONFIG.url}/#website`,
      name: SITE_CONFIG.name,
      url: SITE_CONFIG.url,
      inLanguage: SITE_CONFIG.lang,
      publisher: { '@id': ORGANIZATION_ID }
    },
    {
      '@type': 'FAQPage',
      mainEntity: FAQ_ITEMS.map(item => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer }
      }))
    }
  ]
}
