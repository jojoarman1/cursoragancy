'use client'

import clsx from 'clsx'

import { COMPLETE_PROGRESS, type UsePreloaderParams, usePreloader } from '@/hooks/usePreloader'

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
      aria-hidden={preloader.state.isFinished}
      className={clsx(
        'pointer-events-none fixed right-6 bottom-6 font-mono text-[12px] tabular-nums transition-opacity duration-500',
        preloader.state.isFinished && 'opacity-0'
      )}
    >
      0%
    </div>
  )
}
