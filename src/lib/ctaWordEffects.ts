import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'

import type { CtaWordEffect } from '@/config/cta'

gsap.registerPlugin(SplitText)

const DURATION = 1.1
const EASE = 'expo.out'
const CHAR_STAGGER = 0.035

// One tween per effect; each word clips itself where its effect moves it in from outside
export const createCtaWordTween = (word: HTMLElement, effect: CtaWordEffect) => {
  const base = { duration: DURATION, ease: EASE }

  switch (effect) {
    case 'rise':
      return gsap.from(word, { ...base, yPercent: 110 })
    case 'drop':
      return gsap.from(word, { ...base, yPercent: -110 })
    case 'slide':
      return gsap.from(word, { ...base, xPercent: 105 })
    case 'focus':
      return gsap.from(word, { ...base, opacity: 0, scale: 1.15, filter: 'blur(16px)' })
    case 'cascade':
      return gsap.from(SplitText.create(word, { type: 'chars' }).chars, {
        ...base,
        yPercent: 110,
        stagger: CHAR_STAGGER
      })
    case 'flip':
      return gsap.from(SplitText.create(word, { type: 'chars' }).chars, {
        ...base,
        rotationX: -90,
        opacity: 0,
        transformOrigin: '50% 100%',
        stagger: CHAR_STAGGER
      })
  }
}
