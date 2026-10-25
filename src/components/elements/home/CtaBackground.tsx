import Image from 'next/image'
import type { RefObject } from 'react'

import { CTA_BACKGROUND } from '@/config/cta'
import { useFlowDistortion } from '@/hooks/useFlowDistortion'

interface CtaBackgroundProps {
  // The whole section, so the photo stirs wherever the pointer is over it, text included
  areaRef: RefObject<HTMLElement | null>
}

// The section's photo with the project covers' cursor distortion, dimmed so the text reads
export const CtaBackground = ({ areaRef }: CtaBackgroundProps) => {
  const flowDistortion = useFlowDistortion({ areaRef })

  return (
    <div ref={flowDistortion.refs.coverRef} aria-hidden='true' className='absolute inset-0'>
      <Image
        ref={flowDistortion.refs.imageRef}
        src={CTA_BACKGROUND}
        alt=''
        fill
        sizes='100vw'
        className='object-cover'
      />
      <canvas
        ref={flowDistortion.refs.canvasRef}
        className='pointer-events-none absolute inset-0 size-full opacity-0'
      />
      <div className='absolute inset-0 bg-foreground/65' />
    </div>
  )
}
