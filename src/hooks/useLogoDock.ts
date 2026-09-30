import { useFrame, useThree } from '@react-three/fiber'
import { target, useEventListener } from '@siberiacancode/reactuse'
import { type RefObject, useRef } from 'react'
import { type Group, MathUtils } from 'three'

import { HEADER_LOGO_SELECTOR } from '@/config/dom'
import type { LogoDockProgress } from '@/hooks/useLogoDockScroll'
import { LOGO_CENTROID, LOGO_SVG_SIZE } from '@/lib/logoGeometry'

const WINDOW_TARGET = target(() => window)

export interface UseLogoDockParams {
  progressRef: RefObject<LogoDockProgress>
  // World units per logo unit of the mesh
  scale: number
}

// Moves the logo from the screen center into the header slot as the page scrolls
export const useLogoDock = ({ progressRef, scale }: UseLogoDockParams) => {
  const dockRef = useRef<Group>(null)
  const slotRef = useRef<Element | null>(null)
  const lastProgressRef = useRef(-1)
  const invalidate = useThree(state => state.invalidate)

  // The scene renders on demand: scrolling moves the logo, so it needs frames
  useEventListener(WINDOW_TARGET, 'scroll', () => invalidate(), { passive: true })

  useFrame(({ size, viewport }) => {
    const dock = dockRef.current
    if (!dock) return

    slotRef.current ??= document.querySelector(HEADER_LOGO_SELECTOR)
    const slot = slotRef.current
    const progress = progressRef.current.value

    // The scroll progress may update after this frame was requested: keep rendering until it stops
    if (progress !== lastProgressRef.current) {
      lastProgressRef.current = progress
      invalidate()
    }

    if (!slot || progress === 0) {
      dock.position.set(0, 0, 0)
      dock.scale.setScalar(1)
      return
    }

    // The mesh origin is the logo centroid, so aim at the centroid of the SVG in the slot
    const rect = slot.getBoundingClientRect()
    const centroidX = rect.left + (rect.width * LOGO_CENTROID.x) / LOGO_SVG_SIZE
    const centroidY = rect.top + (rect.height * LOGO_CENTROID.y) / LOGO_SVG_SIZE

    // A straight line from the screen center to the slot (the scroll timing keeps it centered in
    // the visible part of the hero, see useLogoDockScroll)
    const x = MathUtils.lerp(size.width / 2, centroidX, progress)
    const y = MathUtils.lerp(size.height / 2, centroidY, progress)

    // Screen pixels → world units on the logo plane (z = 0), measured from the screen center
    const unitsPerPixel = viewport.width / size.width
    const targetScale = (rect.width * unitsPerPixel) / (LOGO_SVG_SIZE * scale)

    dock.position.set(
      (x - size.width / 2) * unitsPerPixel,
      -(y - size.height / 2) * unitsPerPixel,
      0
    )
    dock.scale.setScalar(MathUtils.lerp(1, targetScale, progress))
  })

  return {
    refs: { dockRef }
  }
}
