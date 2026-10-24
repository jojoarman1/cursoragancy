import { useGSAP } from '@gsap/react'
import { useEventListener, usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { type RefObject, useRef } from 'react'

import { useIconFly } from './useIconFly'

gsap.registerPlugin(useGSAP)

const CHAR_SELECTOR = '[data-button-char]'
const CHAR_CLONE_SELECTOR = '[data-button-char-clone]'

const CHAR_DURATION = 0.45
// Eases in as well, so the fall doesn't start with a jolt
const CHAR_EASE = 'power2.inOut'
const CHAR_STAGGER = 0.045
// Beyond one line: descenders like "р" stick out of the 1:1 line box and would peek in
const CHAR_SHIFT = 130

export interface UseTileButtonHoverParams {
  buttonRef: RefObject<HTMLButtonElement | null>
}

// Animations always play to the end: quick hovers queue up instead of cutting a fall short
export const useTileButtonHover = ({ buttonRef }: UseTileButtonHoverParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const isHoveredRef = useRef(false)
  // Whether the hover copies (dropped in from above) are the visible letters
  const isSwappedRef = useRef(false)
  const labelTimelineRef = useRef<gsap.core.Timeline>(null)

  useIconFly({ targetRef: buttonRef })

  const { contextSafe } = useGSAP(() => gsap.set(CHAR_CLONE_SELECTOR, { yPercent: -CHAR_SHIFT }), {
    scope: buttonRef
  })

  // Brings the letters in line with the hover state once the running fall has finished.
  // The visible letters always leave downwards while the other copies drop in from above
  const syncLabel = contextSafe(() => {
    if (labelTimelineRef.current) return

    const isSwapping = isHoveredRef.current
    if (isSwapping === isSwappedRef.current) return

    const [leaving, entering] = isSwapping
      ? [CHAR_SELECTOR, CHAR_CLONE_SELECTOR]
      : [CHAR_CLONE_SELECTOR, CHAR_SELECTOR]
    const vars = { duration: CHAR_DURATION, ease: CHAR_EASE, stagger: CHAR_STAGGER }

    labelTimelineRef.current = gsap
      .timeline({
        onComplete: () => {
          isSwappedRef.current = isSwapping
          labelTimelineRef.current = null
          syncLabel()
        }
      })
      .to(leaving, { ...vars, yPercent: CHAR_SHIFT }, 0)
      .fromTo(entering, { yPercent: -CHAR_SHIFT }, { ...vars, yPercent: 0 }, 0)
  })

  useEventListener(buttonRef, 'pointerenter', (event: PointerEvent) => {
    if (reduceMotion || event.pointerType !== 'mouse') return

    isHoveredRef.current = true
    syncLabel()
  })

  useEventListener(buttonRef, 'pointerleave', (event: PointerEvent) => {
    if (reduceMotion || event.pointerType !== 'mouse') return

    isHoveredRef.current = false
    syncLabel()
  })
}
