import { useGSAP } from '@gsap/react'
import { type ThreeEvent, useThree } from '@react-three/fiber'
import { usePreferredReducedMotion, useUnmount } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useState } from 'react'

import { cursorStore } from '@/stores/cursor'

gsap.registerPlugin(useGSAP)

const GLOW_IN_DURATION = 1.4
const GLOW_OUT_DURATION = 0.8
const GLOW_EASE = 'sine.inOut'

export const useLogoGlow = () => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const [uniforms] = useState(() => ({ uHover: { value: 0 } }))

  const invalidate = useThree(state => state.invalidate)

  const { contextSafe } = useGSAP()

  // Leaving the page while hovering must not keep the cursor follower hidden
  useUnmount(() => cursorStore.set({ isOverLogo: false }))

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
