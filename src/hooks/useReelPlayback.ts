import { useEventListener, useIntersectionObserver, useMediaQuery } from '@siberiacancode/reactuse'
import { useRef, useState } from 'react'

import { FINE_POINTER_QUERY } from '@/config/media'

// On touch screens the project crossing the middle line of the screen is the open one, however
// tall its text makes it
const MIDDLE_LINE_MARGIN = '-50% 0px -50% 0px'

// The reel opens and plays while the whole project (photo and text) is hovered with a mouse, or,
// on touch screens, while the project is in the middle of the screen. With preload="none"
// nothing downloads until it first opens
export const useReelPlayback = () => {
  const areaRef = useRef<HTMLElement>(null)
  const [isActive, setIsActive] = useState(false)
  const isFinePointer = useMediaQuery(FINE_POINTER_QUERY)

  const toggleReel = (isOpen: boolean) => {
    setIsActive(isOpen)
    const video = areaRef.current?.querySelector('video')
    // Rejects if the browser blocks it or a pause comes first; the poster just stays
    if (isOpen) video?.play().catch(() => {})
    else video?.pause()
  }

  useEventListener(areaRef, 'pointerenter', (event: PointerEvent) => {
    if (event.pointerType === 'mouse') toggleReel(true)
  })
  useEventListener(areaRef, 'pointerleave', (event: PointerEvent) => {
    if (event.pointerType === 'mouse') toggleReel(false)
  })

  useIntersectionObserver(areaRef, {
    enabled: !isFinePointer,
    rootMargin: MIDDLE_LINE_MARGIN,
    onChange: ([entry]) => toggleReel(entry.isIntersecting)
  })

  return {
    state: { isActive },
    refs: { areaRef }
  }
}
