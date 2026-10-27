'use client'

import { SITE_CONFIG } from '@/config/site'
import { type UseHeroCaptionsParams, useHeroCaptions } from '@/hooks/useHeroCaptions'

type HeroCaptionsProps = UseHeroCaptionsParams

export const HeroCaptions = (props: HeroCaptionsProps) => {
  const heroCaptions = useHeroCaptions(props)

  return (
    <div ref={heroCaptions.refs.containerRef}>
      {/* In the header row, where the logo would be: on home the logo stays hidden until the big
          word scrolls away, and by then this has scrolled away too */}
      <p className='absolute top-6 left-6 max-w-180 text-[42rem] leading-[1.1] font-bold tracking-[-0.03em] max-lg:top-3 max-lg:left-4 max-lg:max-w-75 max-lg:text-[24rem]'>
        <span data-hero-slogan className='invisible block'>
          {SITE_CONFIG.slogan}
        </span>
      </p>

      {/* Chat button height, so their centers line up */}
      <p className='absolute right-6 bottom-6 flex h-8.25 items-center font-mono text-sm uppercase'>
        {/* Clips to the text's own height, so the lowered caption can't peek out */}
        <span className='block overflow-hidden'>
          <span data-hero-caption className='invisible block'>
            2026
          </span>
        </span>
      </p>
    </div>
  )
}
