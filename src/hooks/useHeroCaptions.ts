import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'

import { INTRO_DURATION, LINE_REVEAL_DURATION, LINE_REVEAL_EASE } from '@/config/animation'

gsap.registerPlugin(useGSAP, SplitText)

const CAPTION_SELECTOR = '[data-hero-caption]'
const SLOGAN_SELECTOR = '[data-hero-slogan]'

export interface UseHeroCaptionsParams {
  isVisible: boolean
}

export const useHeroCaptions = ({ isVisible }: UseHeroCaptionsParams) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (!isVisible) return

      const reveal = {
        yPercent: 0,
        delay: reduceMotion ? 0 : INTRO_DURATION,
        duration: reduceMotion ? 0 : LINE_REVEAL_DURATION,
        ease: LINE_REVEAL_EASE
      }

      gsap.fromTo(
        CAPTION_SELECTOR,
        { yPercent: reduceMotion ? 0 : 100, visibility: 'visible' },
        reveal
      )

      const slogan = containerRef.current?.querySelector(SLOGAN_SELECTOR)
      if (!slogan) return
      gsap.set(slogan, { visibility: 'visible' })
      // All words rise together, each from under its own line. autoSplit re-splits when the font
      // loads or the width changes; the returned tween keeps its progress across re-splits
      SplitText.create(slogan, {
        type: 'lines,words',
        mask: 'lines',
        // Whole words read fine as they are; aria-label isn't allowed on the span inside the h1
        aria: 'none',
        autoSplit: true,
        onSplit: split => gsap.fromTo(split.words, { yPercent: reduceMotion ? 0 : 100 }, reveal)
      })
    },
    { dependencies: [isVisible], scope: containerRef }
  )

  return {
    refs: { containerRef }
  }
}
