import { PRISM_FRAGMENT_SHADER, PRISM_VERTEX_SHADER } from './prismShader'

const UNIFORM_NAMES = [
  'uText',
  'uSource',
  'uCenter',
  'uAberration',
  'uHalfWidth',
  'uBlur',
  'uOpacity',
  'uSaturation',
  'uGrain',
  'uGrainSize',
  'uInk',
  'uPaper'
] as const

export type PrismUniformName = (typeof UNIFORM_NAMES)[number]

export interface PrismGl {
  gl: WebGLRenderingContext
  uniforms: Record<PrismUniformName, WebGLUniformLocation | null>
  // Sharp text (glyph mask) and its blurred copy (smear source)
  textures: [WebGLTexture, WebGLTexture]
}

const compileShader = (gl: WebGLRenderingContext, type: number, source: string) => {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Could not create a shader')

  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    throw new Error(gl.getShaderInfoLog(shader) || 'Shader compilation failed')
  }
  return shader
}

const createTexture = (gl: WebGLRenderingContext) => {
  const texture = gl.createTexture()
  if (!texture) throw new Error('Could not create a texture')

  gl.bindTexture(gl.TEXTURE_2D, texture)
  // Non-power-of-two sizes in WebGL 1 need clamping and no mipmaps
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
  return texture
}

// Returns null when WebGL isn't available, so the caller can show the CSS fallback
export const createPrismGl = (canvas: HTMLCanvasElement): PrismGl | null => {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false })
  if (!gl || gl.isContextLost()) return null

  const program = gl.createProgram()
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, PRISM_VERTEX_SHADER))
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, PRISM_FRAGMENT_SHADER))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Shader linking failed')
  }
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook
  gl.useProgram(program)

  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer())
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)

  const uniforms = Object.fromEntries(
    UNIFORM_NAMES.map(name => [name, gl.getUniformLocation(program, name)])
  ) as PrismGl['uniforms']

  const textures: PrismGl['textures'] = [createTexture(gl), createTexture(gl)]
  textures.forEach((texture, unit) => {
    gl.activeTexture(gl.TEXTURE0 + unit)
    gl.bindTexture(gl.TEXTURE_2D, texture)
  })
  gl.uniform1i(uniforms.uText, 0)
  gl.uniform1i(uniforms.uSource, 1)
  gl.clearColor(0, 0, 0, 0)

  return { gl, uniforms, textures }
}

export const uploadPrismTexture = (
  { gl, textures }: PrismGl,
  unit: 0 | 1,
  source: HTMLCanvasElement
) => {
  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, textures[unit])
  // Canvas rows run top-down, uv bottom-up
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
}

// "#e8e8e3" -> [0.91, 0.91, 0.89]; the page colours are plain hex
export const parseHexColor = (hex: string): [number, number, number] => {
  const value = Number.parseInt(hex.trim().replace('#', ''), 16)
  return [((value >> 16) & 255) / 255, ((value >> 8) & 255) / 255, (value & 255) / 255]
}
