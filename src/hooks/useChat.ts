import { useGSAP } from '@gsap/react'
import {
  target,
  useDisclosure,
  useEventListener,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { CHAT_GOALS, type MetrikaGoal } from '@/config/analytics'
import {
  PANEL_CONTENT_DURATION,
  PANEL_CONTENT_EASE,
  PANEL_CONTENT_HIDE_DURATION,
  PANEL_CONTENT_OVERLAP,
  PANEL_EXPAND_DURATION,
  PANEL_EXPAND_EASE
} from '@/config/animation'
import { useChatAutoOpen } from '@/hooks/useChatAutoOpen'
import { useChatFooterOffset } from '@/hooks/useChatFooterOffset'
import { useVisualViewportOffset } from '@/hooks/useVisualViewportOffset'
import { CHAT_OPEN_EVENT } from '@/lib/chatEvents'
import { reachGoal } from '@/lib/metrika'
import { getButtonInset, getOpenInset, type MorphInset, toClipPath } from '@/lib/morphPanel'

gsap.registerPlugin(useGSAP)

const WINDOW_TARGET = target(() => window)

const ARROW_SELECTOR = '[data-chat-arrow]'
const MINUS_SELECTOR = '[data-chat-minus]'
// The button's label (RollingLabel) rises from under its line as the button comes back
const LABEL_SELECTOR = '[data-rolling-label]'
const LABEL_RISE_DURATION = 0.7
const LABEL_RISE_EASE = 'power3.out'

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
  const hasOpenedRef = useRef(false)

  useVisualViewportOffset({ targetRef: panelRef, isEnabled: panelDisclosure.opened })
  useChatFooterOffset({ rootRef })

  const { context, contextSafe } = useGSAP({ scope: rootRef })

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

  const openPanel = contextSafe((goal: MetrikaGoal) => {
    const panel = panelRef.current
    const button = buttonRef.current
    if (!panel || !button) return

    // Stop the previous transition without reverting its current position.
    context.kill()
    panelDisclosure.open()
    hasOpenedRef.current = true
    reachGoal(goal)

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
          duration: PANEL_EXPAND_DURATION,
          ease: PANEL_EXPAND_EASE,
          onUpdate: renderInset
        })
        // The button's arrow tile turns into the panel's close tile over the whole expansion
        .to(
          ARROW_SELECTOR,
          { opacity: 0, duration: PANEL_EXPAND_DURATION, ease: PANEL_EXPAND_EASE },
          0
        )
        .to(
          MINUS_SELECTOR,
          { opacity: 1, duration: PANEL_EXPAND_DURATION, ease: PANEL_EXPAND_EASE },
          0
        )
        .to(
          contentRef.current,
          { autoAlpha: 1, duration: PANEL_CONTENT_DURATION, ease: PANEL_CONTENT_EASE },
          `-=${PANEL_CONTENT_OVERLAP}`
        )
        // The form owns its own animations; keep its context separate from the panel's.
        .add(() => context.ignore(onContentShow), '<')
    )
  })

  const open = () => openPanel(CHAT_GOALS.open)

  // Someone who already opened the chat themselves isn't pushed into it again
  useChatAutoOpen({
    onReachEnd: () => {
      if (!hasOpenedRef.current) openPanel(CHAT_GOALS.autoOpen)
    }
  })

  const close = contextSafe(() => {
    const panel = panelRef.current
    const button = buttonRef.current
    if (!panel || !button) return

    context.kill()
    panelDisclosure.close()

    playTimeline(
      gsap
        .timeline({
          onComplete: () => {
            button.focus()
            context.ignore(onClosed)
          }
        })
        .to(contentRef.current, { autoAlpha: 0, duration: PANEL_CONTENT_HIDE_DURATION })
        .to(insetRef.current, {
          ...getButtonInset(panel, button),
          duration: PANEL_EXPAND_DURATION,
          ease: PANEL_EXPAND_EASE,
          onUpdate: renderInset
        })
        .to(
          MINUS_SELECTOR,
          { opacity: 0, duration: PANEL_EXPAND_DURATION, ease: PANEL_EXPAND_EASE },
          '<'
        )
        .to(
          ARROW_SELECTOR,
          { opacity: 1, duration: PANEL_EXPAND_DURATION, ease: PANEL_EXPAND_EASE },
          '<'
        )
        .set(panel, { autoAlpha: 0 })
        .set(button, { autoAlpha: 1 })
        .fromTo(
          button.querySelector(LABEL_SELECTOR),
          { yPercent: 110 },
          {
            yPercent: 0,
            duration: LABEL_RISE_DURATION,
            ease: LABEL_RISE_EASE,
            // GSAP leaves translate: none inline, which would switch off the CSS hover roll for good
            clearProps: 'transform,translate'
          }
        )
    )
  })

  useEventListener(WINDOW_TARGET, CHAT_OPEN_EVENT, () => open())

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
