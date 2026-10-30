import { target, useEventListener, useMediaQuery } from '@siberiacancode/reactuse'
import { useRef } from 'react'

import { MOBILE_LAYOUT_QUERY } from '@/config/layout'

const WINDOW_TARGET = target(() => window)
const END_THRESHOLD_PX = 40

export interface UseChatAutoOpenParams {
  onReachEnd: () => void
}

// Once per page load; scrollY > 0 keeps a page too short to scroll from firing on load. Not on
// the mobile layout: there the footer leaves the panel too little room at the end of the page
export const useChatAutoOpen = ({ onReachEnd }: UseChatAutoOpenParams) => {
  const hasReachedEndRef = useRef(false)
  const isMobileLayout = useMediaQuery(MOBILE_LAYOUT_QUERY)

  useEventListener(
    WINDOW_TARGET,
    'scroll',
    () => {
      if (isMobileLayout || hasReachedEndRef.current || window.scrollY === 0) return

      const scrolledTo = window.scrollY + window.innerHeight
      if (scrolledTo < document.documentElement.scrollHeight - END_THRESHOLD_PX) return

      hasReachedEndRef.current = true
      onReachEnd()
    },
    { passive: true }
  )
}
