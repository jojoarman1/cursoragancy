import {
  LENS_BACKGROUND_INSET,
  LENS_FOREGROUND_DROP,
  LENS_FOREGROUND_SCALE,
  LENS_OVERFLOW,
  LENS_PAPER_BULGE,
  LENS_PARALLAX
} from '@/config/lens'

import { LENS_FRAGMENT_SHADER } from './lensShader'
import { type Rect, scaleRect, shiftRect } from './rect'
import { createQuadProgram, createTexture, drawQuad, uploadTexture } from './webgl'

const MAX_PIXEL_RATIO = 2

// What a frame shows: the pointer offset for the parallax (-1…1 from the middle of the screen)
// and how far each layer has come in (0 hidden, 1 in place)
export interface LensView {
  offset: { x: number; y: number }
  paper: number
  cutout: number
}

export interface LensLayers {
  background: HTMLImageElement
  foreground: HTMLImageElement | null
  isSheet: boolean
}

export type LensCollage = NonNullable<ReturnType<typeof createLensCollage>>

// Draws the collage, each layer shifted by its own parallax depth and placed by its entrance.
// Nothing moves on its own, so there is no frame loop: resize() lays it out, render() draws one
// frame of a view.
// Returns null without WebGL, so the caller can show plain images
export const createLensCollage = (
  canvas: HTMLCanvasElement,
  { background, foreground, isSheet }: LensLayers
) => {
  const quad = createQuadProgram(canvas, LENS_FRAGMENT_SHADER, [
    'uBackground',
    'uForeground',
    'uBackgroundRect',
    'uForegroundRect',
    'uPaperBulge'
  ] as const)
  if (!quad) return null

  const { gl, uniforms } = quad
  // Both created before either upload: createTexture binds to the active unit, so creating the
  // second one after the first upload would replace the first on unit 0
  const textures = [createTexture(gl), createTexture(gl)]
  uploadTexture(gl, textures[0], 0, background)
  // A sheet without a cut-out samples a transparent pixel instead
  uploadTexture(gl, textures[1], 1, foreground ?? new ImageData(1, 1))
  gl.uniform1i(uniforms.uBackground, 0)
  gl.uniform1i(uniforms.uForeground, 1)

  let backgroundRect: Rect = [0, 0, 1, 1]
  let foregroundRect: Rect = [0, 0, 1, 1]

  // A rect in canvas CSS pixels (top-down) to canvas uv (bottom-up)
  const toUv = (x: number, y: number, width: number, height: number): Rect => [
    x / canvas.clientWidth,
    1 - (y + height) / canvas.clientHeight,
    (x + width) / canvas.clientWidth,
    1 - y / canvas.clientHeight
  ]

  const render = ({ offset, paper, cutout }: LensView) => {
    // uv runs bottom-up, so a pointer lower on the screen moves the layers up
    const shift = (depth: number) => [-offset.x * depth, offset.y * depth] as const
    // The paper grows out of its own middle, starting rounder and flattening to its rest bulge as
    // it comes in; the cut-out rises from below its place
    const paperRect = scaleRect(backgroundRect, paper)
    const cutoutHeight = foregroundRect[3] - foregroundRect[1]
    const cutoutRect = shiftRect(foregroundRect, 0, -(1 - cutout) * cutoutHeight)
    gl.uniform4f(
      uniforms.uBackgroundRect,
      ...shiftRect(paperRect, ...shift(LENS_PARALLAX.background))
    )
    gl.uniform4f(
      uniforms.uForegroundRect,
      ...shiftRect(cutoutRect, ...shift(LENS_PARALLAX.foreground))
    )
    const bulgeFade = 1 - Math.min(paper, 1)
    gl.uniform1f(
      uniforms.uPaperBulge,
      LENS_PAPER_BULGE.rest + (LENS_PAPER_BULGE.entering - LENS_PAPER_BULGE.rest) * bulgeFade
    )
    drawQuad(gl)
  }

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
    canvas.width = Math.floor(canvas.clientWidth * pixelRatio)
    canvas.height = Math.floor(canvas.clientHeight * pixelRatio)

    // The column sits inside the canvas, past its overflow margins
    const columnWidth = canvas.clientWidth / (1 + LENS_OVERFLOW.x * 2)
    const columnHeight = canvas.clientHeight / (1 + LENS_OVERFLOW.y * 2)
    const columnX = columnWidth * LENS_OVERFLOW.x
    const columnY = columnHeight * LENS_OVERFLOW.y
    // The paper keeps its own proportions, fitted into the inset column and centred, unless it is
    // stretched over the whole column
    const aspect = isSheet
      ? columnWidth / columnHeight
      : background.naturalWidth / background.naturalHeight
    const inset = isSheet ? 0 : LENS_BACKGROUND_INSET
    const width = Math.min(columnWidth * (1 - inset * 2), columnHeight * (1 - inset * 2) * aspect)
    const height = width / aspect
    const x = columnX + (columnWidth - width) / 2
    const y = columnY + (columnHeight - height) / 2

    // The cut-out grows about the paper's bottom centre, then drops a little below it
    const foregroundWidth = width * LENS_FOREGROUND_SCALE
    const foregroundHeight = height * LENS_FOREGROUND_SCALE
    backgroundRect = toUv(x, y, width, height)
    foregroundRect = toUv(
      x - (foregroundWidth - width) / 2,
      y + height * (1 + LENS_FOREGROUND_DROP) - foregroundHeight,
      foregroundWidth,
      foregroundHeight
    )
  }

  resize()
  return { resize, render }
}
