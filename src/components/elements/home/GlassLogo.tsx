'use client'

import { target, useLockScroll, useMount } from '@siberiacancode/reactuse'
import dynamic from 'next/dynamic'
import { useEffect, useState } from 'react'

import { useLogoDockScroll } from '@/hooks/useLogoDockScroll'

import { HeroCaptions } from './HeroCaptions'
import { Preloader } from './Preloader'

// Finishes the preloader even if the 3D scene never reports ready (e.g. no WebGL)
const MAX_LOADING_TIME = 8000

const BODY_TARGET = target(() => document.body)

const GlassLogoScene = dynamic(
  () => import('./GlassLogoScene').then(module => module.GlassLogoScene),
  { ssr: false }
)

export const GlassLogo = () => {
  const [isSceneReady, setIsSceneReady] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const logoDockScroll = useLogoDockScroll()

  // No scrolling until the preloader has finished
  useLockScroll(BODY_TARGET, { enabled: !isLoaded })

  // The intro always starts at the top: no restored scroll position after a reload
  useMount(() => {
    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  })

  useEffect(() => {
    const timeoutId = setTimeout(() => setIsSceneReady(true), MAX_LOADING_TIME)
    return () => clearTimeout(timeoutId)
  }, [])

  return (
    <>
      <GlassLogoScene
        isVisible={isLoaded}
        isDocked={logoDockScroll.state.isDocked}
        dockProgressRef={logoDockScroll.refs.progressRef}
        onReady={() => setIsSceneReady(true)}
      />
      <Preloader isComplete={isSceneReady} onFinish={() => setIsLoaded(true)} />
      <HeroCaptions isVisible={isLoaded} />
    </>
  )
}
