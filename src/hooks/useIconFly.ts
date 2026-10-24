import { useGSAP } from '@gsap/react'
import { useEventListener, usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { type RefObject, useRef } from 'react'

gsap.registerPlugin(useGSAP)

const ICON_SELECTOR = '[data-fly-icon]'
// Past the clip's edge, so the icon is fully hidden before it comes back
const ICON_OFFSET = 120
const ICON_OUT_DURATION = 0.25
const ICON_IN_DURATION = 0.4

export interface UseIconFlyParams {
  targetRef: RefObject<HTMLElement | null>
}

// On hover the [data-fly-icon] inside the target flies out up and to the right of its clip and
// comes back from the opposite corner. A started flight always finishes
export const useIconFly = ({ targetRef }: UseIconFlyParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const timelineRef = useRef<gsap.core.Timeline>(null)

  const { contextSafe } = useGSAP({ scope: targetRef })

  const launchIcon = contextSafe(() => {
    if (timelineRef.current?.isActive()) return

    timelineRef.current = gsap
      .timeline()
      .to(ICON_SELECTOR, {
        xPercent: ICON_OFFSET,
        yPercent: -ICON_OFFSET,
        duration: ICON_OUT_DURATION,
        ease: 'power2.in'
      })
      .set(ICON_SELECTOR, { xPercent: -ICON_OFFSET, yPercent: ICON_OFFSET })
      .to(ICON_SELECTOR, {
        xPercent: 0,
        yPercent: 0,
        duration: ICON_IN_DURATION,
        ease: 'power3.out'
      })
  })

  useEventListener(targetRef, 'pointerenter', (event: PointerEvent) => {
    if (reduceMotion || event.pointerType !== 'mouse') return

    launchIcon()
  })
}
