'use client'

import { type UseHeroCaptionsParams, useHeroCaptions } from '@/hooks/useHeroCaptions'

type HeroCaptionsProps = UseHeroCaptionsParams

export const HeroCaptions = (props: HeroCaptionsProps) => {
  const heroCaptions = useHeroCaptions(props)

  return (
    <div ref={heroCaptions.refs.containerRef} className='font-mono text-sm'>
      {/* Each line clips its text, which GSAP slides up from below after the intro */}
      <p className='absolute bottom-6 left-11.5 overflow-hidden font-light uppercase'>
        <span data-hero-caption className='invisible block'>
          Купи у нас!
        </span>
      </p>
      <p className='absolute right-11.5 bottom-6 overflow-hidden uppercase'>
        <span data-hero-caption className='invisible block'>
          2026
        </span>
      </p>
    </div>
  )
}
