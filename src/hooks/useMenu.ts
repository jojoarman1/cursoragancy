import { useGSAP } from '@gsap/react'
import {
  target,
  useBoolean,
  useDisclosure,
  useEventListener,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { useRef } from 'react'

import {
  MENU_REVEAL_DURATION,
  MENU_REVEAL_EASE_CURVE,
  MENU_REVEAL_STAGGER,
  PANEL_CONTENT_DURATION,
  PANEL_CONTENT_EASE,
  PANEL_CONTENT_HIDE_DURATION,
  PANEL_CONTENT_OVERLAP,
  PANEL_EXPAND_DURATION,
  PANEL_EXPAND_EASE
} from '@/config/animation'
import { getButtonInset, getOpenInset, type MorphInset, toClipPath } from '@/lib/morphPanel'

gsap.registerPlugin(useGSAP, CustomEase)

const WINDOW_TARGET = target(() => window)

const REVEAL_SELECTOR = '[data-menu-reveal]'
// Clips only below the item, so it can overshoot upwards without its top being cut
const MASK_CLIP_PATH = 'inset(-100% -100% 0 -100%)'
const REVEAL_EASE = CustomEase.create('menuReveal', MENU_REVEAL_EASE_CURVE)

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
    const items = gsap.utils.toArray<HTMLElement>(REVEAL_SELECTOR, contentRef.current)
    const masks = items.map(item => item.parentElement)

    if (gsap.getProperty(panel, 'visibility') === 'hidden') {
      Object.assign(insetRef.current, getButtonInset(panel, button))
      renderInset()
    }

    playTimeline(
      gsap
        .timeline()
        .set(button, { autoAlpha: 0 })
        .set(panel, { autoAlpha: 1 })
        .set(masks, { clipPath: MASK_CLIP_PATH })
        .to(insetRef.current, {
          ...getOpenInset(panel),
          duration: PANEL_EXPAND_DURATION,
          ease: PANEL_EXPAND_EASE,
          onUpdate: renderInset
        })
        .to(
          contentRef.current,
          { autoAlpha: 1, duration: PANEL_CONTENT_DURATION, ease: PANEL_CONTENT_EASE },
          `-=${PANEL_CONTENT_OVERLAP}`
        )
        .fromTo(
          items,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: MENU_REVEAL_DURATION,
            ease: REVEAL_EASE,
            stagger: MENU_REVEAL_STAGGER
          },
          '<'
        )
        // Unclipped once risen, so focus outlines aren't cut off
        .set(masks, { clipPath: 'none' })
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
        .to(contentRef.current, { autoAlpha: 0, duration: PANEL_CONTENT_HIDE_DURATION })
        .to(insetRef.current, {
          ...getButtonInset(panel, button),
          duration: PANEL_EXPAND_DURATION,
          ease: PANEL_EXPAND_EASE,
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
