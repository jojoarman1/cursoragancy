import { useGSAP } from '@gsap/react'
import {
  target,
  useDisclosure,
  useEventListener,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { useChatButtonIntro } from '@/hooks/useChatButtonIntro'
import { useVisualViewportOffset } from '@/hooks/useVisualViewportOffset'
import { getButtonInset, getOpenInset, type MorphInset, toClipPath } from '@/lib/morphPanel'

gsap.registerPlugin(useGSAP)

const WINDOW_TARGET = target(() => window)

const EXPAND_DURATION = 0.8
const EXPAND_EASE = 'power3.inOut'
const CONTENT_DURATION = 0.5
const CONTENT_HIDE_DURATION = 0.3
const CONTENT_EASE = 'power1.out'

const ARROW_SELECTOR = '[data-chat-arrow]'
const MINUS_SELECTOR = '[data-chat-minus]'

export interface UseChatParams {
  onContentShow: () => void
  onClosed: () => void
}

export const useChat = ({ onContentShow, onClosed }: UseChatParams) => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const panelDisclosure = useDisclosure()

  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline>(null)
  // Tweened as numbers: the browser shortens a zero inset() string, which breaks
  // GSAP's string interpolation and squares the corners
  const insetRef = useRef<MorphInset>({ top: 0, right: 0, bottom: 0, left: 0, radius: 0 })

  useChatButtonIntro({ buttonRef })
  useVisualViewportOffset({ targetRef: panelRef, isEnabled: panelDisclosure.opened })

  const { contextSafe } = useGSAP({ scope: rootRef })

  const renderInset = contextSafe(() => {
    const clip = clipRef.current
    const closeButton = closeButtonRef.current
    if (!clip || !closeButton) return

    const inset = insetRef.current
    clip.style.clipPath = toClipPath(inset)
    closeButton.style.transform = `translate(${-inset.right}px, ${inset.top}px)`
  })

  const playTimeline = contextSafe((timeline: gsap.core.Timeline) => {
    timelineRef.current?.kill()
    timelineRef.current = timeline
    if (reduceMotion) timeline.progress(1)
  })

  const open = contextSafe(() => {
    const panel = panelRef.current
    const button = buttonRef.current
    if (!panel || !button) return

    panelDisclosure.open()

    // The panel size may have changed while it was hidden
    if (gsap.getProperty(panel, 'visibility') === 'hidden') {
      Object.assign(insetRef.current, getButtonInset(panel, button))
      renderInset()
    }

    playTimeline(
      gsap
        .timeline()
        .set(button, { autoAlpha: 0 })
        .set(panel, { autoAlpha: 1 })
        .to(insetRef.current, {
          ...getOpenInset(panel),
          duration: EXPAND_DURATION,
          ease: EXPAND_EASE,
          onUpdate: renderInset
        })
        // The button's arrow tile turns into the panel's close tile over the whole expansion
        .to(ARROW_SELECTOR, { opacity: 0, duration: EXPAND_DURATION, ease: EXPAND_EASE }, 0)
        .to(MINUS_SELECTOR, { opacity: 1, duration: EXPAND_DURATION, ease: EXPAND_EASE }, 0)
        .to(contentRef.current, { autoAlpha: 1, duration: CONTENT_DURATION, ease: CONTENT_EASE })
        .add(onContentShow, '<')
    )
  })

  const close = contextSafe(() => {
    const panel = panelRef.current
    const button = buttonRef.current
    if (!panel || !button) return

    panelDisclosure.close()

    playTimeline(
      gsap
        .timeline({
          onComplete: () => {
            button.focus()
            onClosed()
          }
        })
        .to(contentRef.current, { autoAlpha: 0, duration: CONTENT_HIDE_DURATION })
        .to(insetRef.current, {
          ...getButtonInset(panel, button),
          duration: EXPAND_DURATION,
          ease: EXPAND_EASE,
          onUpdate: renderInset
        })
        .to(MINUS_SELECTOR, { opacity: 0, duration: EXPAND_DURATION, ease: EXPAND_EASE }, '<')
        .to(ARROW_SELECTOR, { opacity: 1, duration: EXPAND_DURATION, ease: EXPAND_EASE }, '<')
        .set(panel, { autoAlpha: 0 })
        .set(button, { autoAlpha: 1 })
    )
  })

  useEventListener(
    WINDOW_TARGET,
    'keydown',
    (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    },
    { enabled: panelDisclosure.opened }
  )

  return {
    state: { isOpen: panelDisclosure.opened },
    refs: { rootRef, buttonRef, panelRef, clipRef, closeButtonRef, contentRef },
    functions: { open, close }
  }
}
