import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const DOT_SELECTOR = '[data-label-dot]'
const TEXT_SELECTOR = '[data-label-text]'
const DOT_DURATION = 0.6
const DOT_EASE = 'back.out(2)'
const TEXT_DURATION = 0.9
const TEXT_EASE = 'expo.out'
// The text starts sliding before the dot has fully settled
const TEXT_OFFSET = '-=0.25'

// Once the label scrolls into view, the dot grows from nothing, then the text slides out to the
// right from under it. Plays once
export const useSectionLabelReveal = () => {
  const labelRef = useRef<HTMLHeadingElement>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (reduceMotion) return

      gsap
        .timeline({ scrollTrigger: { trigger: labelRef.current, start: 'top 90%', once: true } })
        .from(DOT_SELECTOR, { scale: 0, duration: DOT_DURATION, ease: DOT_EASE })
        .from(
          TEXT_SELECTOR,
          { xPercent: -105, duration: TEXT_DURATION, ease: TEXT_EASE },
          TEXT_OFFSET
        )
    },
    { dependencies: [reduceMotion], scope: labelRef, revertOnUpdate: true }
  )

  return {
    refs: { labelRef }
  }
}
