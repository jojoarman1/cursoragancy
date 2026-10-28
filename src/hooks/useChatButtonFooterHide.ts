import { useGSAP } from '@gsap/react'
import { target, useIntersectionObserver, useLatest } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import type { RefObject } from 'react'

import { FOOTER_ID } from '@/config/navigation'

gsap.registerPlugin(useGSAP)

// The footer is in the same (main) layout as the chat, so it's always there
const FOOTER_TARGET = target(() => document.getElementById(FOOTER_ID) as HTMLElement)
const FADE_DURATION = 0.4

export interface UseChatButtonFooterHideParams {
  buttonRef: RefObject<HTMLButtonElement | null>
  isOpen: boolean
}

// The footer has its own "Старт" that opens the chat, and the floating button would cover it
export const useChatButtonFooterHide = ({ buttonRef, isOpen }: UseChatButtonFooterHideParams) => {
  const footerObserver = useIntersectionObserver(FOOTER_TARGET, { threshold: 0 })
  const isFooterInView = !!footerObserver.entries?.[0]?.isIntersecting
  const latestIsFooterInView = useLatest(isFooterInView)

  useGSAP(
    context => {
      // Keep the rendered opacity, but release tweens from earlier footer crossings.
      context.kill()
      // While the panel is open, it owns the button
      if (isOpen) return
      gsap.to(buttonRef.current, {
        autoAlpha: isFooterInView ? 0 : 1,
        duration: FADE_DURATION,
        ease: 'power2.out',
        overwrite: 'auto'
      })
    },
    { dependencies: [isFooterInView] }
  )

  // Read when the panel closes: the button only comes back if the footer is out of view
  return { state: { latestIsFooterInView } }
}
