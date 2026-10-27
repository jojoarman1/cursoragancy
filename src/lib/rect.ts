// A rect in uv: x0, y0 = bottom-left, x1, y1 = top-right
export type Rect = [number, number, number, number]

// A zero-size rect would divide by zero in the shader
const MIN_SCALE = 0.001

export const scaleRect = ([x0, y0, x1, y1]: Rect, scale: number): Rect => {
  const s = Math.max(scale, MIN_SCALE)
  const cx = (x0 + x1) / 2
  const cy = (y0 + y1) / 2
  return [cx + (x0 - cx) * s, cy + (y0 - cy) * s, cx + (x1 - cx) * s, cy + (y1 - cy) * s]
}

export const shiftRect = ([x0, y0, x1, y1]: Rect, x: number, y: number): Rect => [
  x0 + x,
  y0 + y,
  x1 + x,
  y1 + y
]
