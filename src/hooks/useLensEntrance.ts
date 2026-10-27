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
  // Comes in every time this turns true (the service is shown and on screen), leaves when it turns
  // false
  isPlaying: boolean
}

// The paper grows smoothly out of its own middle, then the cut-out rises from below; leaving runs
// it backwards. Both tween from wherever the view is, so a switch halfway through never jumps:
// that is also why the context isn't reverted on update (reverting snaps the view back to 0)
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
