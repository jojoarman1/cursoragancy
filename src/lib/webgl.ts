// Shared plumbing for the site's full-canvas WebGL effects: one quad, a fragment shader, textures

export const QUAD_VERTEX_SHADER = /* glsl */ `
  attribute vec2 aPosition;
  varying vec2 vUv;

  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`

// Biome takes WebGL's useProgram for a React hook, so it lives behind this one name
export const switchProgram = (gl: WebGLRenderingContext, program: WebGLProgram | null) => {
  // biome-ignore lint/correctness/useHookAtTopLevel: WebGL's useProgram, not a React hook
  gl.useProgram(program)
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

export const createTexture = (gl: WebGLRenderingContext) => {
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

export const uploadTexture = (
  gl: WebGLRenderingContext,
  texture: WebGLTexture,
  unit: number,
  source: TexImageSource
) => {
  gl.activeTexture(gl.TEXTURE0 + unit)
  gl.bindTexture(gl.TEXTURE_2D, texture)
  // Image rows run top-down, uv bottom-up
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source)
}

// Returns null when WebGL isn't available, so the caller can fall back to plain markup
export const createQuadProgram = <Name extends string>(
  canvas: HTMLCanvasElement,
  fragmentShader: string,
  uniformNames: readonly Name[]
) => {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true, antialias: false })
  if (!gl || gl.isContextLost()) return null

  const program = gl.createProgram()
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, QUAD_VERTEX_SHADER))
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentShader))
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    throw new Error(gl.getProgramInfoLog(program) || 'Shader linking failed')
  }
  switchProgram(gl, program)

  const buffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW)
  const position = gl.getAttribLocation(program, 'aPosition')
  gl.enableVertexAttribArray(position)
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
  gl.clearColor(0, 0, 0, 0)

  const uniforms = Object.fromEntries(
    uniformNames.map(name => [name, gl.getUniformLocation(program, name)])
  ) as Record<Name, WebGLUniformLocation | null>

  const dispose = () => {
    gl.bindBuffer(gl.ARRAY_BUFFER, null)
    gl.deleteBuffer(buffer)
    for (const shader of gl.getAttachedShaders(program) ?? []) {
      gl.detachShader(program, shader)
      gl.deleteShader(shader)
    }
    switchProgram(gl, null)
    gl.deleteProgram(program)
  }

  return { gl, program, uniforms, dispose }
}

// Draws the quad over the whole drawing buffer, or over a render target of the given size
export const drawQuad = (
  gl: WebGLRenderingContext,
  width = gl.drawingBufferWidth,
  height = gl.drawingBufferHeight
) => {
  gl.viewport(0, 0, width, height)
  gl.clear(gl.COLOR_BUFFER_BIT)
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
}

// An 8-bit texture to draw into, e.g. one half of a ping-pong pair
export const createRenderTarget = (gl: WebGLRenderingContext, width: number, height: number) => {
  const texture = createTexture(gl)
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, gl.UNSIGNED_BYTE, null)
  const framebuffer = gl.createFramebuffer()
  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
  gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, texture, 0)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null)
  return { texture, framebuffer }
}
