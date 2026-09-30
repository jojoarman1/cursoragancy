import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'

import { HEADER_LOGO_SELECTOR } from '@/config/dom'
import { LOGO_CENTROID, LOGO_SVG_SIZE } from '@/lib/logoGeometry'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Share of the "stay centered" scroll distance the logo actually takes: below 1 it reaches the
// header sooner, running a little ahead of the dark area's center
const ARRIVAL_SPEED = 0.98

export interface LogoDockProgress {
  // Dock progress: 0 in the screen center → 1 in the header slot
  value: number
}

export const useLogoDockScroll = () => {
  // Read by the 3D scene every frame; React never re-renders for it
  const progressRef = useRef<LogoDockProgress>({ value: 0 })
  const [isDocked, setIsDocked] = useState(false)

  useGSAP((_context, contextSafe) => {
    const headerLogo = document.querySelector(HEADER_LOGO_SELECTOR)
    if (!headerLogo || !contextSafe) return

    const updateDock = contextSafe((scrollProgress: number) => {
      // The logo flies in a straight line from the screen center to the slot. The visible part
      // of the hero shrinks from below, so its center rises linearly with the scroll; the logo
      // keeps pace with that center and arrives when the center reaches the slot. So the logo
      // stays centered in the dark area all the way and never touches the next section
      const rect = headerLogo.getBoundingClientRect()
      const slotCentroidY = rect.top + (rect.height * LOGO_CENTROID.y) / LOGO_SVG_SIZE
      const arriveAt = (1 - (2 * slotCentroidY) / window.innerHeight) * ARRIVAL_SPEED
      const dockProgress = gsap.utils.clamp(0, 1, scrollProgress / arriveAt)
      const isArrived = dockProgress >= 1

      progressRef.current.value = dockProgress
      // Swapped at the moment of arrival, when the 3D logo lies exactly under the SVG one:
      // fading in earlier would show both logos side by side
      gsap.set(headerLogo, { autoAlpha: isArrived ? 1 : 0 })
      setIsDocked(isArrived)
    })

    // Progress 0 → 1 over the first screen (the hero), tied directly to the scroll position
    ScrollTrigger.create({
      start: 0,
      end: () => window.innerHeight,
      onUpdate: self => updateDock(self.progress),
      onRefresh: self => updateDock(self.progress)
    })
  })

  return {
    state: { isDocked },
    refs: { progressRef }
  }
}
