'use client'

import type { ComponentProps } from 'react'

import { useReelPlayback } from '@/hooks/useReelPlayback'

type ProjectArticleProps = Omit<ComponentProps<'article'>, 'ref'>

// The project's hover / in-view area: [data-active] here opens the reel inside the cover
export const ProjectArticle = (props: ProjectArticleProps) => {
  const reelPlayback = useReelPlayback()

  return (
    <article
      ref={reelPlayback.refs.areaRef}
      data-active={reelPlayback.state.isActive || undefined}
      {...props}
    />
  )
}
