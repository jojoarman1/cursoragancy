'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'

import {
  COVER_ASPECT_RATIO,
  COVER_IMAGE_QUALITY,
  type Project,
  REEL_WIDTH_SHARE
} from '@/config/projects'
import { useFlowDistortion } from '@/hooks/useFlowDistortion'
import { getReelDropPercent } from '@/lib/projectReel'

// The cover's share of the viewport: full width on phones, 875 of the 1920 artboard otherwise
const COVER_SIZES = '(width < 1024px) 100vw, 46vw'

// The reel box's inline style, with the drop distance as a CSS variable for .project-reel
type ReelStyle = CSSProperties & { '--reel-drop': string }

interface ProjectCoverProps {
  project: Pick<Project, 'title' | 'cover' | 'reel'>
}

export const ProjectCover = ({ project }: ProjectCoverProps) => {
  const flowDistortion = useFlowDistortion()
  const reelStyle: ReelStyle = {
    width: `${REEL_WIDTH_SHARE * 100}%`,
    aspectRatio: project.reel.aspectRatio,
    '--reel-drop': `${getReelDropPercent(project.reel.aspectRatio)}%`
  }

  return (
    <div
      ref={flowDistortion.refs.coverRef}
      className='project-cover relative overflow-hidden rounded-sm bg-foreground/10'
      style={{ aspectRatio: COVER_ASPECT_RATIO }}
    >
      <Image
        ref={flowDistortion.refs.imageRef}
        src={project.cover}
        alt={project.title}
        fill
        sizes={COVER_SIZES}
        quality={COVER_IMAGE_QUALITY}
        className='object-cover'
      />
      {/* The flow distortion redraws the photo here while the mouse stirs it; hidden otherwise */}
      <canvas
        ref={flowDistortion.refs.canvasRef}
        className='pointer-events-none absolute inset-0 size-full opacity-0'
      />
      {/* Dims the photo while the reel plays, so the video stands out */}
      <div
        aria-hidden='true'
        className='project-dim pointer-events-none absolute inset-0 bg-black/50'
      />
      {/* The hover reel (.project-reel in globals.css): a video box in the middle of the cover */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 flex items-center justify-center'
      >
        <div className='project-reel-grow' style={reelStyle}>
          <div className='project-reel size-full overflow-clip rounded-[2.4rem] bg-foreground'>
            <video
              src={project.reel.video}
              poster={project.reel.poster}
              preload='none'
              muted
              loop
              playsInline
              className='size-full object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  )
}
