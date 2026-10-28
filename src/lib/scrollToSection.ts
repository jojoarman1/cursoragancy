import gsap from 'gsap'
import { ScrollToPlugin } from 'gsap/ScrollToPlugin'
import type { MouseEvent } from 'react'

import { SECTION_SCROLL_DURATION, SECTION_SCROLL_EASE } from '@/config/animation'

gsap.registerPlugin(ScrollToPlugin)

// Smoothly scrolls to "/#works"-style links that point at a section of the current page, and
// to the top for a plain link to the current page (the header logo on home). Returns false when
// the link leads elsewhere, so the caller lets the router handle it
export const scrollToSection = (href: string) => {
  const url = new URL(href, window.location.href)
  if (url.pathname !== window.location.pathname) return false

  const section = url.hash ? document.querySelector(url.hash) : 0
  if (section === null) return false

  const isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  gsap.to(window, {
    // autoKill: a wheel or touch scroll from the user takes over instead of fighting the tween
    scrollTo: { y: section, autoKill: true },
    duration: isReducedMotion ? 0 : SECTION_SCROLL_DURATION,
    ease: SECTION_SCROLL_EASE,
    overwrite: true
  })
  // Without a hash this drops the old one, so the address is plain "/" again at the top
  // Next's History wrapper preserves its own state and synchronizes the router for app calls.
  window.history.replaceState(null, '', url.hash || url.pathname)
  return true
}

// onClick for section links: plain left clicks glide, modified ones (new tab etc.) stay default.
// Takes the React event: Next's Link reads defaultPrevented from it, not from the native one
export const handleSectionLinkClick = (event: MouseEvent, href: string) => {
  const isModified = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey
  if (!isModified && scrollToSection(href)) event.preventDefault()
}
