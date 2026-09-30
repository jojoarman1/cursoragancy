'use client'

import { COMPLETE_PROGRESS, type UsePreloaderParams, usePreloader } from '@/hooks/usePreloader'

// How much each number fades out per line of distance from the current one
const FADE_STEP = 0.35

const NUMBERS = Array.from({ length: COMPLETE_PROGRESS + 1 }, (_, index) => index)

type PreloaderProps = UsePreloaderParams

export const Preloader = (props: PreloaderProps) => {
  const preloader = usePreloader(props)

  return (
    <div
      ref={preloader.refs.progressRef}
      role='progressbar'
      aria-label='Загрузка'
      aria-valuemin={0}
      aria-valuemax={COMPLETE_PROGRESS}
      aria-valuenow={0}
      className='pointer-events-none fixed right-6 bottom-6 flex items-center gap-5 font-mono text-base leading-none tabular-nums [--line:1.75em] [--progress:0]'
    >
      <span data-preloader-bracket aria-hidden='true'>
        (
      </span>
      {/* Five-line window: the current number in the middle, upcoming above, passed below */}
      <div aria-hidden='true' className='relative h-[calc(var(--line)*5)] w-[3ch] overflow-hidden'>
        <ol className='absolute inset-x-0 bottom-[calc(var(--line)*2)] flex translate-y-[calc(var(--progress)*var(--line))] flex-col-reverse will-change-transform'>
          {NUMBERS.map(number => (
            <li
              key={number}
              className='flex h-(--line) items-center justify-center'
              style={{
                opacity: `clamp(0, calc(1 - max(${number} - var(--progress), var(--progress) - ${number}) * ${FADE_STEP}), 1)`
              }}
            >
              {number}
            </li>
          ))}
        </ol>
      </div>
      <span data-preloader-bracket aria-hidden='true'>
        )
      </span>
    </div>
  )
}
