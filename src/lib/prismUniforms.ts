import { type CanvasTexture, Color, Vector2 } from 'three'

import { FIGMA_CENTER, PRISM_GRAIN, PRISM_SATURATION } from '@/config/prism'

export const createPrismUniforms = (saturation = PRISM_SATURATION) => ({
  uText: { value: null as CanvasTexture | null },
  uSource: { value: null as CanvasTexture | null },
  uCenter: { value: new Vector2(FIGMA_CENTER.x, 0.5) },
  // Zero aberration draws the plain dark word: every band samples the same pixel
  uAberration: { value: 0 },
  uHalfWidth: { value: 0.5 },
  // Blur radius of the smear source, in uv
  uBlur: { value: 0 },
  // The word fades in before the effect grows
  uOpacity: { value: 0 },
  uSaturation: { value: saturation },
  uGrain: { value: PRISM_GRAIN },
  // Grain cell size in device pixels, so it stays the same on dense screens
  uGrainSize: { value: 1 },
  uInk: { value: new Color() },
  uPaper: { value: new Color() }
})

export type PrismUniforms = ReturnType<typeof createPrismUniforms>
