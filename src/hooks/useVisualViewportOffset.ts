import { type RefObject, useEffect } from 'react'

export interface UseVisualViewportOffsetParams {
  targetRef: RefObject<HTMLElement | null>
  isEnabled: boolean
}

// iOS keeps the layout size when its keyboard opens; this exposes the hidden top and bottom as
// --chat-viewport-top/--chat-viewport-bottom so a fixed panel can follow the visible area.
// A plain effect: reactuse targets don't accept VisualViewport
export const useVisualViewportOffset = ({
  targetRef,
  isEnabled
}: UseVisualViewportOffsetParams) => {
  useEffect(() => {
    const target = targetRef.current
    const visualViewport = window.visualViewport
    if (!isEnabled || !target || !visualViewport) return

    const fitVisualViewport = () => {
      const hiddenBottom = window.innerHeight - visualViewport.height - visualViewport.offsetTop
      target.style.setProperty('--chat-viewport-top', `${visualViewport.offsetTop}px`)
      target.style.setProperty('--chat-viewport-bottom', `${Math.max(hiddenBottom, 0)}px`)
    }

    visualViewport.addEventListener('resize', fitVisualViewport)
    visualViewport.addEventListener('scroll', fitVisualViewport)
    return () => {
      visualViewport.removeEventListener('resize', fitVisualViewport)
      visualViewport.removeEventListener('scroll', fitVisualViewport)
    }
  }, [targetRef, isEnabled])
}
