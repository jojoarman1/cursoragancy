'use client'

import clsx from 'clsx'
import { useState } from 'react'

import type { Service } from '@/config/services'

import { LensCollage } from './LensCollage'

interface ServiceArtworkProps {
  service: Service
  isActive: boolean
}

// One service's picture: its lens collage. Every service's picture is stacked and only the active
// one shows; a collage's WebGL canvas is only created once its service has been shown
export const ServiceArtwork = ({ service, isActive }: ServiceArtworkProps) => {
  const [hasShown, setHasShown] = useState(isActive)
  // Updating state during render (not in an effect) is React's pattern for "remember it happened"
  if (isActive && !hasShown) setHasShown(true)

  return (
    <div
      aria-hidden='true'
      className={clsx(
        'absolute inset-0 transition-[opacity,scale] ease-expo-out',
        // The outgoing picture shrinks away quickly, the incoming one fades in a touch slower
        isActive ? 'opacity-100 duration-700' : 'scale-95 opacity-0 duration-400'
      )}
    >
      {hasShown && <LensCollage art={service.art} isActive={isActive} />}
    </div>
  )
}
