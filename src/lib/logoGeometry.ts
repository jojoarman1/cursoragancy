import { type BufferGeometry, ExtrudeGeometry, MathUtils, Shape, Vector2 } from 'three'
import { mergeVertices } from 'three/addons/utils/BufferGeometryUtils.js'

// Outline of CURSOR_ICON_PATH (24×24), Y axis flipped for three.js
const LOGO_POINTS = [
  new Vector2(0, 0),
  new Vector2(12, 0),
  new Vector2(24, -12),
  new Vector2(12, -12),
  new Vector2(12, -24),
  new Vector2(0, -12)
]

// Visual center (centroid) of the outline in SVG coordinates (24×24 box, y down). The arrow's mass
// sits top-left, so centering by the bounding box (12, 12) makes the logo look off-center
export const LOGO_SVG_SIZE = 24
export const LOGO_CENTROID = { x: 9, y: 9 }

// Rounded glass in the hero → sharp and nearly flat, like the SVG logo, in the header
const CORNER_RADIUS = { rounded: 1.5, sharp: 0 }
const BEVEL = { rounded: 1, sharp: 0.05 }
const DEPTH = 1.5

// Number of prebuilt shapes between rounded and sharp; switching between them is instant
export const LOGO_SHARPNESS_STEPS = 16

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

// sharpness: 0 — rounded corners and a thick rim, 1 — sharp corners and an almost flat edge
const createLogoGeometry = (sharpness: number) => {
  const radius = MathUtils.lerp(CORNER_RADIUS.rounded, CORNER_RADIUS.sharp, sharpness)
  const bevel = MathUtils.lerp(BEVEL.rounded, BEVEL.sharp, sharpness)

  return createSmoothGeometry(
    new ExtrudeGeometry(createRoundedShape(LOGO_POINTS, radius), {
      depth: DEPTH,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: bevel,
      bevelSize: bevel,
      bevelSegments: 16
      // Origin at the centroid (shape y is flipped) and halfway through the depth
    }).translate(-LOGO_CENTROID.x, LOGO_CENTROID.y, -DEPTH / 2)
  )
}

const geometryCache = new Map<number, BufferGeometry>()

export const getLogoGeometry = (step: number) => {
  const cached = geometryCache.get(step)
  if (cached) return cached

  const geometry = createLogoGeometry(step / (LOGO_SHARPNESS_STEPS - 1))
  geometryCache.set(step, geometry)
  return geometry
}

export const prebuildLogoGeometries = () => {
  for (let step = 0; step < LOGO_SHARPNESS_STEPS; step++) getLogoGeometry(step)
}
