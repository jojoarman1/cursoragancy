'use client'

import { SITE_CONFIG } from '@/config/site'
import { type UsePrismTitleParams, usePrismTitle } from '@/hooks/usePrismTitle'

import { PrismTitleFallback } from './PrismTitleFallback'

type PrismTitleSceneProps = Omit<UsePrismTitleParams, 'text'>

export const PrismTitleScene = (props: PrismTitleSceneProps) => {
  const prismTitle = usePrismTitle({ ...props, text: SITE_CONFIG.name })

  if (!prismTitle.state.isSupported) return <PrismTitleFallback />

  return (
    <canvas
      ref={prismTitle.refs.canvasRef}
      className='pointer-events-none absolute inset-0 size-full select-none'
    />
  )
}
