import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { INTRO_DURATION } from '@/config/animation'

gsap.registerPlugin(useGSAP)

const CAPTION_SELECTOR = '[data-hero-caption]'
const CAPTION_DURATION = 1.2
// Gentle ease-out: soft start, smooth stop, no overshoot
const CAPTION_EASE = 'sine.out'
const CAPTION_STAGGER = 0.1

export interface UseHeroCaptionsParams {
  isVisible: boolean
}

// Once the logo has finished scaling in (it takes INTRO_DURATION), each caption slides up
// from below its own line, which clips it; opacity doesn't change
export const useHeroCaptions = ({ isVisible }: UseHeroCaptionsParams) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (!isVisible) return

      gsap.fromTo(
        CAPTION_SELECTOR,
        { yPercent: reduceMotion ? 0 : 100, visibility: 'visible' },
        {
          yPercent: 0,
          delay: reduceMotion ? 0 : INTRO_DURATION,
          duration: reduceMotion ? 0 : CAPTION_DURATION,
          ease: CAPTION_EASE,
          stagger: CAPTION_STAGGER
        }
      )
    },
    { dependencies: [isVisible], scope: containerRef }
  )

  return {
    refs: { containerRef }
  }
}
