import { SITE_CONFIG } from '@/config/site'

import { HeroIntro } from './HeroIntro'

export const Hero = () => (
  // svh, not dvh: iOS Safari's toolbar changes dvh while scrolling, which would resize the WebGL title
  <section className='relative h-svh'>
    {/* The big word is drawn by the WebGL scene; the h1 is the hero caption */}
    <p className='sr-only'>{SITE_CONFIG.name}</p>
    <HeroIntro />
  </section>
)
