import { useThree } from '@react-three/fiber'
import { useLatest } from '@siberiacancode/reactuse'
import { useEffect } from 'react'
import { CanvasTexture, LinearFilter } from 'three'

import {
  PRISM_GRAIN_SIZE,
  PRISM_LETTER_SPACING,
  PRISM_MOBILE_QUERY,
  PRISM_SOURCE_BLUR,
  type PrismFontSizes
} from '@/config/prism'
import { blurPrismText, drawPrismText, type PrismTextBox } from '@/lib/prismText'
import type { PrismUniforms } from '@/lib/prismUniforms'

export interface UsePrismTextureParams {
  text: string
  // Light word on the dark panel colour instead of the page's dark-on-light
  isInverted: boolean
  fontSizes: PrismFontSizes
  uniforms: PrismUniforms
  onDrawn: (textBox: PrismTextBox, canvas: HTMLCanvasElement) => void
}

export const usePrismTexture = ({
  text,
  isInverted,
  fontSizes,
  uniforms,
  onDrawn
}: UsePrismTextureParams) => {
  const size = useThree(state => state.size)
  const dpr = useThree(state => state.viewport.dpr)
  const gl = useThree(state => state.gl)
  const invalidate = useThree(state => state.invalidate)
  const latestOnDrawn = useLatest(onDrawn)

  // biome-ignore lint/correctness/useExhaustiveDependencies: size and pixel ratio change the WebGL buffer the texture has to match
  useEffect(() => {
    const canvas = document.createElement('canvas')
    const sourceCanvas = document.createElement('canvas')
    const textures = [canvas, sourceCanvas].map(element => {
      const texture = new CanvasTexture(element)
      texture.minFilter = LinearFilter
      texture.generateMipmaps = false
      return texture
    })
    let isCancelled = false

    // The title reuses the page's Geist, so it can only be drawn once that font is loaded
    document.fonts.ready.then(() => {
      if (isCancelled) return

      const root = getComputedStyle(document.documentElement)
      const rem = Number.parseFloat(root.fontSize)
      const isMobile = window.matchMedia(PRISM_MOBILE_QUERY).matches
      // Exactly the WebGL buffer's size: rounding it differently (fractional pixel ratios such
      // as 125% scaling) stretches the texture by a pixel and blurs the glyph edges
      canvas.width = gl.domElement.width
      canvas.height = gl.domElement.height
      const scale = canvas.width / size.width
      const fontSize = rem * scale * (isMobile ? fontSizes.mobile : fontSizes.desktop)
      const textBox = drawPrismText({
        canvas,
        text,
        font: `700 ${fontSize}px ${getComputedStyle(document.body).fontFamily}`,
        letterSpacing: `${fontSize * PRISM_LETTER_SPACING}px`
      })
      const blur = fontSize * PRISM_SOURCE_BLUR
      blurPrismText(canvas, sourceCanvas, blur)

      for (const texture of textures) texture.needsUpdate = true
      uniforms.uText.value = textures[0]
      uniforms.uSource.value = textures[1]
      uniforms.uHalfWidth.value = textBox.width / 2 / canvas.width
      uniforms.uBlur.value = blur / canvas.width
      uniforms.uGrainSize.value = PRISM_GRAIN_SIZE * scale
      // The shader writes its colour as is, so keep these in sRGB to match the page exactly
      const [ink, paper] = isInverted
        ? ['--background', '--foreground']
        : ['--foreground', '--background']
      uniforms.uInk.value.set(root.getPropertyValue(ink).trim()).convertLinearToSRGB()
      uniforms.uPaper.value.set(root.getPropertyValue(paper).trim()).convertLinearToSRGB()
      latestOnDrawn.ref.current(textBox, canvas)
      invalidate()
    })

    return () => {
      isCancelled = true
      for (const texture of textures) texture.dispose()
    }
  }, [
    size.width,
    size.height,
    dpr,
    gl,
    text,
    isInverted,
    fontSizes.desktop,
    fontSizes.mobile,
    uniforms,
    invalidate,
    latestOnDrawn.ref
  ])

  return {
    state: { size }
  }
}
