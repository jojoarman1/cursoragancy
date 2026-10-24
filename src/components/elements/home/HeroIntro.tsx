'use client'

import dynamic from 'next/dynamic'

import { useHeroIntro } from '@/hooks/useHeroIntro'

import { HeroCaptions } from './HeroCaptions'

const PrismTitleScene = dynamic(
  () => import('./PrismTitleScene').then(module => module.PrismTitleScene),
  { ssr: false }
)

export const HeroIntro = () => {
  const heroIntro = useHeroIntro()

  return (
    <>
      <PrismTitleScene
        isRevealed={heroIntro.state.isLoaded}
        onReady={heroIntro.functions.onSceneReady}
      />
      <HeroCaptions isVisible={heroIntro.state.isLoaded} />
    </>
  )
}
