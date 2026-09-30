import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useState } from 'react'

import { HEADER_LOGO_SELECTOR, HEADER_SELECTOR } from '@/config/dom'

gsap.registerPlugin(useGSAP, ScrollTrigger)

const HEADER_DURATION = 0.5
const HEADER_EASE = 'power2.out'

export const useHeaderReveal = () => {
  const [isHeroPassed, setIsHeroPassed] = useState(false)

  useGSAP((_context, contextSafe) => {
    const header = document.querySelector<HTMLElement>(HEADER_SELECTOR)
    const headerLogo = document.querySelector<HTMLElement>(HEADER_LOGO_SELECTOR)
    if (!header || !headerLogo || !contextSafe) return

    const hiddenY = () => -headerLogo.getBoundingClientRect().bottom
    gsap.set(headerLogo, { autoAlpha: 1 })
    gsap.set(header, { y: hiddenY })

    const slideHeader = contextSafe((isShown: boolean) => {
      setIsHeroPassed(isShown)
      gsap.to(header, {
        y: isShown ? 0 : hiddenY,
        duration: HEADER_DURATION,
        ease: HEADER_EASE,
        overwrite: true
      })
    })

    ScrollTrigger.create({
      start: () => window.innerHeight,
      onEnter: () => slideHeader(true),
      onLeaveBack: () => slideHeader(false)
    })
  })

  return {
    state: { isHeroPassed }
  }
}
