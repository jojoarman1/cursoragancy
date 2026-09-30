import { useGSAP } from '@gsap/react'
import {
  target,
  useLatest,
  useLockScroll,
  useMount,
  usePreferredReducedMotion
} from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { useRef, useState } from 'react'

import { INTRO_DURATION, INTRO_EASE } from '@/config/animation'
import { loadingStore, useIsContentReady, useIsLoadingFinished } from '@/stores/loading'

gsap.registerPlugin(useGSAP)

export const COMPLETE_PROGRESS = 100
const PROGRESS_DURATION = 3
const WAITING_PROGRESS = 90

const BRACKET_SELECTOR = '[data-preloader-bracket]'
// Top speed of a power2.inOut tween is twice its average speed
const PEAK_SPEED = (2 * COMPLETE_PROGRESS) / PROGRESS_DURATION
const MAX_LIFT = 3
const MAX_TILT = 8
const TILT_DURATION = 0.3

const BODY_TARGET = target(() => document.body)

export const usePreloader = () => {
  const overlayRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)
  const tweenRef = useRef<gsap.core.Tween>(null)
  const isContentReady = useIsContentReady()
  const isFinished = useIsLoadingFinished()
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const latest = useLatest({ isContentReady, reduceMotion })
  // Shown once per visit: coming back to the home page doesn't replay it
  const [isSkipped] = useState(() => loadingStore.get().isFinished)

  useLockScroll(BODY_TARGET, { enabled: !isFinished })

  useMount(() => {
    if (isSkipped) return

    window.history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
  })

  useGSAP(
    () => {
      const overlay = overlayRef.current
      const progress = progressRef.current
      if (!overlay || !progress) return

      const brackets = gsap.utils.toArray<HTMLElement>(BRACKET_SELECTOR).map((bracket, index) => ({
        direction: index === 0 ? -1 : 1,
        lift: gsap.quickTo(bracket, 'y', { duration: TILT_DURATION, ease: 'power2.out' }),
        tilt: gsap.quickTo(bracket, 'rotation', { duration: TILT_DURATION, ease: 'power2.out' })
      }))

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

          if (latest.ref.current.isContentReady || value < WAITING_PROGRESS) return

          tween.pause()
          tiltBrackets(0)
        },
        onComplete: () => {
          tiltBrackets(0)
          loadingStore.set({ isFinished: true })
          gsap.to(overlay, { autoAlpha: 0, duration: INTRO_DURATION, ease: INTRO_EASE })
        }
      })

      tweenRef.current = tween
    },
    { scope: overlayRef }
  )

  useGSAP(
    () => {
      if (isContentReady) tweenRef.current?.resume()
    },
    { dependencies: [isContentReady] }
  )

  return {
    state: { isSkipped },
    refs: { overlayRef, progressRef }
  }
}
