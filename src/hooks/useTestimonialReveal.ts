import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { useRef } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText)

// Share cut off each side of the card before it widens to full
const START_INSET = 22
// The card's rounded-sm: the clip has to round its corners too, or they turn square while it widens
const CARD_RADIUS = '4rem'
// Seconds the animation trails the scroll by, so it doesn't jitter with the wheel
const SCRUB = 0.6
// Timeline units. The quote starts typing just after the card starts widening, not once it is
// done, and the author comes in after the last letter
const EXPAND_DURATION = 1
const TYPING_DURATION = 1.4
// The author plays as its own animation, not tied to the scroll, once the quote is typed
const AUTHOR_SHOW_AT = 0.98
const AVATAR_DURATION = 0.7
const AVATAR_EASE = 'back.out(1.8)'
const AUTHOR_LINE_DURATION = 0.8
const AUTHOR_LINE_EASE = 'power3.out'
const AUTHOR_LINE_STAGGER = 0.08
const AVATAR_SELECTOR = '[data-author-avatar]'
const AUTHOR_LINE_SELECTOR = '[data-author-line]'
const TYPING_OFFSET = 0.15

// Scroll-linked over the card's way up the screen: it widens while the quote types itself out
// letter by letter; then the avatar pops in and the name and role rise from under their lines.
// Scrolling back undoes it. The card scrolls with
// the page the whole time (no pinning)
export const useTestimonialReveal = () => {
  const cardRef = useRef<HTMLElement>(null)
  const quoteRef = useRef<HTMLQuoteElement>(null)
  const authorRef = useRef<HTMLElement>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  useGSAP(
    () => {
      if (reduceMotion || !cardRef.current || !quoteRef.current) return

      const author = gsap
        .timeline({ paused: true })
        .from(AVATAR_SELECTOR, {
          scale: 0.4,
          opacity: 0,
          duration: AVATAR_DURATION,
          ease: AVATAR_EASE
        })
        .from(
          AUTHOR_LINE_SELECTOR,
          {
            yPercent: 110,
            duration: AUTHOR_LINE_DURATION,
            ease: AUTHOR_LINE_EASE,
            stagger: AUTHOR_LINE_STAGGER
          },
          0.1
        )

      const toggleAuthor = (progress: number) => {
        if (progress >= AUTHOR_SHOW_AT) author.play()
        else author.reverse()
      }

      // Words keep their letters together, so lines wrap as in the plain text
      const split = SplitText.create(quoteRef.current, { type: 'words,chars', tag: 'span' })
      gsap
        .timeline({
          defaults: { ease: 'none' },
          scrollTrigger: {
            trigger: cardRef.current,
            start: 'top bottom',
            // Done by the time the card is mid-screen; clamp() pulls that back to the end of the page
            // while nothing comes after the card yet, so it always plays to the end
            end: 'clamp(center center)',
            scrub: SCRUB,
            // Also on refresh: a reload part-way down the page starts past the quote with no scroll
            onUpdate: ({ progress }) => toggleAuthor(progress),
            onRefresh: ({ progress }) => toggleAuthor(progress)
          }
        })
        .fromTo(
          cardRef.current,
          { clipPath: `inset(0% ${START_INSET}% 0% ${START_INSET}% round ${CARD_RADIUS})` },
          { clipPath: `inset(0% 0% 0% 0% round ${CARD_RADIUS})`, duration: EXPAND_DURATION }
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
    },
    { dependencies: [reduceMotion], scope: authorRef, revertOnUpdate: true }
  )

  return {
    refs: { cardRef, quoteRef, authorRef }
  }
}
