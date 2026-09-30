import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'

import { HEADER_LOGO_SELECTOR } from '@/config/dom'
import { LOGO_CENTROID, LOGO_SVG_SIZE } from '@/lib/logoGeometry'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const ARRIVAL_SPEED = 0.98

export interface LogoDockProgress {
  value: number
}

export const useLogoDockScroll = () => {
  const progressRef = useRef<LogoDockProgress>({ value: 0 })
  const [isDocked, setIsDocked] = useState(false)

  useGSAP((_context, contextSafe) => {
    const headerLogo = document.querySelector(HEADER_LOGO_SELECTOR)
    if (!headerLogo || !contextSafe) return

    const updateDock = contextSafe((scrollProgress: number) => {
      // Arrives when the center of the still-visible hero reaches the slot, so on the way the
      // logo stays centered in the dark area and never overlaps the next section
      const rect = headerLogo.getBoundingClientRect()
      const slotCentroidY = rect.top + (rect.height * LOGO_CENTROID.y) / LOGO_SVG_SIZE
      const arriveAt = (1 - (2 * slotCentroidY) / window.innerHeight) * ARRIVAL_SPEED
      const dockProgress = gsap.utils.clamp(0, 1, scrollProgress / arriveAt)
      const isArrived = dockProgress >= 1

      progressRef.current.value = dockProgress
      // Fading in before arrival would show both logos side by side
      gsap.set(headerLogo, { autoAlpha: isArrived ? 1 : 0 })
      setIsDocked(isArrived)
    })

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
