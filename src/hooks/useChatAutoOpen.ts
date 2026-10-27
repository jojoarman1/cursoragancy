import { target, useEventListener } from '@siberiacancode/reactuse'
import { useRef } from 'react'

const WINDOW_TARGET = target(() => window)
const END_THRESHOLD_PX = 40

export interface UseChatAutoOpenParams {
  onReachEnd: () => void
}

// Once per page load; scrollY > 0 keeps a page too short to scroll from firing on load
export const useChatAutoOpen = ({ onReachEnd }: UseChatAutoOpenParams) => {
  const hasReachedEndRef = useRef(false)

  useEventListener(
    WINDOW_TARGET,
    'scroll',
    () => {
      if (hasReachedEndRef.current || window.scrollY === 0) return

      const scrolledTo = window.scrollY + window.innerHeight
      if (scrolledTo < document.documentElement.scrollHeight - END_THRESHOLD_PX) return

      hasReachedEndRef.current = true
      onReachEnd()
    },
    { passive: true }
  )
}
