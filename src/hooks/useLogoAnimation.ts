import { useGSAP } from '@gsap/react'
import { useFrame, useThree } from '@react-three/fiber'
import { target, useEventListener, usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { type RefObject, useRef } from 'react'
import { type Group, MathUtils, type Mesh } from 'three'

import { INTRO_DURATION, INTRO_EASE } from '@/config/animation'
import type { LogoDockProgress } from '@/hooks/useLogoDockScroll'

gsap.registerPlugin(useGSAP)

// Share of the smaller viewport side the logo takes up
const VIEWPORT_FILL = 0.45
// The scene renders on demand: the tilt keeps requesting frames until it's this close to its target
const TILT_SETTLED = 0.0005

const WINDOW_TARGET = target(() => window)

export interface UseLogoAnimationParams {
  isVisible: boolean
  size: number
  // Scroll dock progress: the tilt fades out while the logo flies into the header
  dockProgressRef: RefObject<LogoDockProgress>
  onReady: () => void
}

export const useLogoAnimation = ({
  isVisible,
  size,
  dockProgressRef,
  onReady
}: UseLogoAnimationParams) => {
  const appearRef = useRef<Group>(null)
  const meshRef = useRef<Mesh>(null)
  const isReadyRef = useRef(false)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const viewport = useThree(state => state.viewport)
  const invalidate = useThree(state => state.invalidate)
  const scale = (Math.min(viewport.width, viewport.height) * VIEWPORT_FILL) / size

  useGSAP(
    () => {
      const appear = appearRef.current
      if (!appear || !isVisible) return

      gsap.to(appear.scale, {
        x: 1,
        y: 1,
        z: 1,
        duration: reduceMotion ? 0 : INTRO_DURATION,
        ease: INTRO_EASE,
        onUpdate: () => invalidate()
      })
    },
    { dependencies: [isVisible, reduceMotion] }
  )

  // A pointer move changes the tilt target, so the scene needs a new frame
  useEventListener(WINDOW_TARGET, 'pointermove', () => invalidate(), { passive: true })

  useFrame(({ pointer }, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    // The first frame compiles the shaders, so the scene is ready after it
    if (!isReadyRef.current) {
      isReadyRef.current = true
      onReady()
    }

    if (reduceMotion) return

    const tilt = 1 - dockProgressRef.current.value
    const targetX = -pointer.y * 0.4 * tilt
    const targetY = pointer.x * 0.6 * tilt
    mesh.rotation.x = MathUtils.damp(mesh.rotation.x, targetX, 4, delta)
    mesh.rotation.y = MathUtils.damp(mesh.rotation.y, targetY, 4, delta)

    const isSettled =
      Math.abs(mesh.rotation.x - targetX) < TILT_SETTLED &&
      Math.abs(mesh.rotation.y - targetY) < TILT_SETTLED
    if (!isSettled) invalidate()
  })

  return {
    state: { scale },
    refs: { appearRef, meshRef }
  }
}
