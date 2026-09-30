import { useGSAP } from '@gsap/react'
import {
  target,
  useEventListener,
  useMediaQuery,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { cursorStore, useIsOverLogo } from '@/stores/cursor'

gsap.registerPlugin(useGSAP)

const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
const FOLLOW_DURATION = 0.01
const FOLLOW_EASE = 'power3.out'
const TOGGLE_DURATION = 0.2
const ABSORB_DURATION = 0.4
const PRESS_SCALE = 0.6
const PRESS_DURATION = 0.2

const INTERACTIVE_SELECTOR = 'a[href], button:not(:disabled), [role="button"]'
const FILLED_COLOR = 'rgba(255, 255, 255, 1)'
// Leaves only the inset ring from the follower's class
const OUTLINE_COLOR = 'rgba(255, 255, 255, 0)'
const OUTLINE_GROWTH = 1.75
const OUTLINE_DURATION = 0.3
// Lets the page settle after a click (buttons hide, chips get replaced) before rechecking
const CLICK_RECHECK_DELAY = 0.1

const DOCUMENT_TARGET = target(() => document)
const ROOT_TARGET = target(() => document.documentElement)

export const useCursorFollower = () => {
  const followerRef = useRef<HTMLDivElement>(null)
  const moveRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc }>(null)
  const isShownRef = useRef(false)
  const isOutlinedRef = useRef(false)
  const baseSizeRef = useRef(0)
  const pointerRef = useRef({ x: 0, y: 0 })
  const isEnabled = useMediaQuery(FINE_POINTER_QUERY)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const isOverLogo = useIsOverLogo()

  useGSAP(
    () => {
      const follower = followerRef.current
      if (!follower) return

      gsap.to(follower, {
        scale: isOverLogo ? 0 : 1,
        duration: reduceMotion ? 0 : ABSORB_DURATION,
        ease: 'power2.out'
      })
    },
    { dependencies: [isOverLogo, reduceMotion, isEnabled] }
  )

  const { contextSafe } = useGSAP(
    () => {
      const follower = followerRef.current
      if (!follower) return

      gsap.set(follower, { xPercent: -50, yPercent: -50 })

      const duration = reduceMotion ? 0 : FOLLOW_DURATION
      moveRef.current = {
        x: gsap.quickTo(follower, 'x', { duration, ease: FOLLOW_EASE }),
        y: gsap.quickTo(follower, 'y', { duration, ease: FOLLOW_EASE })
      }
    },
    { dependencies: [isEnabled, reduceMotion] }
  )

  const setOutlined = contextSafe((isOutlined: boolean) => {
    const follower = followerRef.current
    if (!follower || isOutlined === isOutlinedRef.current) return

    // Width, not scale: scale would thicken the 1px ring, and the logo already tweens it
    if (!follower.style.width) baseSizeRef.current = follower.offsetWidth
    const size = isOutlined ? baseSizeRef.current * OUTLINE_GROWTH : baseSizeRef.current

    isOutlinedRef.current = isOutlined
    gsap.to(follower, {
      width: size,
      height: size,
      backgroundColor: isOutlined ? OUTLINE_COLOR : FILLED_COLOR,
      duration: reduceMotion ? 0 : OUTLINE_DURATION,
      ease: 'power2.out',
      overwrite: 'auto',
      // Back to the class size, which follows the rem scale on resize
      clearProps: isOutlined ? '' : 'width,height'
    })
  })

  const recheckOutline = contextSafe(() => {
    const { x, y } = pointerRef.current
    setOutlined(Boolean(document.elementFromPoint(x, y)?.closest(INTERACTIVE_SELECTOR)))
  })

  const toggle = contextSafe((isShown: boolean) => {
    const follower = followerRef.current
    if (!follower) return

    isShownRef.current = isShown
    gsap.to(follower, { autoAlpha: isShown ? 1 : 0, duration: TOGGLE_DURATION })
  })

  useEventListener(
    DOCUMENT_TARGET,
    'pointermove',
    (event: PointerEvent) => {
      const follower = followerRef.current
      const move = moveRef.current
      if (!follower || !move) return

      // Jump to the pointer instead of flying in from the corner
      if (!isShownRef.current) {
        gsap.set(follower, { x: event.clientX, y: event.clientY })
        toggle(true)
      }

      pointerRef.current = { x: event.clientX, y: event.clientY }
      move.x(event.clientX)
      move.y(event.clientY)

      const element = event.target instanceof Element ? event.target : null
      setOutlined(Boolean(element?.closest(INTERACTIVE_SELECTOR)))
    },
    { enabled: isEnabled, passive: true }
  )

  // Elements move under a still pointer when something scrolls
  useEventListener(DOCUMENT_TARGET, 'scroll', recheckOutline, {
    enabled: isEnabled,
    passive: true,
    capture: true
  })

  useEventListener(
    DOCUMENT_TARGET,
    'click',
    () => gsap.delayedCall(CLICK_RECHECK_DELAY, recheckOutline),
    { enabled: isEnabled, capture: true }
  )

  const press = contextSafe((isPressed: boolean) => {
    // Over the logo the follower is already absorbed to 0
    if (cursorStore.get().isOverLogo) return

    gsap.to(followerRef.current, {
      scale: isPressed ? PRESS_SCALE : 1,
      duration: reduceMotion ? 0 : PRESS_DURATION,
      ease: 'power2.out'
    })
  })

  useEventListener(DOCUMENT_TARGET, 'pointerdown', () => press(true), { enabled: isEnabled })
  useEventListener(DOCUMENT_TARGET, 'pointerup', () => press(false), { enabled: isEnabled })

  useEventListener(ROOT_TARGET, 'mouseleave', () => toggle(false), { enabled: isEnabled })

  return {
    state: { isEnabled },
    refs: { followerRef }
  }
}
