'use client'

import { usePreventZoom } from '@/hooks/usePreventZoom'

export const ZoomLock = () => {
  usePreventZoom()

  return null
}
