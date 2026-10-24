import { useGSAP } from '@gsap/react'
import { useFrame, useThree } from '@react-three/fiber'
import { target, useEventListener, usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef, useState } from 'react'
import { MathUtils, Vector2 } from 'three'

import {
  FIGMA_ABERRATION,
  FIGMA_CENTER,
  PRISM_ABERRATION_SCALE,
  PRISM_FONT_SIZES,
  type PrismFontSizes
} from '@/config/prism'
import { createPrismUniforms } from '@/lib/prismUniforms'

import { usePrismTexture } from './usePrismTexture'

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

const WINDOW_TARGET = target(() => window)

export interface UsePrismTitleParams {
  text: string
  isRevealed: boolean
  isInverted?: boolean
  fontSizes?: PrismFontSizes
  onReady?: () => void
}

export const usePrismTitle = ({
  text,
  isRevealed,
  isInverted = false,
  fontSizes = PRISM_FONT_SIZES,
  onReady
}: UsePrismTitleParams) => {
  const invalidate = useThree(state => state.invalidate)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  // The inverted (menu) title is greyscale, as in the design
  const [uniforms] = useState(() => createPrismUniforms(isInverted ? 0 : undefined))
  const isReadyRef = useRef(false)
  const baseCenterRef = useRef(new Vector2(FIGMA_CENTER.x, 0.5))

  const prismTexture = usePrismTexture({
    text,
    isInverted,
    fontSizes,
    uniforms,
    onDrawn: (textBox, canvas) => {
      // Figma measures the centre from the text box's top; uv runs bottom-up
      baseCenterRef.current.y = 1 - (textBox.top + textBox.height * FIGMA_CENTER.y) / canvas.height
      uniforms.uCenter.value.copy(baseCenterRef.current)
    }
  })

  useGSAP(
    () => {
      if (!isRevealed) return

      const timeline = gsap
        .timeline({ onUpdate: () => invalidate() })
        .to(uniforms.uOpacity, { value: 1, duration: FADE_DURATION, ease: FADE_EASE })
        .to(
          uniforms.uAberration,
          {
            value: FIGMA_ABERRATION * PRISM_ABERRATION_SCALE,
            duration: EFFECT_DURATION,
            ease: EFFECT_EASE
          },
          `+=${EFFECT_DELAY}`
        )

      if (reduceMotion) timeline.progress(1)
    },
    { dependencies: [isRevealed] }
  )

  // On-demand rendering: without a frame request the pointer would never reach useFrame
  useEventListener(WINDOW_TARGET, 'pointermove', () => invalidate(), { passive: true })

  useFrame(({ pointer }, delta) => {
    if (!uniforms.uText.value) return

    if (!isReadyRef.current) {
      isReadyRef.current = true
      onReady?.()
    }

    const center = uniforms.uCenter.value
    const base = baseCenterRef.current
    const targetX = base.x + ((pointer.x + 1) / 2 - base.x) * CENTER_FOLLOW
    const targetY = base.y + ((pointer.y + 1) / 2 - base.y) * CENTER_FOLLOW
    center.x = MathUtils.damp(center.x, targetX, CENTER_DAMPING, delta)
    center.y = MathUtils.damp(center.y, targetY, CENTER_DAMPING, delta)

    const isSettled =
      Math.abs(center.x - targetX) < CENTER_SETTLED && Math.abs(center.y - targetY) < CENTER_SETTLED
    if (!isSettled) invalidate()
  })

  return {
    state: { uniforms, size: prismTexture.state.size }
  }
}
