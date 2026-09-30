'use client'

import { Environment, MeshTransmissionMaterial, PerformanceMonitor } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { useState } from 'react'
import { type BufferGeometry, ExtrudeGeometry, Shape, Vector2 } from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

import { CursorIcon } from '@/components/icon/CursorIcon'
import { type UseLogoAnimationParams, useLogoAnimation } from '@/hooks/useLogoAnimation'

// Renders at 2x even on 1x screens (supersampling) for crisp edges
const HIGH_DPR = 2
const LOW_DPR = 1

// Uniform environment: soft neutral reflections without any light shapes in them
const ENVIRONMENT_COLOR = '#3a3a3a'

// Outline of CURSOR_ICON_PATH (24×24), Y axis flipped for three.js
const LOGO_POINTS = [
  new Vector2(0, 0),
  new Vector2(12, 0),
  new Vector2(24, -12),
  new Vector2(12, -12),
  new Vector2(12, -24),
  new Vector2(0, -12)
]

const CORNER_RADIUS = 1.5

const createRoundedShape = (points: Vector2[], radius: number) => {
  const shape = new Shape()

  points.forEach((point, index) => {
    const prev = points[(index - 1 + points.length) % points.length]
    const next = points[(index + 1) % points.length]
    const start = prev.clone().sub(point).setLength(radius).add(point)
    const end = next.clone().sub(point).setLength(radius).add(point)

    if (index === 0) shape.moveTo(start.x, start.y)
    else shape.lineTo(start.x, start.y)

    shape.quadraticCurveTo(point.x, point.y, end.x, end.y)
  })

  return shape.closePath()
}

// Welds vertices so the rounded rim is shaded smoothly, without visible facets
const createSmoothGeometry = (geometry: BufferGeometry) => {
  geometry.deleteAttribute('normal')
  geometry.deleteAttribute('uv')

  const smoothGeometry = mergeVertices(geometry)
  smoothGeometry.computeVertexNormals()
  return smoothGeometry
}

// Flat front and back, rounded rim around the edge
const LOGO_GEOMETRY = createSmoothGeometry(
  new ExtrudeGeometry(createRoundedShape(LOGO_POINTS, CORNER_RADIUS), {
    depth: 1.5,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 1,
    bevelSize: 1,
    bevelSegments: 16
  }).center()
)

// Outline size including the rim, used to fit the logo into the viewport
const LOGO_SIZE = 26

type LogoProps = Omit<UseLogoAnimationParams, 'size'>

const Logo = (props: LogoProps) => {
  const logoAnimation = useLogoAnimation({ ...props, size: LOGO_SIZE })

  return (
    // The group scales in on appear, the mesh fits the viewport and tilts toward the pointer
    <group ref={logoAnimation.refs.appearRef} scale={0}>
      <mesh
        ref={logoAnimation.refs.meshRef}
        geometry={LOGO_GEOMETRY}
        scale={logoAnimation.state.scale}
      >
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
  )
}

interface GlassLogoSceneProps {
  isVisible: boolean
  onReady: () => void
}

export const GlassLogoScene = ({ isVisible, onReady }: GlassLogoSceneProps) => {
  const [dpr, setDpr] = useState(HIGH_DPR)
  const background = getComputedStyle(document.body).backgroundColor

  return (
    <Canvas
      camera={{ position: [0, 0, 6], fov: 35 }}
      dpr={dpr}
      gl={{ powerPreference: 'high-performance' }}
      fallback={<CursorIcon className='size-24 md:size-32' />}
    >
      <color attach='background' args={[background]} />

      <PerformanceMonitor onDecline={() => setDpr(LOW_DPR)} />

      <Logo isVisible={isVisible} onReady={onReady} />

      <directionalLight intensity={2} position={[3, 4, -3]} />
      <Environment resolution={32} frames={1}>
        <color attach='background' args={[ENVIRONMENT_COLOR]} />
      </Environment>
    </Canvas>
  )
}
