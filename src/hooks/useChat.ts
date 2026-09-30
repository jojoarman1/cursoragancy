import { useGSAP } from '@gsap/react'
import {
  target,
  useDisclosure,
  useEventListener,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

import { INTRO_DURATION } from '@/config/animation'
import { useIsLoadingFinished } from '@/stores/loading'

gsap.registerPlugin(useGSAP, CustomEase)

const WINDOW_TARGET = target(() => window)

const BUTTON_FADE_DURATION = 1
const BUTTON_FADE_EASE = CustomEase.create('chatButtonFade', '0.31, 0.13, 0.11, 1')

const EXPAND_DURATION = 0.8
const EXPAND_EASE = 'power3.inOut'
const CONTENT_DURATION = 0.5
const CONTENT_HIDE_DURATION = 0.3
const CONTENT_EASE = 'power1.out'

const BUTTON_COLOR = '#ffffff'
const PANEL_COLOR = '#d7d7d8'
const COLOR_DURATION = 0.5
const COLOR_EASE = 'sine.inOut'

const JUMP_SELECTOR = '[data-chat-jump-dot]'
const JUMP_HEIGHT = 4
const JUMP_DURATION = 0.2
const JUMP_STAGGER = 0.12
const JUMP_REPEAT_DELAY = 1.5

const DOT_SELECTOR = '[data-chat-dot]'
const DOT_SCALE = 1 / 3
// Slightly over 1 so the dashes overlap without seams
const LINE_SCALE = 1.1
const DOTS_DURATION = 0.5
const DOTS_EASE = 'power2.inOut'

const RADIUS = 17
const OPEN_INSET = { top: 0, right: 0 }

// Clips the panel down to the chat button, which shares its bottom-left corner
const getClosedInset = (panel: HTMLElement, button: HTMLElement) => ({
  top: panel.offsetHeight - button.offsetHeight,
  right: panel.offsetWidth - button.offsetWidth
})

export interface UseChatParams {
  onContentShow: () => void
  onClosed: () => void
}

export const useChat = ({ onContentShow, onClosed }: UseChatParams) => {
  const isHome = usePathname() === '/'
  const isLoadingFinished = useIsLoadingFinished()
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const panelDisclosure = useDisclosure()

  const rootRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<gsap.core.Timeline>(null)
  const jumpRef = useRef<gsap.core.Timeline>(null)
  // Tweened as numbers: the browser shortens a zero inset() string, which breaks
  // GSAP's string interpolation and squares the corners
  const insetRef = useRef({ ...OPEN_INSET })

  // On the home page the button waits for the preloader and the logo intro
  const isVisible = !isHome || isLoadingFinished

  const { contextSafe } = useGSAP(
    () => {
      if (!isVisible) return

      const delay = isHome && !reduceMotion ? INTRO_DURATION : 0

      gsap.fromTo(
        buttonRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          delay,
          duration: reduceMotion ? 0 : BUTTON_FADE_DURATION,
          ease: BUTTON_FADE_EASE
        }
      )

      if (reduceMotion) return

      jumpRef.current = gsap
        .timeline({ delay, repeat: -1, repeatDelay: JUMP_REPEAT_DELAY })
        .to(JUMP_SELECTOR, {
          y: -JUMP_HEIGHT,
          duration: JUMP_DURATION,
          ease: 'power1.out',
          yoyo: true,
          repeat: 1,
          stagger: JUMP_STAGGER
        })
    },
    { dependencies: [isVisible], scope: rootRef }
  )

  useGSAP(() => gsap.set(DOT_SELECTOR, { scaleX: DOT_SCALE }), { scope: rootRef })

  const renderInset = contextSafe(() => {
    const panel = panelRef.current
    const closeButton = closeButtonRef.current
    if (!panel || !closeButton) return

    const { top, right } = insetRef.current
    panel.style.clipPath = `inset(${top}px ${right}px 0px 0px round ${RADIUS}px)`
    closeButton.style.transform = `translate(${-right}px, ${top}px)`
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
    jumpRef.current?.pause(0)

    // The panel size may have changed while it was hidden
    if (gsap.getProperty(panel, 'visibility') === 'hidden') {
      Object.assign(insetRef.current, getClosedInset(panel, button))
      renderInset()
    }

    playTimeline(
      gsap
        .timeline()
        .set(button, { autoAlpha: 0 })
        .set(panel, { autoAlpha: 1 })
        .to(insetRef.current, {
          ...OPEN_INSET,
          duration: EXPAND_DURATION,
          ease: EXPAND_EASE,
          onUpdate: renderInset
        })
        .fromTo(
          panel,
          { backgroundColor: BUTTON_COLOR },
          { backgroundColor: PANEL_COLOR, duration: COLOR_DURATION, ease: COLOR_EASE },
          0
        )
        .to(DOT_SELECTOR, { scaleX: LINE_SCALE, duration: DOTS_DURATION, ease: DOTS_EASE }, 0)
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
            jumpRef.current?.restart(true)
            onClosed()
          }
        })
        .to(contentRef.current, { autoAlpha: 0, duration: CONTENT_HIDE_DURATION })
        .to(insetRef.current, {
          ...getClosedInset(panel, button),
          duration: EXPAND_DURATION,
          ease: EXPAND_EASE,
          onUpdate: renderInset
        })
        .to(
          DOT_SELECTOR,
          { scaleX: DOT_SCALE, duration: DOTS_DURATION, ease: DOTS_EASE },
          `>-${DOTS_DURATION}`
        )
        .to(
          panel,
          { backgroundColor: BUTTON_COLOR, duration: COLOR_DURATION, ease: COLOR_EASE },
          '<'
        )
        .set(panel, { autoAlpha: 0 })
        .set(button, { autoAlpha: 1 })
    )
  })

  // iOS keeps the layout size when its keyboard opens; the panel follows the visible area instead.
  // A plain effect: reactuse targets don't accept VisualViewport
  useEffect(() => {
    const panel = panelRef.current
    const visualViewport = window.visualViewport
    if (!panelDisclosure.opened || !panel || !visualViewport) return

    const fitVisualViewport = () => {
      const hiddenBottom = window.innerHeight - visualViewport.height - visualViewport.offsetTop
      panel.style.setProperty('--chat-viewport-top', `${visualViewport.offsetTop}px`)
      panel.style.setProperty('--chat-viewport-bottom', `${Math.max(hiddenBottom, 0)}px`)
    }

    visualViewport.addEventListener('resize', fitVisualViewport)
    visualViewport.addEventListener('scroll', fitVisualViewport)
    return () => {
      visualViewport.removeEventListener('resize', fitVisualViewport)
      visualViewport.removeEventListener('scroll', fitVisualViewport)
    }
  }, [panelDisclosure.opened])

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
    refs: { rootRef, buttonRef, panelRef, closeButtonRef, contentRef },
    functions: { open, close }
  }
}
