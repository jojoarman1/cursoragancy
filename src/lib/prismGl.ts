import { PRISM_FRAGMENT_SHADER } from './prismShader'
import { createQuadProgram, createTexture, uploadTexture } from './webgl'

const UNIFORM_NAMES = [
  'uText',
  'uSource',
  'uCenter',
  'uAberration',
  'uHalfWidth',
  'uBlur',
  'uOpacity',
  'uSaturation',
  'uInk',
  'uPaper'
] as const

export type PrismUniformName = (typeof UNIFORM_NAMES)[number]

export interface PrismGl {
  gl: WebGLRenderingContext
  uniforms: Record<PrismUniformName, WebGLUniformLocation | null>
  // Sharp text (glyph mask) and its blurred copy (smear source)
  textures: [WebGLTexture, WebGLTexture]
  dispose: () => void
}

// Returns null when WebGL isn't available, so the caller can show the CSS fallback
export const createPrismGl = (canvas: HTMLCanvasElement): PrismGl | null => {
  const quad = createQuadProgram(canvas, PRISM_FRAGMENT_SHADER, UNIFORM_NAMES)
  if (!quad) return null

  const { gl, uniforms } = quad
  const textures: PrismGl['textures'] = [createTexture(gl), createTexture(gl)]
  textures.forEach((texture, unit) => {
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, texture)
  })
  gl.uniform1i(uniforms.uText, 0)
  gl.uniform1i(uniforms.uSource, 1)

  const dispose = () => {
    for (const texture of textures) gl.deleteTexture(texture)
    quad.dispose()
  }

  return { gl, uniforms, textures, dispose }
}

export const uploadPrismTexture = (
  { gl, textures }: PrismGl,
  unit: 0 | 1,
  source: HTMLCanvasElement
) => uploadTexture(gl, textures[unit], unit, source)

// "#e8e8e3" -> [0.91, 0.91, 0.89]; the page colours are plain hex
export const parseHexColor = (hex: string): [number, number, number] => {
  const value = Number.parseInt(hex.trim().replace('#', ''), 16)
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}
