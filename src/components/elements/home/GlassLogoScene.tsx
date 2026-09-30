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

// Native pixel density on phones (up to 3x); 1x screens are supersampled at 1.5x for smoother edges
const MIN_DPR = 1.5
const MAX_DPR = 3

const getInitialDpr = () => MathUtils.clamp(window.devicePixelRatio, MIN_DPR, MAX_DPR)

// Uniform environment: soft neutral reflections without any light shapes in them
const ENVIRONMENT_COLOR = '#3a3a3a'

// Starting shape: rounded corners and rim; useLogoSharpen swaps it while docking on scroll
const LOGO_GEOMETRY = getLogoGeometry(0)

// Outline size including the rim, used to fit the logo into the viewport
const LOGO_SIZE = 26

// Maximum whiteness of the hover glow; docking into the header goes fully white, like the SVG
const HOVER_GLOW_OPACITY = 0.9

// Flat white over the whole logo: the stronger of the hover glow and the docking whitening
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

// The glow layer must not catch the pointer, otherwise hovering it would "leave" the glass
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
    // Outer group flies into the header on scroll, inner one scales in on appear;
    // the mesh fits the viewport and tilts toward the pointer
    <group ref={logoDock.refs.dockRef}>
      <group ref={logoAnimation.refs.appearRef} scale={0}>
        <mesh
          ref={logoAnimation.refs.meshRef}
          geometry={LOGO_GEOMETRY}
          scale={logoAnimation.state.scale}
          onPointerOver={logoGlow.functions.onPointerOver}
          onPointerOut={logoGlow.functions.onPointerOut}
        >
          {/* White glow layer on the same geometry, faded in while the cursor is over the glass */}
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
  // Docked into the header: the scene is hidden and stops rendering
  isDocked: boolean
}

export const GlassLogoScene = ({ isDocked, ...logoProps }: GlassLogoSceneProps) => {
  // Read once: no PerformanceMonitor, it misreads the idle gaps of on-demand rendering as low fps
  const [dpr] = useState(getInitialDpr)

  return (
    // Fixed, transparent and click-through, so the logo can fly over the page into the header;
    // pointer events come from the body instead of the canvas
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      dpr={dpr}
      gl={{ powerPreference: 'high-performance', alpha: true }}
      // Renders only when something changes (pointer, scroll, animations), never once docked
      frameloop={isDocked ? 'never' : 'demand'}
      eventSource={document.body}
      eventPrefix='client'
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 30,
        visibility: isDocked ? 'hidden' : 'visible'
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
