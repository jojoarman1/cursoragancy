import { useIntersectionObserver } from '@siberiacancode/reactuse'
import { useEffect, useRef, useState } from 'react'

import type { ServiceArt } from '@/config/services'
import { createLensCollage, type LensCollage, type LensView } from '@/lib/lensCollage'
import { loadImage } from '@/lib/loadImage'

import { useLensEntrance } from './useLensEntrance'
import { useLensParallax } from './useLensParallax'

// Share of the collage on screen before it comes in
const IN_VIEW_THRESHOLD = 0.35

export interface UseLensCollageParams {
  art: ServiceArt
  // The shown service: its collage comes in and follows the pointer
  isActive: boolean
}

// Loads both layers and keeps the lens collage drawn at the canvas size; once it is the shown
// service and on screen, the entrance and the pointer parallax change the view and redraw it
export const useLensCollage = ({ art, isActive }: UseLensCollageParams) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const collageRef = useRef<LensCollage>(null)
  // Starts hidden, so nothing flashes before the entrance plays
  const viewRef = useRef<LensView>({ offset: { x: 0, y: 0 }, paper: 0, cutout: 0 })
  const [isSupported, setIsSupported] = useState(true)
  const [isReady, setIsReady] = useState(false)

  const redraw = () => collageRef.current?.render(viewRef.current)

  // WebGL and a ResizeObserver are external systems, which is what an effect is for
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let resizeObserver: ResizeObserver | undefined
    let isCancelled = false

    Promise.all([loadImage(art.background), art.foreground ? loadImage(art.foreground) : null])
      .then(([background, foreground]) => {
        if (isCancelled) return
        const collage = createLensCollage(canvas, {
          background,
          foreground,
          isSheet: !!art.isSheet
        })
        if (!collage) {
          setIsSupported(false)
          return
        }
        collageRef.current = collage
        resizeObserver = new ResizeObserver(() => {
          collage.resize()
          collage.render(viewRef.current)
        })
        resizeObserver.observe(canvas)
        setIsReady(true)
      })
      .catch(() => {
        if (!isCancelled) setIsSupported(false)
      })

    return () => {
      isCancelled = true
      resizeObserver?.disconnect()
      collageRef.current?.dispose()
      collageRef.current = null
    }
  }, [art.background, art.foreground, art.isSheet])

  // Comes in when scrolled to, not as soon as the page loads; leaving and coming back replays it
  const intersectionObserver = useIntersectionObserver(canvasRef, { threshold: IN_VIEW_THRESHOLD })
  const isInView = !!intersectionObserver.entries?.[0]?.isIntersecting

  const isShown = isReady && isActive && isInView
  useLensEntrance({ viewRef, redraw, isPlaying: isShown })
  useLensParallax({ viewRef, redraw, isEnabled: isShown })

  return {
    state: { isSupported },
    refs: { canvasRef }
  }
}
