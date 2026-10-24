'use client'

import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { MathUtils } from 'three'

import { SITE_CONFIG } from '@/config/site'
import { type UsePrismTitleParams, usePrismTitle } from '@/hooks/usePrismTitle'
import { PRISM_FRAGMENT_SHADER, PRISM_VERTEX_SHADER } from '@/lib/prismShader'

import { PrismTitleFallback } from './PrismTitleFallback'

const MAX_DPR = 3

const getInitialDpr = () => MathUtils.clamp(window.devicePixelRatio, 1, MAX_DPR)

type PrismTitleProps = Omit<UsePrismTitleParams, 'text'>

const PrismTitle = (props: PrismTitleProps) => {
  const prismTitle = usePrismTitle({ ...props, text: SITE_CONFIG.name })

  return (
    <mesh>
      <planeGeometry args={[prismTitle.state.size.width, prismTitle.state.size.height]} />
      <shaderMaterial
        args={[
          {
            uniforms: prismTitle.state.uniforms,
            vertexShader: PRISM_VERTEX_SHADER,
            fragmentShader: PRISM_FRAGMENT_SHADER
          }
        ]}
        transparent
        depthWrite={false}
      />
    </mesh>
  )
}

export const PrismTitleScene = (props: PrismTitleProps) => {
  const [dpr] = useState(getInitialDpr)

  return (
    <Canvas
      orthographic
      camera={{ position: [0, 0, 10], zoom: 1 }}
      dpr={dpr}
      frameloop='demand'
      gl={{ alpha: true }}
      style={{ position: 'absolute', inset: 0, userSelect: 'none', WebkitUserSelect: 'none' }}
      fallback={<PrismTitleFallback />}
    >
      <PrismTitle {...props} />
    </Canvas>
  )
}
