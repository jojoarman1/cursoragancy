// A panel that grows out of a button: its clip-path inset goes from the button's box to zero.
// The corner radius stays the panel's own the whole time

export interface MorphInset {
  top: number
  right: number
  bottom: number
  left: number
  radius: number
}

export const getRadius = (element: HTMLElement) =>
  Number.parseFloat(getComputedStyle(element).borderTopLeftRadius)

export const getOpenInset = (panel: HTMLElement): MorphInset => ({
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
  radius: getRadius(panel)
})

export const getButtonInset = (panel: HTMLElement, button: HTMLElement): MorphInset => {
  const panelRect = panel.getBoundingClientRect()
  const buttonRect = button.getBoundingClientRect()

  return {
    top: buttonRect.top - panelRect.top,
    right: panelRect.right - buttonRect.right,
    bottom: panelRect.bottom - buttonRect.bottom,
    left: buttonRect.left - panelRect.left,
    radius: getRadius(panel)
  }
}

export const toClipPath = ({ top, right, bottom, left, radius }: MorphInset) =>
  `inset(${top}px ${right}px ${bottom}px ${left}px round ${radius}px)`
