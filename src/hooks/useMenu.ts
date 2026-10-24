import { useGSAP } from '@gsap/react'
import {
  target,
  useBoolean,
  useDisclosure,
  useEventListener,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { getButtonInset, getOpenInset, type MorphInset, toClipPath } from '@/lib/morphPanel'

gsap.registerPlugin(useGSAP)

const WINDOW_TARGET = target(() => window)

const EXPAND_DURATION = 0.9
const EXPAND_EASE = 'power3.inOut'
const CONTENT_DURATION = 0.5
const CONTENT_HIDE_DURATION = 0.3
const CONTENT_EASE = 'power1.out'

// The full-screen menu grows out of the header's "Меню" button, like the chat out of its button
export const useMenu = () => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const menuDisclosure = useDisclosure()
  // The menu's WebGL title is only created once the menu has been opened
  const [hasOpened, toggleHasOpened] = useBoolean()

  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const clipRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline>(null)
  const insetRef = useRef<MorphInset>({ top: 0, right: 0, bottom: 0, left: 0, radius: 0 })

  const { contextSafe } = useGSAP()

  const renderInset = contextSafe(() => {
    if (clipRef.current) clipRef.current.style.clipPath = toClipPath(insetRef.current)
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

    menuDisclosure.open()
    toggleHasOpened(true)

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
        .to(contentRef.current, { autoAlpha: 1, duration: CONTENT_DURATION, ease: CONTENT_EASE })
    )
  })

  const close = contextSafe(() => {
    const panel = panelRef.current
    const button = buttonRef.current
    if (!panel || !button) return

    menuDisclosure.close()

    playTimeline(
      gsap
        .timeline({ onComplete: () => button.focus() })
        .to(contentRef.current, { autoAlpha: 0, duration: CONTENT_HIDE_DURATION })
        .to(insetRef.current, {
          ...getButtonInset(panel, button),
          duration: EXPAND_DURATION,
          ease: EXPAND_EASE,
          onUpdate: renderInset
        })
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
    { enabled: menuDisclosure.opened }
  )

  return {
    state: { isOpen: menuDisclosure.opened, hasOpened },
    refs: { buttonRef, panelRef, clipRef, contentRef },
    functions: { open, close }
  }
}
