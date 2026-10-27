'use client'

import Image from 'next/image'
import type { CSSProperties } from 'react'

import {
  COVER_ASPECT_RATIO,
  COVER_IMAGE_QUALITY,
  type Project,
  REEL_WIDTH_SHARE
} from '@/config/projects'
import { getReelDropPercent } from '@/lib/projectReel'

// The cover's share of the viewport: full width on phones, 875 of the 1920 artboard otherwise
const COVER_SIZES = '(width < 1024px) 100vw, 48vw'

// The reel box's inline style, with the drop distance as a CSS variable for .project-reel
type ReelStyle = CSSProperties & { '--reel-drop': string }

interface ProjectCoverProps {
  project: Pick<Project, 'title' | 'cover' | 'logo' | 'reel'>
}

export const ProjectCover = ({ project }: ProjectCoverProps) => {
  const reelStyle: ReelStyle = {
    width: `${REEL_WIDTH_SHARE * 100}%`,
    aspectRatio: project.reel.aspectRatio,
    '--reel-drop': `${getReelDropPercent(project.reel.aspectRatio)}%`
  }

  return (
    <div
      className='project-cover relative overflow-hidden rounded-sm bg-foreground/10'
      style={{ aspectRatio: COVER_ASPECT_RATIO }}
    >
      <Image
        src={project.cover}
        alt={project.title}
        fill
        sizes={COVER_SIZES}
        quality={COVER_IMAGE_QUALITY}
        className='object-cover'
      />
      {!!project.logo && (
        // Before the dimming and the reel, which cover it. Turned white and blended as difference, so a logo of any colour reads
        // on both light and dark parts of the photo. A .svg src is served unoptimised
        <Image
          src={project.logo.src}
          alt=''
          width={project.logo.width}
          height={project.logo.height}
          className='pointer-events-none absolute top-1/2 left-1/2 w-[20%] -translate-1/2 brightness-0 invert mix-blend-difference'
        />
      )}
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
