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
      <h1 className='absolute top-[calc(24*var(--text-unit))] left-[calc(24*var(--text-unit))] max-w-[calc(720*var(--text-unit))] text-[calc(42*var(--text-unit))] leading-[1.1] font-bold tracking-[-0.03em] max-lg:top-[calc(12*var(--text-unit))] max-lg:left-[calc(16*var(--text-unit))] max-lg:max-w-[calc(300*var(--text-unit))] max-lg:text-[calc(24*var(--text-unit))]'>
        <span className='block'>{SITE_CONFIG.slogan}</span>
      </h1>

      {/* Chat button height, so their centers line up */}
      <p className='absolute right-[calc(24*var(--text-unit))] bottom-[calc(24*var(--text-unit))] flex h-[calc(33*var(--text-unit))] items-center font-mono text-sm uppercase'>
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
