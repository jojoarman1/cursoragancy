import { FLOW_FRAGMENT_SHADER, FLOW_IMAGE_FRAGMENT_SHADER } from './flowShader'
import {
  createQuadProgram,
  createRenderTarget,
  createTexture,
  drawQuad,
  switchProgram,
  uploadTexture
} from './webgl'

const FLOW_SIZE = 128
const MAX_PIXEL_RATIO = 2
// Per-frame pointer smoothing and velocity, as on supersolid.agency
const POINTER_FOLLOW = 0.7
const VELOCITY_SCALE = 80
const VELOCITY_FOLLOW = 0.6
const VELOCITY_DAMPING = 0.85
// The flow has faded out this long after the last movement, so drawing can stop
const SETTLE_TIME = 2500

const IMAGE_UNIT = 0
const FLOW_UNIT = 1

export type FlowDistortion = NonNullable<ReturnType<typeof createFlowDistortion>>

// Draws the photo through the flowmap while the pointer stirs it, then stops. The canvas is shown
// only while drawing, so at rest the page shows the plain <img>
export const createFlowDistortion = (canvas: HTMLCanvasElement, image: HTMLImageElement) => {
  const flowQuad = createQuadProgram(canvas, FLOW_FRAGMENT_SHADER, [
    'uFlow',
    'uPointer',
    'uVelocity',
    'uAspect'
  ] as const)
  const imageQuad = createQuadProgram(canvas, FLOW_IMAGE_FRAGMENT_SHADER, [
    'uImage',
    'uFlow',
    'uCoverScale'
  ] as const)
  if (!flowQuad || !imageQuad) return null

  const { gl } = flowQuad
  const imageTexture = createTexture(gl)
  uploadTexture(gl, imageTexture, IMAGE_UNIT, image)
  const targets = [
    createRenderTarget(gl, FLOW_SIZE, FLOW_SIZE),
    createRenderTarget(gl, FLOW_SIZE, FLOW_SIZE)
  ]
  // Encoded zero flow
  gl.clearColor(0.5, 0.5, 0, 1)
  for (const { framebuffer } of targets) {
    gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer)
    gl.clear(gl.COLOR_BUFFER_BIT)
  }

  const pointer = { x: 0.5, y: 0.5 }
  const target = { x: 0.5, y: 0.5 }
  const velocity = { x: 0, y: 0 }
  let frame = 0
  let lastMoveTime = 0

  const resize = () => {
    const pixelRatio = Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO)
    canvas.width = Math.floor(canvas.clientWidth * pixelRatio)
    canvas.height = Math.floor(canvas.clientHeight * pixelRatio)
    const canvasAspect = canvas.width / canvas.height
    const imageAspect = image.naturalWidth / image.naturalHeight
    switchProgram(gl, flowQuad.program)
    gl.uniform1f(flowQuad.uniforms.uAspect, canvasAspect)
    switchProgram(gl, imageQuad.program)
    gl.uniform2f(
      imageQuad.uniforms.uCoverScale,
      Math.min(canvasAspect / imageAspect, 1),
      Math.min(imageAspect / canvasAspect, 1)
    )
  }

  const tick = (time: number) => {
    const lastX = pointer.x
    const lastY = pointer.y
    pointer.x += (target.x - pointer.x) * POINTER_FOLLOW
    pointer.y += (target.y - pointer.y) * POINTER_FOLLOW
    velocity.x += ((pointer.x - lastX) * VELOCITY_SCALE - velocity.x) * VELOCITY_FOLLOW
    velocity.y += ((pointer.y - lastY) * VELOCITY_SCALE - velocity.y) * VELOCITY_FOLLOW
    velocity.x *= VELOCITY_DAMPING
    velocity.y *= VELOCITY_DAMPING

    const [read, write] = targets
    switchProgram(gl, flowQuad.program)
    gl.bindFramebuffer(gl.FRAMEBUFFER, write.framebuffer)
    gl.activeTexture(gl.TEXTURE0 + FLOW_UNIT)
    gl.bindTexture(gl.TEXTURE_2D, read.texture)
    gl.uniform1i(flowQuad.uniforms.uFlow, FLOW_UNIT)
    gl.uniform2f(flowQuad.uniforms.uPointer, pointer.x, pointer.y)
    gl.uniform2f(flowQuad.uniforms.uVelocity, velocity.x, velocity.y)
    drawQuad(gl, FLOW_SIZE, FLOW_SIZE)
    targets.reverse()

    switchProgram(gl, imageQuad.program)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null)
    gl.bindTexture(gl.TEXTURE_2D, write.texture)
    // Bound every frame: creating the flow targets rebinds whatever unit was active
    gl.activeTexture(gl.TEXTURE0 + IMAGE_UNIT)
    gl.bindTexture(gl.TEXTURE_2D, imageTexture)
    gl.uniform1i(imageQuad.uniforms.uImage, IMAGE_UNIT)
    gl.uniform1i(imageQuad.uniforms.uFlow, FLOW_UNIT)
    gl.clearColor(0, 0, 0, 0)
    drawQuad(gl)

    const isSettled = time - lastMoveTime > SETTLE_TIME
    canvas.style.opacity = isSettled ? '0' : '1'
    frame = isSettled ? 0 : requestAnimationFrame(tick)
  }

  const setTarget = (clientX: number, clientY: number) => {
    const rect = canvas.getBoundingClientRect()
    target.x = (clientX - rect.left) / rect.width
    target.y = 1 - (clientY - rect.top) / rect.height
    lastMoveTime = performance.now()
    if (!frame) frame = requestAnimationFrame(tick)
  }

  return {
    enter: (clientX: number, clientY: number) => {
      if (!frame) resize()
      setTarget(clientX, clientY)
      // Entering doesn't count as a swipe from wherever the pointer last left
      Object.assign(pointer, target)
    },
    move: setTarget,
    destroy: () => cancelAnimationFrame(frame)
  }
}
