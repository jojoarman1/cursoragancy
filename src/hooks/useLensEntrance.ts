import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import type { RefObject } from 'react'

import { LENS_ENTRANCE } from '@/config/lens'
import type { LensView } from '@/lib/lensCollage'

gsap.registerPlugin(useGSAP)

export interface UseLensEntranceParams {
  viewRef: RefObject<LensView>
  redraw: () => void
  // Plays every time this turns true: the service became the shown one
  isPlaying: boolean
}

// The paper grows smoothly out of its own middle, then the cut-out rises from below
export const useLensEntrance = ({ viewRef, redraw, isPlaying }: UseLensEntranceParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (!isPlaying) return
      const view = viewRef.current
      if (reduceMotion) {
        Object.assign(view, { paper: 1, cutout: 1 })
        redraw()
        return
      }

      gsap
        .timeline({ onUpdate: redraw })
        .fromTo(
          view,
          { paper: 0 },
          { paper: 1, duration: LENS_ENTRANCE.paperDuration, ease: LENS_ENTRANCE.paperEase }
        )
        .fromTo(
          view,
          { cutout: 0 },
          {
            cutout: 1,
            duration: LENS_ENTRANCE.cutoutDuration,
            ease: LENS_ENTRANCE.cutoutEase,
            immediateRender: false
          },
          LENS_ENTRANCE.cutoutDelay
        )
    },
    { dependencies: [isPlaying, reduceMotion], revertOnUpdate: true }
  )
}
