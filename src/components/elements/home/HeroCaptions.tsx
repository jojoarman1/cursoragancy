'use client'

import { type UseHeroCaptionsParams, useHeroCaptions } from '@/hooks/useHeroCaptions'

type HeroCaptionsProps = UseHeroCaptionsParams

export const HeroCaptions = (props: HeroCaptionsProps) => {
  const heroCaptions = useHeroCaptions(props)

  return (
    <div ref={heroCaptions.refs.containerRef} className='font-mono text-sm'>
      {/* Chat button height, so their centers line up */}
      <p className='absolute right-11.5 bottom-6 flex h-[35px] items-center overflow-hidden uppercase max-[480px]:h-[28px]'>
        <span data-hero-caption className='invisible block'>
          2026
        </span>
      </p>
    </div>
  )
}
