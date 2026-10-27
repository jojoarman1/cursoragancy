'use client'

import { useState } from 'react'

import type { Service } from '@/config/services'

import { LensCollage } from './LensCollage'

interface ServiceArtworkProps {
  service: Service
  isActive: boolean
}

// One service's picture: its lens collage. Every service's picture is stacked and only the active
// one shows: the collage itself comes in and leaves (a hidden one draws nothing). Its WebGL canvas
// is only created once its service has been shown
export const ServiceArtwork = ({ service, isActive }: ServiceArtworkProps) => {
  const [hasShown, setHasShown] = useState(isActive)
  // Updating state during render (not in an effect) is React's pattern for "remember it happened"
  if (isActive && !hasShown) setHasShown(true)

  return (
    <div aria-hidden='true' className='pointer-events-none absolute inset-0'>
      {hasShown && <LensCollage art={service.art} isActive={isActive} />}
    </div>
  )
}
