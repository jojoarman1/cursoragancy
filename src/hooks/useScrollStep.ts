import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useRef, useState } from 'react'

gsap.registerPlugin(useGSAP, ScrollTrigger)

// Scroll per step while pinned, in % of the screen height
const STEP_DISTANCE = 50

export interface UseScrollStepParams {
  count: number
}

// Pins the element once its top reaches the top of the screen and turns the next stretch of
// scrolling into `count` steps; after the last one the page scrolls on
export const useScrollStep = <Target extends HTMLElement>({ count }: UseScrollStepParams) => {
  const triggerRef = useRef<Target>(null)
  const [step, setStep] = useState(0)

  useGSAP(
    () => {
      ScrollTrigger.create({
        trigger: triggerRef.current,
        start: 'top top',
        end: `+=${count * STEP_DISTANCE}%`,
        pin: true,
        onUpdate: ({ progress }) => setStep(Math.min(count - 1, Math.floor(progress * count)))
      })
    },
    { dependencies: [count], revertOnUpdate: true }
  )

  return {
    state: { step },
    refs: { triggerRef }
  }
}
