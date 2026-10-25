import {
  useEventListener,
  useMediaQuery,
  usePreferredReducedMotion,
  useUnmount
} from '@siberiacancode/reactuse'
import { type RefObject, useRef } from 'react'

import { FINE_POINTER_QUERY } from '@/config/media'
import { createFlowDistortion, type FlowDistortion } from '@/lib/flowDistortion'

export interface UseFlowDistortionParams {
  // Where the pointer stirs the photo, when that is more than the photo itself (a whole section)
  areaRef?: RefObject<HTMLElement | null>
}

// The photo smears after the mouse like liquid and settles back. WebGL is only set up on the
// first hover, from the already loaded <img>, so covers nobody hovers cost nothing
export const useFlowDistortion = ({ areaRef }: UseFlowDistortionParams = {}) => {
  const coverRef = useRef<HTMLDivElement>(null)
  const pointerAreaRef = areaRef ?? coverRef
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const distortionRef = useRef<FlowDistortion>(null)
  const isFinePointer = useMediaQuery(FINE_POINTER_QUERY)
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const isEnabled = isFinePointer && !reduceMotion

  const getDistortion = () => {
    const canvas = canvasRef.current
    const image = imageRef.current
    if (!distortionRef.current && canvas && image?.complete && image.naturalWidth) {
      distortionRef.current = createFlowDistortion(canvas, image)
    }
    return distortionRef.current
  }

  useEventListener(pointerAreaRef, 'pointerenter', (event: PointerEvent) => {
    if (isEnabled) getDistortion()?.enter(event.clientX, event.clientY)
  })
  useEventListener(pointerAreaRef, 'pointermove', (event: PointerEvent) => {
    if (isEnabled) distortionRef.current?.move(event.clientX, event.clientY)
  })

  useUnmount(() => distortionRef.current?.destroy())

  return {
    refs: { coverRef, canvasRef, imageRef }
  }
}
