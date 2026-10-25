import { useEventListener } from '@siberiacancode/reactuse'
import { type RefObject, useRef } from 'react'

export interface UseReelPlaybackParams {
  hoverTargetRef: RefObject<HTMLElement | null>
}

// Plays the reel only while its cover is hovered; with preload="none" nothing downloads until then
export const useReelPlayback = ({ hoverTargetRef }: UseReelPlaybackParams) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEventListener(hoverTargetRef, 'pointerenter', (event: PointerEvent) => {
    if (event.pointerType !== 'mouse') return
    // Rejects if the browser blocks it or the leave pauses it first; the poster just stays
    videoRef.current?.play().catch(() => {})
  })
  useEventListener(hoverTargetRef, 'pointerleave', () => videoRef.current?.pause())

  return {
    refs: { videoRef }
  }
}
