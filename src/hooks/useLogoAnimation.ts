import { useGSAP } from '@gsap/react'
import { useFrame, useThree } from '@react-three/fiber'
import { target, useEventListener, usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'
import { type Group, MathUtils, type Mesh } from 'three'

import { INTRO_DURATION, INTRO_EASE } from '@/config/animation'

gsap.registerPlugin(useGSAP)

const VIEWPORT_FILL = 0.45
const TILT_SETTLED = 0.0005
// One full turn around the vertical axis while the logo scales in
const INTRO_SPIN = Math.PI * 2

const WINDOW_TARGET = target(() => window)

export interface UseLogoAnimationParams {
  isVisible: boolean
  size: number
  onReady: () => void
}

export const useLogoAnimation = ({ isVisible, size, onReady }: UseLogoAnimationParams) => {
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

      gsap
        .timeline({
          defaults: { duration: reduceMotion ? 0 : INTRO_DURATION, ease: INTRO_EASE },
          onUpdate: () => invalidate()
        })
        .to(appear.scale, { x: 1, y: 1, z: 1 })
        .fromTo(appear.rotation, { y: -INTRO_SPIN }, { y: 0 }, 0)
    },
    { dependencies: [isVisible, reduceMotion] }
  )

  useEventListener(WINDOW_TARGET, 'pointermove', () => invalidate(), { passive: true })

  useFrame(({ pointer }, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    // The first frame compiles the shaders
    if (!isReadyRef.current) {
      isReadyRef.current = true
      onReady()
    }

    // After a client-side navigation the tween starts before the canvas is ready and its own
    // invalidate() calls get lost
    const appear = appearRef.current
    if (appear && gsap.isTweening(appear.scale)) invalidate()

    if (reduceMotion) return

    const targetX = -pointer.y * 0.4
    const targetY = pointer.x * 0.6
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
