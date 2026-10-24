import { SITE_CONFIG } from '@/config/site'

import { HeroIntro } from './HeroIntro'

export const Hero = () => (
  <section className='relative h-dvh'>
    {/* The visible title is drawn by the WebGL scene */}
    <div className='sr-only'>
      <h1>{SITE_CONFIG.name}</h1>
      <p>{SITE_CONFIG.description}</p>
    </div>
    <HeroIntro />
  </section>
)
