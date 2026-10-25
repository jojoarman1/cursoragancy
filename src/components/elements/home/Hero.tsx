import { SITE_CONFIG } from '@/config/site'

import { HeroIntro } from './HeroIntro'

export const Hero = () => (
  // svh, not dvh: iOS Safari's toolbar changes dvh while scrolling, which would resize the WebGL title
  <section className='relative h-svh'>
    {/* The visible title is drawn by the WebGL scene */}
    <div className='sr-only'>
      <h1>{SITE_CONFIG.name}</h1>
      <p>{SITE_CONFIG.description}</p>
    </div>
    <HeroIntro />
  </section>
)
