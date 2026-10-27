import { useLatest } from '@siberiacancode/reactuse'
import { useEffect, useRef, useState } from 'react'

import {
  PRISM_FONT_SIZES,
  PRISM_LETTER_SPACING,
  PRISM_MOBILE_QUERY,
  PRISM_SOURCE_BLUR
} from '@/config/prism'
import { createPrismGl, parseHexColor, uploadPrismTexture } from '@/lib/prismGl'
import { applyPrismState, type PrismState } from '@/lib/prismState'
import { blurPrismText, drawPrismText, type PrismTextBox } from '@/lib/prismText'

const MAX_PIXEL_RATIO = 3

export interface UsePrismRendererParams {
  text: string
  state: PrismState
  onDrawn: (textBox: PrismTextBox, canvas: HTMLCanvasElement) => void
  onFirstFrame?: () => void
}

// Plain WebGL for one full-canvas quad: draws only when asked, at most once per animation frame
export const usePrismRenderer = (params: UsePrismRendererParams) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const renderRef = useRef(() => {})
  const requestRenderRef = useRef(() => {})
  const [isSupported, setIsSupported] = useState(true)
  const latest = useLatest(params)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const prismGl = createPrismGl(canvas)
    // The CSS fallback is ready right away, so the hero doesn't wait for a frame that never comes
    if (!prismGl) {
      setIsSupported(false)
      latest.ref.current.onFirstFrame?.()
      return
    }

    const { gl } = prismGl
    const textCanvas = document.createElement('canvas')
    const sourceCanvas = document.createElement('canvas')
    let frame = 0
    let hasText = false
    let hasRendered = false
    let drawnSizeKey = ''
    let isCancelled = false

    const render = () => {
      cancelAnimationFrame(frame)
      frame = 0
      if (!hasText) return

      gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight)
      gl.clear(gl.COLOR_BUFFER_BIT)
      applyPrismState(prismGl, latest.ref.current.state)
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)

      if (hasRendered) return
      hasRendered = true
      latest.ref.current.onFirstFrame?.()
    }

    renderRef.current = render
    requestRenderRef.current = () => {
      if (!frame) frame = requestAnimationFrame(render)
    }

    // The word reuses the page's Geist, so it can only be drawn once that font is loaded
    const drawText = async () => {
      await document.fonts.ready
      if (isCancelled) return

      const { text, state, onDrawn } = latest.ref.current
      // No lower clamp: zoomed out the ratio drops below 1 and the CSS size grows, so a floor of 1
      // would render many times more pixels than the screen has (25x at 20% zoom)
      const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
      const width = Math.floor(canvas.clientWidth * pixelRatio)
      const height = Math.floor(canvas.clientHeight * pixelRatio)
      const root = getComputedStyle(document.documentElement)
      // Resizing the canvas wipes it, so a resize that changes nothing must not touch it
      const sizeKey = `${width}x${height}@${root.fontSize}`
      if (sizeKey === drawnSizeKey) return
      drawnSizeKey = sizeKey

      // The texture matches the drawing buffer exactly, or it gets stretched and blurs the edges
      canvas.width = width
      canvas.height = height
      textCanvas.width = canvas.width
      textCanvas.height = canvas.height

      const isMobile = window.matchMedia(PRISM_MOBILE_QUERY).matches
      // Text stops growing past the artboard (--text-unit), like the page's other text
      const fontSize =
        Math.min(Number.parseFloat(root.fontSize), 1) *
        pixelRatio *
        (isMobile ? PRISM_FONT_SIZES.mobile : PRISM_FONT_SIZES.desktop)
      const textBox = drawPrismText({
        canvas: textCanvas,
        text,
        font: `700 ${fontSize}px ${getComputedStyle(document.body).fontFamily}`,
        letterSpacing: `${fontSize * PRISM_LETTER_SPACING}px`
      })
      const blur = fontSize * PRISM_SOURCE_BLUR
      blurPrismText(textCanvas, sourceCanvas, blur)
      uploadPrismTexture(prismGl, 0, textCanvas)
      uploadPrismTexture(prismGl, 1, sourceCanvas)

      Object.assign(state, {
        halfWidth: textBox.width / 2 / canvas.width,
        blur: blur / canvas.width,
        ink: parseHexColor(root.getPropertyValue('--foreground')),
        paper: parseHexColor(root.getPropertyValue('--background'))
      })
      onDrawn(textBox, textCanvas)
      hasText = true
      // Right away, in the same frame as the resize: a requested render would leave one frame of
      // the wiped, empty canvas, which blinks while iOS Safari's toolbar resizes the page
      render()
    }

    // Fires once right away, then on every resize
    const resizeObserver = new ResizeObserver(() => drawText())
    resizeObserver.observe(canvas)

    return () => {
      isCancelled = true
      resizeObserver.disconnect()
      cancelAnimationFrame(frame)
      // No loseContext() here: the canvas returns the same, now dead, context on the next
      // getContext(), which breaks Strict Mode's second effect run. It is freed with the canvas
      renderRef.current = () => {}
      requestRenderRef.current = () => {}
    }
  }, [latest.ref])

  return {
    state: { isSupported },
    refs: { canvasRef },
    functions: {
      render: () => renderRef.current(),
      requestRender: () => requestRenderRef.current()
    }
  }
}
