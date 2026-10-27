'use client'

import clsx from 'clsx'
import Image from 'next/image'

import { LENS_IMAGE_SIZES, LENS_OVERFLOW } from '@/config/lens'
import type { ServiceArt } from '@/config/services'
import { useLensCollage } from '@/hooks/useLensCollage'

// Reaches past the column by LENS_OVERFLOW on every side. The size is explicit: left + right don't
// stretch a canvas, it would take its buffer size (2x on retina)
const CANVAS_STYLE = {
  left: `${-LENS_OVERFLOW.x * 100}%`,
  top: `${-LENS_OVERFLOW.y * 100}%`,
  width: `${(1 + LENS_OVERFLOW.x * 2) * 100}%`,
  height: `${(1 + LENS_OVERFLOW.y * 2) * 100}%`
}

interface LensCollageProps {
  art: ServiceArt
  isActive: boolean
}

// The service collage through a lens (WebGL), coming in when shown, leaving when not, and drifting
// with the pointer; plain stacked images that fade without WebGL
export const LensCollage = ({ art, isActive }: LensCollageProps) => {
  const lensCollage = useLensCollage({ art, isActive })

  if (!lensCollage.state.isSupported) {
    return (
      <div
        className={clsx(
          'absolute inset-0 transition-opacity duration-500',
          isActive ? 'opacity-100' : 'opacity-0'
        )}
      >
        <Image
          src={art.background}
          alt=''
          fill
          sizes={LENS_IMAGE_SIZES}
          className={clsx(art.isSheet ? 'object-cover' : 'object-contain')}
        />
        {!!art.foreground && (
          <Image
            src={art.foreground}
            alt=''
            fill
            sizes={LENS_IMAGE_SIZES}
            className='object-contain'
          />
        )}
      </div>
    )
  }

  return <canvas ref={lensCollage.refs.canvasRef} className='absolute' style={CANVAS_STYLE} />
}
