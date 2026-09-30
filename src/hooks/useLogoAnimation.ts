import { useFrame, useThree } from '@react-three/fiber'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import { useRef } from 'react'
import { MathUtils, type Mesh } from 'three'

// Share of the smaller viewport side the logo takes up
const VIEWPORT_FILL = 0.45
// Appear animation: scale 0 → 1, slowing down towards the end
const APPEAR_DURATION = 2

const easeOutCubic = (t: number) => 1 - (1 - t) ** 3

export interface UseLogoAnimationParams {
  isVisible: boolean
  size: number
  onReady: () => void
}

export const useLogoAnimation = ({ isVisible, size, onReady }: UseLogoAnimationParams) => {
  const meshRef = useRef<Mesh>(null)
  const isReadyRef = useRef(false)
  const appearProgressRef = useRef(0)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const viewport = useThree(state => state.viewport)
  const scale = (Math.min(viewport.width, viewport.height) * VIEWPORT_FILL) / size

  useFrame(({ pointer }, delta) => {
    const mesh = meshRef.current
    if (!mesh) return

    // The first frame compiles the shaders, so the scene is ready after it
    if (!isReadyRef.current) {
      isReadyRef.current = true
      onReady()
    }

    if (isVisible) {
      const step = reduceMotion ? 1 : delta / APPEAR_DURATION
      appearProgressRef.current = Math.min(appearProgressRef.current + step, 1)
    }

    mesh.scale.setScalar(scale * easeOutCubic(appearProgressRef.current))

    if (reduceMotion) return

    mesh.rotation.x = MathUtils.damp(mesh.rotation.x, -pointer.y * 0.4, 4, delta)
    mesh.rotation.y = MathUtils.damp(mesh.rotation.y, pointer.x * 0.6, 4, delta)
  })

  return {
    refs: { meshRef }
  }
}
