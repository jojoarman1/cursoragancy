'use client'

import dynamic from 'next/dynamic'

import { useHeroIntro } from '@/hooks/useHeroIntro'
import { useHeroTitleVisibility } from '@/hooks/useHeroTitleVisibility'

import { HeroCaptions } from './HeroCaptions'

const PrismTitleScene = dynamic(
  () => import('./PrismTitleScene').then(module => module.PrismTitleScene),
  { ssr: false }
)

export const HeroIntro = () => {
  const heroIntro = useHeroIntro()
  const heroTitleVisibility = useHeroTitleVisibility()

  return (
    <>
      {/* The band the centred word occupies: once it scrolls out, the header logo shows */}
      <div
        ref={heroTitleVisibility.refs.titleBandRef}
        aria-hidden='true'
        className='pointer-events-none absolute inset-x-0 top-[42%] bottom-[42%]'
      />
      <PrismTitleScene
        isRevealed={heroIntro.state.isLoaded}
        onReady={heroIntro.functions.onSceneReady}
      />
      <HeroCaptions isVisible={heroIntro.state.isLoaded} />
    </>
  )
}
