import { useFrame } from '@react-three/fiber'
import { type RefObject, useEffect, useRef } from 'react'
import type { Mesh } from 'three'

import type { LogoDockProgress } from '@/hooks/useLogoDockScroll'
import { getLogoGeometry, LOGO_SHARPNESS_STEPS, prebuildLogoGeometries } from '@/lib/logoGeometry'

export interface UseLogoSharpenParams {
  progressRef: RefObject<LogoDockProgress>
  meshRef: RefObject<Mesh | null>
}

// While the logo flies into the header its corners sharpen and the rim flattens,
// so it matches the SVG logo it turns into
export const useLogoSharpen = ({ progressRef, meshRef }: UseLogoSharpenParams) => {
  // The white glow layer uses the same geometry as the glass
  const glowMeshRef = useRef<Mesh>(null)
  const stepRef = useRef(0)

  // Builds all shapes when the browser is idle, so the first scroll doesn't stutter
  useEffect(() => {
    if (!('requestIdleCallback' in window)) {
      const timeoutId = setTimeout(prebuildLogoGeometries)
      return () => clearTimeout(timeoutId)
    }

    const idleId = window.requestIdleCallback(prebuildLogoGeometries)
    return () => window.cancelIdleCallback(idleId)
  }, [])

  useFrame(() => {
    const sharpness = progressRef.current.value
    const step = Math.round(sharpness * (LOGO_SHARPNESS_STEPS - 1))
    if (step === stepRef.current) return

    stepRef.current = step
    const geometry = getLogoGeometry(step)

    for (const mesh of [meshRef.current, glowMeshRef.current]) {
      if (mesh) mesh.geometry = geometry
    }
  })

  return {
    refs: { glowMeshRef }
  }
}
