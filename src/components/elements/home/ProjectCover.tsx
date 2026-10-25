'use client'

import Image from 'next/image'

import { COVER_IMAGE_QUALITY, type Project } from '@/config/projects'
import { useFlowDistortion } from '@/hooks/useFlowDistortion'
import { useReelPlayback } from '@/hooks/useReelPlayback'

// The cover's share of the viewport at each layout: 875 of 1920, two thirds, full width
const COVER_SIZES = '(width < 480px) 100vw, (width < 1024px) 66vw, 46vw'

interface ProjectCoverProps {
  project: Pick<Project, 'title' | 'cover' | 'reel'>
}

export const ProjectCover = ({ project }: ProjectCoverProps) => {
  const flowDistortion = useFlowDistortion()
  const reelPlayback = useReelPlayback({ hoverTargetRef: flowDistortion.refs.coverRef })

  return (
    <div
      ref={flowDistortion.refs.coverRef}
      className='project-cover group relative aspect-[875/576] overflow-hidden bg-foreground/10'
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
        className='pointer-events-none absolute inset-0 bg-black/50 opacity-0 transition-opacity duration-700 group-hover:opacity-100'
      />
      {/* The hover reel (.project-reel in globals.css): a video box in the middle of the cover */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 flex items-center justify-center'
      >
        <div
          className='project-reel-grow w-[45%]'
          style={{ aspectRatio: project.reel.aspectRatio }}
        >
          <div className='project-reel size-full overflow-clip rounded-[2.4rem] bg-foreground'>
            <video
              ref={reelPlayback.refs.videoRef}
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
