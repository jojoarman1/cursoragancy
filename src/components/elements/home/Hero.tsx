import { SITE_CONFIG } from '@/config/site'

import { GlassLogo } from './GlassLogo'

export const Hero = () => (
  <section className='relative h-dvh'>
    {/* Visually hidden until the hero gets visible copy: search engines don't read the 3D logo */}
    <div className='sr-only'>
      <h1>{SITE_CONFIG.name}</h1>
      <p>{SITE_CONFIG.description}</p>
    </div>
    <GlassLogo />
  </section>
)
