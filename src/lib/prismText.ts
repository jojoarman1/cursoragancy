interface DrawPrismTextParams {
  canvas: HTMLCanvasElement
  text: string
  font: string
  letterSpacing: string
}

export interface PrismTextBox {
  top: number
  width: number
  height: number
}

// Draws the word centred by its visible glyphs; returns its text box (font ascent to descent),
// which is what Figma measures the effect's centre point against
export const drawPrismText = ({
  canvas,
  text,
  font,
  letterSpacing
}: DrawPrismTextParams): PrismTextBox => {
  const context = canvas.getContext('2d')
  if (!context) return { top: 0, width: canvas.width, height: canvas.height }

  context.clearRect(0, 0, canvas.width, canvas.height)
  context.font = font
  context.letterSpacing = letterSpacing
  context.textAlign = 'center'
  context.fillStyle = '#000'

  const metrics = context.measureText(text)
  const baseline =
    (canvas.height + metrics.actualBoundingBoxAscent - metrics.actualBoundingBoxDescent) / 2
  context.fillText(text, canvas.width / 2, baseline)

  return {
    top: baseline - metrics.fontBoundingBoxAscent,
    width: metrics.actualBoundingBoxLeft + metrics.actualBoundingBoxRight,
    height: metrics.fontBoundingBoxAscent + metrics.fontBoundingBoxDescent
  }
}

// Copies the drawn text into another canvas with a blur, for the smear to sample
export const blurPrismText = (
  source: HTMLCanvasElement,
  target: HTMLCanvasElement,
  radius: number
) => {
  const context = target.getContext('2d')
  if (!context) return

  target.width = source.width
  target.height = source.height
  context.filter = `blur(${radius}px)`
  context.drawImage(source, 0, 0)
}
