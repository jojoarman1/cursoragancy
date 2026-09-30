import { useRaf } from '@siberiacancode/reactuse'
import { useRef, useState } from 'react'

// Percent per second: the counter takes at least ~1.2s even when everything is cached
const PROGRESS_SPEED = 80
// The counter waits here until the content is actually ready
const WAITING_PROGRESS = 90
export const COMPLETE_PROGRESS = 100
// useRaf reports the first delta since page load, so long frames are clamped
const MAX_FRAME_DELTA = 1000 / 30

export interface UsePreloaderParams {
  isComplete: boolean
  onFinish: () => void
}

export const usePreloader = ({ isComplete, onFinish }: UsePreloaderParams) => {
  const progressRef = useRef<HTMLDivElement>(null)
  const valueRef = useRef(0)
  const [isFinished, setIsFinished] = useState(false)

  // Updates the DOM directly: re-rendering React on every frame is unnecessary
  useRaf(
    ({ delta }) => {
      const target = isComplete ? COMPLETE_PROGRESS : WAITING_PROGRESS
      const step = (PROGRESS_SPEED * Math.min(delta, MAX_FRAME_DELTA)) / 1000
      valueRef.current = Math.min(valueRef.current + step, target)

      const value = Math.round(valueRef.current)
      const progress = progressRef.current
      if (progress) {
        progress.textContent = `${value}%`
        progress.setAttribute('aria-valuenow', String(value))
      }

      if (value < COMPLETE_PROGRESS) return

      setIsFinished(true)
      onFinish()
    },
    { enabled: !isFinished }
  )

  return {
    state: { isFinished },
    refs: { progressRef }
  }
}
