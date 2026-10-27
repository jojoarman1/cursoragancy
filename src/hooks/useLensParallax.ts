import {
  target,
  useEventListener,
  useMediaQuery,
  usePreferredReducedMotion,
  useUnmount
} from '@siberiacancode/reactuse'
import { type RefObject, useRef } from 'react'

import { LENS_PARALLAX_DAMPING } from '@/config/lens'
import { FINE_POINTER_QUERY } from '@/config/media'
import { damp } from '@/lib/damp'
import type { LensView } from '@/lib/lensCollage'

const WINDOW_TARGET = target(() => window)
const SETTLED = 0.0005
// After a pause the first step uses at most this much time instead of jumping
const MAX_DELTA = 1 / 30

export interface UseLensParallaxParams {
  viewRef: RefObject<LensView>
  redraw: () => void
  isEnabled: boolean
}

// With a mouse, eases the view's offset towards the pointer and redraws only while it moves
export const useLensParallax = ({ viewRef, redraw, isEnabled }: UseLensParallaxParams) => {
  const followRef = useRef({ target: { x: 0, y: 0 }, frame: 0, time: 0 })
  const isFinePointer = useMediaQuery(FINE_POINTER_QUERY)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  const step = (time: number) => {
    const follow = followRef.current
    const { offset } = viewRef.current
    const delta = Math.min((time - follow.time) / 1000, MAX_DELTA)
    follow.time = time
    offset.x = damp(offset.x, follow.target.x, LENS_PARALLAX_DAMPING, delta)
    offset.y = damp(offset.y, follow.target.y, LENS_PARALLAX_DAMPING, delta)
    redraw()

    const isSettled =
      Math.abs(offset.x - follow.target.x) < SETTLED &&
      Math.abs(offset.y - follow.target.y) < SETTLED
    follow.frame = isSettled ? 0 : requestAnimationFrame(step)
  }

  useEventListener(
    WINDOW_TARGET,
    'pointermove',
    (event: PointerEvent) => {
      const follow = followRef.current
      follow.target = {
        x: (event.clientX / window.innerWidth) * 2 - 1,
        y: (event.clientY / window.innerHeight) * 2 - 1
      }
      if (follow.frame) return
      follow.time = performance.now()
      follow.frame = requestAnimationFrame(step)
    },
    { passive: true, enabled: isEnabled && isFinePointer && !reduceMotion }
  )

  useUnmount(() => cancelAnimationFrame(followRef.current.frame))
}
