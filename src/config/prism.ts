export interface PrismFontSizes {
  desktop: number
  mobile: number
}

// Artboard px (rem); the mobile size applies up to PRISM_MOBILE_QUERY
export const PRISM_FONT_SIZES: PrismFontSizes = { desktop: 195, mobile: 150 }
export const PRISM_MOBILE_QUERY = '(max-width: 480px)'
export const PRISM_LETTER_SPACING = -0.05
// Softens the smear source; relative to the font size
export const PRISM_SOURCE_BLUR = 0.012

// Figma "Lens distortion" settings of the title (lateral mode)
export const FIGMA_ABERRATION = 0.83
export const FIGMA_CENTER = { x: 0.5, y: 0.6 }
// Converts Figma's aberration into how far (in screen fractions) the smear reaches
export const PRISM_ABERRATION_SCALE = 1
export const PRISM_SATURATION = 1.3
// Static film grain inside the letters: strength, and its size in CSS pixels
export const PRISM_GRAIN = 0.08
export const PRISM_GRAIN_SIZE = 1
