// How far the collage canvas reaches past its column on every side (fractions of the column's
// width / height): room for the cut-out sticking out, the paper's spring overshoot and the parallax
export const LENS_OVERFLOW = { x: 0.16, y: 0.12 }

// The paper is inset in the column; the cut-out is bigger and sits a little lower, over its edges
export const LENS_BACKGROUND_INSET = 0.04
export const LENS_FOREGROUND_SCALE = 1.14
export const LENS_FOREGROUND_DROP = 0.02

// The column is 469 of the 1920 artboard; for the plain <img> fallback without WebGL
export const LENS_IMAGE_SIZES = '25vw'

// How far each layer drifts with the pointer, in canvas widths at the screen's edge: the cut-out
// further than the paper, so it reads as in front of it
export const LENS_PARALLAX = { background: 0.012, foreground: 0.035 }
// How quickly the drift catches up with the pointer (damp lambda, per second)
export const LENS_PARALLAX_DAMPING = 5

// The paper's lens bulge at rest (it flattens out completely), and how much rounder it starts
// while it comes in
export const LENS_PAPER_BULGE = { rest: 0, entering: 1.4 }

// The collage coming in: the paper grows smoothly out of its own middle, then the cut-out rises
// from below
export const LENS_ENTRANCE = {
  paperDuration: 1.4,
  paperEase: 'expo.out',
  cutoutDuration: 1,
  cutoutEase: 'expo.out',
  cutoutDelay: 0.25
}
