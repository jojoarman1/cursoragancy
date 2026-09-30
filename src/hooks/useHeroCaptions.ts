import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { useRef } from 'react'

import { INTRO_DURATION } from '@/config/animation'

gsap.registerPlugin(useGSAP, CustomEase)

// Slides up from below its own line, which clips it
const CAPTION_SELECTOR = '[data-hero-caption]'
const CAPTION_DURATION = 1.2
// Gentle ease-out: soft start, smooth stop, no overshoot
const CAPTION_EASE = 'sine.out'

// Fades in, with the timing of the snp.agency chat button
const FADE_SELECTOR = '[data-hero-fade]'
const FADE_DURATION = 1
const FADE_EASE = CustomEase.create('heroFade', '0.31, 0.13, 0.11, 1')

export interface UseHeroCaptionsParams {
  isVisible: boolean
}

// Starts once the logo has finished scaling in (it takes INTRO_DURATION)
export const useHeroCaptions = ({ isVisible }: UseHeroCaptionsParams) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (!isVisible) return

      const delay = reduceMotion ? 0 : INTRO_DURATION

      gsap.fromTo(
        CAPTION_SELECTOR,
        { yPercent: reduceMotion ? 0 : 100, visibility: 'visible' },
        { yPercent: 0, delay, duration: reduceMotion ? 0 : CAPTION_DURATION, ease: CAPTION_EASE }
      )

      gsap.fromTo(
        FADE_SELECTOR,
        { autoAlpha: 0 },
        { autoAlpha: 1, delay, duration: reduceMotion ? 0 : FADE_DURATION, ease: FADE_EASE }
      )
    },
    { dependencies: [isVisible], scope: containerRef }
  )

  return {
    refs: { containerRef }
  }
}
