import { useGSAP } from '@gsap/react'
import { type ThreeEvent, useFrame, useThree } from '@react-three/fiber'
import { usePreferredReducedMotion, useUnmount } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { type RefObject, useState } from 'react'
import { MathUtils } from 'three'

import type { LogoDockProgress } from '@/hooks/useLogoDockScroll'
import { cursorStore } from '@/stores/cursor'

gsap.registerPlugin(useGSAP)

const GLOW_IN_DURATION = 1.4
const GLOW_OUT_DURATION = 0.8
const GLOW_EASE = 'sine.inOut'
const DOCK_WHITEN_START = 0.7

export interface UseLogoGlowParams {
  dockProgressRef: RefObject<LogoDockProgress>
}

export const useLogoGlow = ({ dockProgressRef }: UseLogoGlowParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const [uniforms] = useState(() => ({ uHover: { value: 0 }, uDock: { value: 0 } }))

  const invalidate = useThree(state => state.invalidate)

  const { contextSafe } = useGSAP()

  // Leaving the page while hovering must not keep the cursor follower hidden
  useUnmount(() => cursorStore.set({ isOverLogo: false }))

  useFrame(() => {
    const whiten = MathUtils.smoothstep(dockProgressRef.current.value, DOCK_WHITEN_START, 1)
    uniforms.uDock.value = whiten
  })

  const setHover = contextSafe((event: ThreeEvent<PointerEvent>, isOver: boolean) => {
    if (event.pointerType !== 'mouse') return

    cursorStore.set({ isOverLogo: isOver })
    gsap.to(uniforms.uHover, {
      value: isOver ? 1 : 0,
      duration: reduceMotion ? 0 : isOver ? GLOW_IN_DURATION : GLOW_OUT_DURATION,
      ease: GLOW_EASE,
      overwrite: true,
      onUpdate: () => invalidate()
    })
  })

  return {
    state: { uniforms },
    functions: {
      onPointerOver: (event: ThreeEvent<PointerEvent>) => setHover(event, true),
      onPointerOut: (event: ThreeEvent<PointerEvent>) => setHover(event, false)
    }
  }
}
