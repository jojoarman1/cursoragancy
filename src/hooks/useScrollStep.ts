import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Scroll per step while pinned, in % of the screen height
const STEP_DISTANCE = 50
// Same edge as Tailwind's max-lg: phones get the unpinned version
const PINNED_QUERY = '(width >= 1024px)'
const UNPINNED_QUERY = '(width < 1024px)'

export interface UseScrollStepParams {
  count: number
}

// Turns scrolling into `count` steps. From 1024px up the element pins once its top reaches the
// top of the screen and the steps happen while it stays put; below that it scrolls normally and
// the steps run from it entering the screen until its bottom passes 40% (clamped to the page end)
export const useScrollStep = <Target extends HTMLElement>({ count }: UseScrollStepParams) => {
  const triggerRef = useRef<Target>(null)
  const [step, setStep] = useState(0)

  useGSAP(
    () => {
      const onUpdate = ({ progress }: ScrollTrigger) =>
        setStep(Math.min(count - 1, Math.floor(progress * count)))
      const mm = gsap.matchMedia()

      mm.add(PINNED_QUERY, () => {
        ScrollTrigger.create({
          trigger: triggerRef.current,
          start: 'top top',
          end: `+=${count * STEP_DISTANCE}%`,
          pin: true,
          onUpdate
        })
      })
      mm.add(UNPINNED_QUERY, () => {
        ScrollTrigger.create({
          trigger: triggerRef.current,
          start: 'top bottom',
          end: 'clamp(bottom 40%)',
          onUpdate
        })
      })
    },
    { dependencies: [count], revertOnUpdate: true }
  )

  return {
    state: { step },
    refs: { triggerRef }
  }
}
