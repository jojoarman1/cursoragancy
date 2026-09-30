'use client'

import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { HeroCaptions } from './HeroCaptions'
import { Preloader } from './Preloader'

// Finishes the preloader even if the 3D scene never reports ready (e.g. no WebGL)
const MAX_LOADING_TIME = 8000

const GlassLogoScene = dynamic(
  () => import('./GlassLogoScene').then(module => module.GlassLogoScene),
  { ssr: false }
)

export const GlassLogo = () => {
  const [isSceneReady, setIsSceneReady] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsSceneReady(true), MAX_LOADING_TIME)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <GlassLogoScene isVisible={isLoaded} onReady={() => setIsSceneReady(true)} />
      <Preloader isComplete={isSceneReady} onFinish={() => setIsLoaded(true)} />
      <HeroCaptions isVisible={isLoaded} />
    </>
  )
}
