import { useGSAP } from '@gsap/react'
import {
  target,
  useEventListener,
  useMediaQuery,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { useIsOverLogo } from '@/stores/cursor'

gsap.registerPlugin(useGSAP)

// Only for a real mouse: touch screens have no cursor to follow
const FINE_POINTER_QUERY = '(hover: hover) and (pointer: fine)'
// Short lag: the circle stays right next to the cursor
const FOLLOW_DURATION = 0.01
const FOLLOW_EASE = 'power3.out'
const TOGGLE_DURATION = 0.2
// Over the 3D logo the circle shrinks away, as if the glass absorbs it
const ABSORB_DURATION = 0.4

const DOCUMENT_TARGET = target(() => document)
const ROOT_TARGET = target(() => document.documentElement)

export const useCursorFollower = () => {
  const followerRef = useRef<HTMLDivElement>(null)
  const moveRef = useRef<{ x: gsap.QuickToFunc; y: gsap.QuickToFunc }>(null)
  const isShownRef = useRef(false)
  const isEnabled = useMediaQuery(FINE_POINTER_QUERY)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const isOverLogo = useIsOverLogo()

  useGSAP(
    () => {
      gsap.to(followerRef.current, {
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

  const toggle = contextSafe((isShown: boolean) => {
    isShownRef.current = isShown
    gsap.to(followerRef.current, { autoAlpha: isShown ? 1 : 0, duration: TOGGLE_DURATION })
  })

  useEventListener(
    DOCUMENT_TARGET,
    'pointermove',
    event => {
      const follower = followerRef.current
      const move = moveRef.current
      if (!follower || !move) return

      // First move after appearing: jump to the pointer instead of flying in from the corner
      if (!isShownRef.current) {
        gsap.set(follower, { x: event.clientX, y: event.clientY })
        toggle(true)
      }

      move.x(event.clientX)
      move.y(event.clientY)
    },
    { enabled: isEnabled, passive: true }
  )

  useEventListener(ROOT_TARGET, 'mouseleave', () => toggle(false), { enabled: isEnabled })

  return {
    state: { isEnabled },
    refs: { followerRef }
  }
}
