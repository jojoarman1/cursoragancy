import { useGSAP } from '@gsap/react'
import { useLatest, usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef } from 'react'

import { INTRO_DURATION, INTRO_EASE } from '@/config/animation'

gsap.registerPlugin(useGSAP)

export const COMPLETE_PROGRESS = 100
const PROGRESS_DURATION = 3
// If the content isn't ready yet, the counter holds here until it is
const WAITING_PROGRESS = 90

// The brackets lift and tilt apart with the counter's speed and settle when it stops
const BRACKET_SELECTOR = '[data-preloader-bracket]'
// Top speed of a power2.inOut tween is twice its average speed
const PEAK_SPEED = (2 * COMPLETE_PROGRESS) / PROGRESS_DURATION
const MAX_LIFT = 3 // px
const MAX_TILT = 8 // degrees
const TILT_DURATION = 0.3

export interface UsePreloaderParams {
  isComplete: boolean
  onFinish: () => void
}

// One continuous GSAP tween of the `--progress` CSS variable; the markup derives
// position and opacity of the numbers from it
export const usePreloader = ({ isComplete, onFinish }: UsePreloaderParams) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween>(null)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const latest = useLatest({ isComplete, onFinish, reduceMotion })

  useGSAP(
    () => {
      const progress = progressRef.current
      if (!progress) return

      // The left bracket tilts counterclockwise, the right one clockwise
      const brackets = gsap.utils.toArray<HTMLElement>(BRACKET_SELECTOR).map((bracket, index) => ({
        direction: index === 0 ? -1 : 1,
        lift: gsap.quickTo(bracket, 'y', { duration: TILT_DURATION, ease: 'power2.out' }),
        tilt: gsap.quickTo(bracket, 'rotation', { duration: TILT_DURATION, ease: 'power2.out' })
      }))

      // intensity: 0 when standing still, 1 at top speed
      const tiltBrackets = (intensity: number) => {
        for (const bracket of brackets) {
          bracket.lift(-intensity * MAX_LIFT)
          bracket.tilt(bracket.direction * intensity * MAX_TILT)
        }
      }

      let lastValue = 0
      let lastTime = gsap.ticker.time

      const tween = gsap.to(progress, {
        '--progress': COMPLETE_PROGRESS,
        duration: PROGRESS_DURATION,
        ease: 'power2.inOut',
        onUpdate: () => {
          const value = Number(gsap.getProperty(progress, '--progress'))
          progress.setAttribute('aria-valuenow', String(Math.round(value)))

          const time = gsap.ticker.time
          const speed = Math.abs(value - lastValue) / Math.max(time - lastTime, 1 / 120)
          lastValue = value
          lastTime = time

          if (!latest.ref.current.reduceMotion) {
            tiltBrackets(Math.min(speed / PEAK_SPEED, 1))
          }

          if (latest.ref.current.isComplete || value < WAITING_PROGRESS) return

          tween.pause()
          tiltBrackets(0)
        },
        onComplete: () => {
          tiltBrackets(0)
          latest.ref.current.onFinish()
          gsap.to(progress, { autoAlpha: 0, duration: INTRO_DURATION, ease: INTRO_EASE })
        }
      })

      tweenRef.current = tween
    },
    { scope: progressRef }
  )

  useGSAP(
    () => {
      if (isComplete) tweenRef.current?.resume()
    },
    { dependencies: [isComplete] }
  )

  return {
    refs: { progressRef }
  }
}
