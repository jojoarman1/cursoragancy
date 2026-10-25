import { useGSAP } from '@gsap/react'
import {
  target,
  useEventListener,
  usePreferredReducedMotion,
  useUnmount
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef, useState } from 'react'

import { FIGMA_ABERRATION, FIGMA_CENTER, PRISM_ABERRATION_SCALE } from '@/config/prism'
import { damp } from '@/lib/damp'
import { createPrismState } from '@/lib/prismState'

import { usePrismRenderer } from './usePrismRenderer'

gsap.registerPlugin(useGSAP)

// The plain dark word fades in first, then the effect grows
const FADE_DURATION = 1.2
const FADE_EASE = 'power2.out'
const EFFECT_DELAY = 0.3
const EFFECT_DURATION = 2.5
const EFFECT_EASE = 'power2.inOut'
// Share of the way from the Figma point to the pointer that the effect's centre moves
const CENTER_FOLLOW = 0.15
const CENTER_DAMPING = 4
const CENTER_SETTLED = 0.0001
// After a pause the first step uses at most this much time instead of jumping the whole way
const MAX_FOLLOW_DELTA = 1 / 30

const WINDOW_TARGET = target(() => window)

export interface UsePrismTitleParams {
  text: string
  isRevealed: boolean
  onReady?: () => void
}

export const usePrismTitle = ({ text, isRevealed, onReady }: UsePrismTitleParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const [state] = useState(createPrismState)
  const baseCenterRef = useRef({ ...state.center })
  const pointerRef = useRef({ x: 0, y: 0 })
  const followRef = useRef({ frame: 0, time: 0 })

  const renderer = usePrismRenderer({
    text,
    state,
    onDrawn: (textBox, canvas) => {
      // Figma measures the centre from the text box's top; uv runs bottom-up
      baseCenterRef.current.y = 1 - (textBox.top + textBox.height * FIGMA_CENTER.y) / canvas.height
      Object.assign(state.center, baseCenterRef.current)
    },
    onFirstFrame: onReady
  })

  useGSAP(
    () => {
      if (!isRevealed) return

      const timeline = gsap
        .timeline({ onUpdate: renderer.functions.requestRender })
        .to(state, { opacity: 1, duration: FADE_DURATION, ease: FADE_EASE })
        .to(
          state,
          {
            aberration: FIGMA_ABERRATION * PRISM_ABERRATION_SCALE,
            duration: EFFECT_DURATION,
            ease: EFFECT_EASE
          },
          `+=${EFFECT_DELAY}`
        )

      if (reduceMotion) timeline.progress(1)
    },
    { dependencies: [isRevealed] }
  )

  const follow = (time: number) => {
    const canvas = renderer.refs.canvasRef.current
    if (!canvas) {
      followRef.current.frame = 0
      return
    }

    const rect = canvas.getBoundingClientRect()
    const base = baseCenterRef.current
    const pointerX = (pointerRef.current.x - rect.left) / rect.width
    const pointerY = 1 - (pointerRef.current.y - rect.top) / rect.height
    const targetX = base.x + (pointerX - base.x) * CENTER_FOLLOW
    const targetY = base.y + (pointerY - base.y) * CENTER_FOLLOW
    const delta = Math.min((time - followRef.current.time) / 1000, MAX_FOLLOW_DELTA)
    state.center.x = damp(state.center.x, targetX, CENTER_DAMPING, delta)
    state.center.y = damp(state.center.y, targetY, CENTER_DAMPING, delta)
    followRef.current.time = time
    // Drawn in this same frame: a requested render would land a frame late and judder
    renderer.functions.render()

    const isSettled =
      Math.abs(state.center.x - targetX) < CENTER_SETTLED &&
      Math.abs(state.center.y - targetY) < CENTER_SETTLED
    followRef.current.frame = isSettled ? 0 : requestAnimationFrame(follow)
  }

  useEventListener(
    WINDOW_TARGET,
    'pointermove',
    (event: PointerEvent) => {
      pointerRef.current = { x: event.clientX, y: event.clientY }
      if (!followRef.current.frame) followRef.current.frame = requestAnimationFrame(follow)
    },
    { passive: true, enabled: isRevealed }
  )

  useUnmount(() => cancelAnimationFrame(followRef.current.frame))

  return {
    state: { isSupported: renderer.state.isSupported },
    refs: { canvasRef: renderer.refs.canvasRef }
  }
}
