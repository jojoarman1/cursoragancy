import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef } from 'react'

import { CTA_WORD_EFFECTS, type CtaWordEffect } from '@/config/cta'
import { createCtaWordTween } from '@/lib/ctaWordEffects'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const WORD_SELECTOR = '[data-cta-word]'
const DETAIL_SELECTOR = '[data-cta-detail]'
// Each word starts this long after the previous one
const WORD_GAP = 0.18
const DETAIL_DURATION = 1.1

const isWordEffect = (value: string | undefined): value is CtaWordEffect =>
  CTA_WORD_EFFECTS.some(effect => effect === value)

// Once the section is well in view, the heading's words come in one after another, each with its
// own effect, then the button and the quote follow. Plays once
export const useCtaReveal = () => {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (reduceMotion) return

      const timeline = gsap.timeline({
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', once: true }
      })
      gsap.utils.toArray<HTMLElement>(WORD_SELECTOR).forEach((word, index) => {
        const { effect } = word.dataset
        if (isWordEffect(effect)) timeline.add(createCtaWordTween(word, effect), index * WORD_GAP)
      })
      timeline.from(
        DETAIL_SELECTOR,
        { yPercent: 40, autoAlpha: 0, duration: DETAIL_DURATION, ease: 'expo.out', stagger: 0.1 },
        '-=0.7'
      )
    },
    { dependencies: [reduceMotion], scope: sectionRef, revertOnUpdate: true }
  )

  return {
    refs: { sectionRef }
  }
}
