import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// Share cut off each side of the card before it widens to full
const START_INSET = 22
// Seconds the animation trails the scroll by, so it doesn't jitter with the wheel
const SCRUB = 0.6
// Timeline units. The quote starts typing just after the card starts widening, not once it is
// done, and the author comes in after the last letter
const EXPAND_DURATION = 1
const TYPING_DURATION = 1.4
const AUTHOR_DURATION = 0.3
const TYPING_OFFSET = 0.15

// Scroll-linked over the card's way up the screen: it widens while the quote types itself out
// letter by letter, then the author fades in; scrolling back undoes it. The card scrolls with
// the page the whole time (no pinning)
export const useTestimonialReveal = () => {
  const cardRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const authorRef = useRef<HTMLElement>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (reduceMotion || !cardRef.current || !quoteRef.current) return

      // Words keep their letters together, so lines wrap as in the plain text
      const split = SplitText.create(quoteRef.current, { type: 'words,chars' })
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top bottom',
            // Done by the time the card is mid-screen; clamp() pulls that back to the end of the page
            // while nothing comes after the card yet, so it always plays to the end
            end: 'clamp(center center)',
            scrub: SCRUB
          }
        })
        .fromTo(
          cardRef.current,
          { clipPath: `inset(0% ${START_INSET}% 0% ${START_INSET}%)` },
          { clipPath: 'inset(0% 0% 0% 0%)', duration: EXPAND_DURATION }
        )
        .from(
          split.chars,
          {
            opacity: 0,
            duration: TYPING_DURATION / split.chars.length,
            stagger: TYPING_DURATION / split.chars.length
          },
          `<${TYPING_OFFSET}`
        )
        .from(authorRef.current, { opacity: 0, y: 12, duration: AUTHOR_DURATION })
    },
    { dependencies: [reduceMotion], revertOnUpdate: true }
  )

  return {
    refs: { cardRef, quoteRef, authorRef }
  }
}
