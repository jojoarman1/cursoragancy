import { target, useEventListener } from '@siberiacancode/reactuse'

const DOCUMENT_TARGET = target(() => document)
const ZOOM_KEYS = new Set(['+', '=', '-', '_', '0'])

export const usePreventZoom = () => {
  // Ctrl/⌘ + wheel, which is also how a trackpad pinch reaches the page
  useEventListener(
    DOCUMENT_TARGET,
    'wheel',
    (event: WheelEvent) => {
      if (event.ctrlKey || event.metaKey) event.preventDefault()
    },
    { passive: false }
  )

  useEventListener(DOCUMENT_TARGET, 'keydown', (event: KeyboardEvent) => {
    if ((event.ctrlKey || event.metaKey) && ZOOM_KEYS.has(event.key)) event.preventDefault()
  })

  // iOS Safari ignores user-scalable=no, so its pinch is cancelled directly
  // (gesturestart is Safari-only and missing from the DOM typings)
  useEventListener(DOCUMENT_TARGET, 'gesturestart' as keyof DocumentEventMap, (event: Event) =>
    event.preventDefault()
  )
  useEventListener(
    DOCUMENT_TARGET,
    'touchmove',
    (event: TouchEvent) => {
      if (event.touches.length > 1) event.preventDefault()
    },
    { passive: false }
  )
}
