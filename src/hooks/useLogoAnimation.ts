import { useGSAP } from '@gsap/react'
import { useFrame, useThree } from '@react-three/fiber'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'
import { type Group, MathUtils, type Mesh } from 'three'

import { INTRO_DURATION, INTRO_EASE } from '@/config/animation'

gsap.registerPlugin(useGSAP)

// Share of the smaller viewport side the logo takes up
const VIEWPORT_FILL = 0.45

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
        ease: INTRO_EASE
      })
    },
    { dependencies: [isVisible, reduceMotion] }
  )

  useFrame(({ pointer }, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    // The first frame compiles the shaders, so the scene is ready after it
    if (!isReadyRef.current) {
      isReadyRef.current = true
      onReady()
    }

    if (reduceMotion) return

    mesh.rotation.x = MathUtils.damp(mesh.rotation.x, -pointer.y * 0.4, 4, delta)
    mesh.rotation.y = MathUtils.damp(mesh.rotation.y, pointer.x * 0.6, 4, delta)
  })

  return {
    state: { scale },
    refs: { appearRef, meshRef }
  }
}
