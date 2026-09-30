'use client'

import dynamic from 'next/dynamic'
import { useEffect } from 'react'

import { useHeaderReveal } from '@/hooks/useHeaderReveal'
import { useLoadingTask } from '@/hooks/useLoadingTask'
import { useIsLoadingFinished } from '@/stores/loading'

import { HeroCaptions } from './HeroCaptions'
import { Preloader } from './Preloader'

// Releases the preloader even if the scene never reports ready (e.g. no WebGL)
const MAX_LOADING_TIME = 8000

const GlassLogoScene = dynamic(
  () => import('./GlassLogoScene').then(module => module.GlassLogoScene),
  { ssr: false }
)

export const GlassLogo = () => {
  const loadingTask = useLoadingTask()
  const isLoaded = useIsLoadingFinished()
  const headerReveal = useHeaderReveal()

  useEffect(() => {
    const timeoutId = setTimeout(loadingTask.functions.complete, MAX_LOADING_TIME)
    return () => clearTimeout(timeoutId)
  }, [loadingTask.functions.complete])

  return (
    <>
      <GlassLogoScene
        isVisible={isLoaded}
        isHidden={headerReveal.state.isHeroPassed}
        onReady={loadingTask.functions.complete}
      />
      <HeroCaptions isVisible={isLoaded} />
      <Preloader />
    </>
  )
}
