import { target, useEventListener, useMount } from '@siberiacancode/reactuse'
import type { RefObject } from 'react'

import { FOOTER_ID } from '@/config/navigation'

const WINDOW_TARGET = target(() => window)
const CHAT_FOOTER_OFFSET_VAR = '--chat-footer-offset'

export interface UseChatFooterOffsetParams {
  rootRef: RefObject<HTMLElement | null>
}

// The fixed button and panel ride up with the footer's top edge instead of covering it: the
// variable holds how far the footer has come into the window
export const useChatFooterOffset = ({ rootRef }: UseChatFooterOffsetParams) => {
  const update = () => {
    const footer = document.getElementById(FOOTER_ID)
    if (!footer || !rootRef.current) return
    const offset = Math.max(0, window.innerHeight - footer.getBoundingClientRect().top)
    rootRef.current.style.setProperty(CHAT_FOOTER_OFFSET_VAR, `${offset}px`)
  }

  useMount(update)
  useEventListener(WINDOW_TARGET, 'scroll', update, { passive: true })
  useEventListener(WINDOW_TARGET, 'resize', update)
}
