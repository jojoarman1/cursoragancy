import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import type { RefObject } from 'react'

import { LENS_ENTRANCE, LENS_EXIT } from '@/config/lens'
import type { LensView } from '@/lib/lensCollage'

gsap.registerPlugin(useGSAP)

export interface UseLensEntranceParams {
  viewRef: RefObject<LensView>
  redraw: () => void
  isPlaying: boolean
}

// Not reverted on update: that would snap the paper back to 0 mid-switch
export const useLensEntrance = ({ viewRef, redraw, isPlaying }: UseLensEntranceParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      const view = viewRef.current
      gsap.killTweensOf(view)

      if (reduceMotion) {
        const progress = isPlaying ? 1 : 0
        Object.assign(view, { paper: progress, cutout: progress })
        redraw()
        return
      }

      if (!isPlaying) {
        if (view.paper === 0 && view.cutout === 0) return
        gsap.to(view, {
          paper: 0,
          cutout: 0,
          duration: LENS_EXIT.duration,
          ease: LENS_EXIT.ease,
          onUpdate: redraw
        })
        return
      }

      gsap.to(view, {
        paper: 1,
        duration: LENS_ENTRANCE.paperDuration,
        ease: LENS_ENTRANCE.paperEase,
        onUpdate: redraw
      })
      gsap.to(view, {
        cutout: 1,
        duration: LENS_ENTRANCE.cutoutDuration,
        ease: LENS_ENTRANCE.cutoutEase,
        delay: LENS_ENTRANCE.cutoutDelay,
        onUpdate: redraw
      })
    },
    { dependencies: [isPlaying, reduceMotion] }
  )
}
