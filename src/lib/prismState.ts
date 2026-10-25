import { FIGMA_CENTER, PRISM_SATURATION } from '@/config/prism'

import type { PrismGl } from './prismGl'

// Everything the prism shader reads; GSAP and the pointer follow tween these numbers directly
export const createPrismState = (saturation = PRISM_SATURATION) => ({
  center: { x: FIGMA_CENTER.x, y: 0.5 },
  // Zero aberration draws the plain dark word: every band samples the same pixel
  aberration: 0,
  halfWidth: 0.5,
  // Blur radius of the smear source, in uv
  blur: 0,
  // The word fades in before the effect grows
  opacity: 0,
  saturation,
  ink: [0, 0, 0] as [number, number, number],
  paper: [1, 1, 1] as [number, number, number]
})

export type PrismState = ReturnType<typeof createPrismState>

export const applyPrismState = ({ gl, uniforms }: PrismGl, state: PrismState) => {
  gl.uniform2f(uniforms.uCenter, state.center.x, state.center.y)
  gl.uniform1f(uniforms.uAberration, state.aberration)
  gl.uniform1f(uniforms.uHalfWidth, state.halfWidth)
  gl.uniform1f(uniforms.uBlur, state.blur)
  gl.uniform1f(uniforms.uOpacity, state.opacity)
  gl.uniform1f(uniforms.uSaturation, state.saturation)
  gl.uniform3fv(uniforms.uInk, state.ink)
  gl.uniform3fv(uniforms.uPaper, state.paper)
}
