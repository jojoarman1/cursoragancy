import { useUnmount } from '@siberiacancode/reactuse'
import { useRef, useState } from 'react'

import { LENS_EXIT } from '@/config/lens'
import { SERVICES, type ServiceId } from '@/config/services'

// The list highlights the picked service at once, but its picture waits: the shown one leaves
// first (LENS_EXIT), with no picture in between, then the new one comes in
export const useServiceSwitch = () => {
  const [activeId, setActiveId] = useState<ServiceId>(SERVICES[0].id)
  const [shownId, setShownId] = useState<ServiceId | null>(SERVICES[0].id)
  const showTimeoutRef = useRef<number>(undefined)

  useUnmount(() => window.clearTimeout(showTimeoutRef.current))

  const select = (id: ServiceId) => {
    if (id === activeId) return
    setActiveId(id)
    setShownId(null)
    // A quicker second click restarts the wait, so only the last pick comes in
    window.clearTimeout(showTimeoutRef.current)
    showTimeoutRef.current = window.setTimeout(() => setShownId(id), LENS_EXIT.duration * 1000)
  }

  return {
    state: { activeId, shownId },
    functions: { select }
  }
}
