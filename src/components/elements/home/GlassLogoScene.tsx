'use client'

import { Environment, MeshTransmissionMaterial } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { MathUtils } from 'three'

import { CursorIcon } from '@/components/icon/CursorIcon'
import { type UseLogoAnimationParams, useLogoAnimation } from '@/hooks/useLogoAnimation'
import { useLogoDock } from '@/hooks/useLogoDock'
import { useLogoGlow } from '@/hooks/useLogoGlow'
import { useLogoSharpen } from '@/hooks/useLogoSharpen'
import { getLogoGeometry } from '@/lib/logoGeometry'

const MIN_DPR = 1.5
const MAX_DPR = 3

const getInitialDpr = () => MathUtils.clamp(window.devicePixelRatio, MIN_DPR, MAX_DPR)

const ENVIRONMENT_COLOR = '#3a3a3a'

const LOGO_GEOMETRY = getLogoGeometry(0)

const LOGO_SIZE = 26

const HOVER_GLOW_OPACITY = 0.9

const GLOW_VERTEX_SHADER = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const GLOW_FRAGMENT_SHADER = /* glsl */ `
  uniform float uHover;
  uniform float uDock;

  void main() {
    gl_FragColor = vec4(vec3(1.0), max(uHover * ${HOVER_GLOW_OPACITY.toFixed(2)}, uDock));
  }
`

// Otherwise hovering the glow layer would count as leaving the glass
const IGNORE_RAYCAST = () => {}

type LogoProps = Omit<UseLogoAnimationParams, 'size'>

const Logo = (props: LogoProps) => {
  const logoAnimation = useLogoAnimation({ ...props, size: LOGO_SIZE })
  const logoGlow = useLogoGlow({ dockProgressRef: props.dockProgressRef })
  const logoDock = useLogoDock({
    progressRef: props.dockProgressRef,
    scale: logoAnimation.state.scale
  })
  const logoSharpen = useLogoSharpen({
    progressRef: props.dockProgressRef,
    meshRef: logoAnimation.refs.meshRef
  })

  return (
    <group ref={logoDock.refs.dockRef}>
      <group ref={logoAnimation.refs.appearRef} scale={0}>
        <mesh
          ref={logoAnimation.refs.meshRef}
          geometry={LOGO_GEOMETRY}
          scale={logoAnimation.state.scale}
          onPointerOver={logoGlow.functions.onPointerOver}
          onPointerOut={logoGlow.functions.onPointerOut}
        >
          <mesh
            ref={logoSharpen.refs.glowMeshRef}
            geometry={LOGO_GEOMETRY}
            raycast={IGNORE_RAYCAST}
            renderOrder={1}
          >
            {/* Same surface as the glass, so it skips the depth test instead of z-fighting with it;
              back faces are culled, so only the side facing the camera glows */}
            <shaderMaterial
              args={[
                {
                  uniforms: logoGlow.state.uniforms,
                  vertexShader: GLOW_VERTEX_SHADER,
                  fragmentShader: GLOW_FRAGMENT_SHADER
                }
              ]}
              transparent
              depthTest={false}
              depthWrite={false}
            />
          </mesh>
          <MeshTransmissionMaterial
            samples={16}
            transmission={1}
            thickness={0.2}
            roughness={0}
            ior={1.2}
            chromaticAberration={0.02}
            anisotropicBlur={0}
            backside
          />
        </mesh>
      </group>
    </group>
  )
}

interface GlassLogoSceneProps extends LogoProps {
  isDocked: boolean
}

export const GlassLogoScene = ({ isDocked, ...logoProps }: GlassLogoSceneProps) => {
  // No PerformanceMonitor: it reads the idle gaps of on-demand rendering as low fps
  const [dpr] = useState(getInitialDpr)

  return (
    // Click-through canvas over the page; pointer events come from the body
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      dpr={dpr}
      gl={{ powerPreference: 'high-performance', alpha: true }}
      frameloop={isDocked ? 'never' : 'demand'}
      eventSource={document.body}
      eventPrefix='client'
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        visibility: isDocked ? 'hidden' : 'visible',
        userSelect: 'none',
        WebkitUserSelect: 'none'
      }}
      fallback={<CursorIcon className='size-24 md:size-32' />}
    >
      <Logo {...logoProps} />

      <directionalLight intensity={2} position={[3, 4, -3]} />
      <Environment resolution={32} frames={1}>
        <color attach='background' args={[ENVIRONMENT_COLOR]} />
      </Environment>
    </Canvas>
  )
}
