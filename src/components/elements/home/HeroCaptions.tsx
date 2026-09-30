'use client'

import clsx from 'clsx'

import { type UseHeroCaptionsParams, useHeroCaptions } from '@/hooks/useHeroCaptions'

const CHAT_DOT_POSITIONS = ['left-0', 'left-[9px]', 'right-0']

type HeroCaptionsProps = UseHeroCaptionsParams

export const HeroCaptions = (props: HeroCaptionsProps) => {
  const heroCaptions = useHeroCaptions(props)

  return (
    <div ref={heroCaptions.refs.containerRef} className='font-mono text-sm'>
      {/* px, not artboard rem: the tap target must not shrink on small screens */}
      <button
        data-hero-fade
        type='button'
        aria-label='Открыть чат'
        className='invisible fixed bottom-6 left-11.5 z-40 h-[35px] mix-blend-difference w-[60px] cursor-pointer rounded-[17px] bg-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-black max-[480px]:h-[28px] max-[480px]:w-0.7]'
      >
        <span
          aria-hidden='true'
          className='absolute top-[18px] left-1/2 h-[3px] w-[21px] -translate-x-1/2 max-[480px]:top-[13px]'
        >
          {CHAT_DOT_POSITIONS.map(position => (
            <span
              key={position}
              className={clsx('absolute top-0 size-[3px] bg-[#0c0c0c]', position)}
            />
          ))}
        </span>
      </button>
      {/* Button height, so their centers line up */}
      <p className='absolute right-11.5 bottom-6 flex h-[35px] items-center overflow-hidden uppercase max-[480px]:h-[28px]'>
        <span data-hero-caption className='invisible block'>
          2026
        </span>
      </p>
    </div>
  )
}
