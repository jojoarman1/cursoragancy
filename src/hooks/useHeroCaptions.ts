import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { INTRO_DURATION, LINE_REVEAL_DURATION, LINE_REVEAL_EASE } from '@/config/animation'

gsap.registerPlugin(useGSAP)

const CAPTION_SELECTOR = '[data-hero-caption]'

export interface UseHeroCaptionsParams {
  isVisible: boolean
}

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
          duration: reduceMotion ? 0 : LINE_REVEAL_DURATION,
          ease: LINE_REVEAL_EASE
        }
      )
    },
    { dependencies: [isVisible], scope: containerRef }
  )

  return {
    refs: { containerRef }
  }
}
