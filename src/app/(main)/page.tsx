import type { Metadata } from 'next'

import { Cta } from '@/components/elements/home/Cta'
import { Faq } from '@/components/elements/home/Faq'
import { Hero } from '@/components/elements/home/Hero'
import { Projects } from '@/components/elements/home/Projects'
import { Services } from '@/components/elements/home/Services'
import { Testimonial } from '@/components/elements/home/Testimonial'
import { HOME_JSON_LD } from '@/lib/structuredData'

export const metadata: Metadata = {
  alternates: {
    canonical: '/'
  }
}

export default function Home() {
  return (
    <main>
      <script
        type='application/ld+json'
        // biome-ignore lint/security/noDangerouslySetInnerHtml: static JSON-LD, `<` is escaped
        dangerouslySetInnerHTML={{ __html: JSON.stringify(HOME_JSON_LD).replace(/</g, '\\u003c') }}
      />
      <Hero />
      <Projects />
      <Testimonial />
      <Services />
      <Faq />
      <Cta />
    </main>
  )
}
