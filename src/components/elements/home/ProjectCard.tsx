import clsx from 'clsx'

import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { TileLink } from '@/components/layout/TileLink'
import type { Project } from '@/config/projects'

import { ProjectArticle } from './ProjectArticle'
import { ProjectCover } from './ProjectCover'
import { PROJECT_COLUMNS_CLASS_NAME } from './section.styles'

interface ProjectCardProps {
  project: Project
  counter: string
}

export const ProjectCard = ({ project, counter }: ProjectCardProps) => (
  <ProjectArticle
    className={clsx('grid', PROJECT_COLUMNS_CLASS_NAME, 'max-lg:grid-cols-1 max-lg:gap-y-4')}
  >
    <ProjectCover project={project} />

    <div className='flex flex-col'>
      <p className='text-[calc(12*var(--text-unit))] leading-[calc(16*var(--text-unit))] font-light tracking-[calc(-0.18*var(--text-unit))] text-foreground/60'>
        [{counter}]
      </p>
      <h3 className='mt-2 text-[calc(24*var(--text-unit))] leading-[calc(26.4*var(--text-unit))] font-bold tracking-[calc(-0.36*var(--text-unit))]'>
        {project.title}
      </h3>
      <p className='mt-3 text-lg leading-tight font-medium tracking-[-0.01em] text-muted'>
        {project.description}
      </p>

      {!!project.metric && (
        <div className='mt-4'>
          <span className='inline-block rounded-[2.4rem] bg-foreground px-1.5 py-0.5 text-[calc(20*var(--text-unit))] leading-[calc(22*var(--text-unit))] font-medium tracking-[-0.015em] text-background'>
            {project.metric.value}
          </span>
          <p className='mt-2 text-[calc(20*var(--text-unit))] leading-tight font-medium tracking-[-0.01em] text-foreground/80'>
            {project.metric.label}
          </p>
        </div>
      )}

      {!!project.url && (
        <TileLink
          href={project.url}
          target='_blank'
          rel='noreferrer'
          label='Перейти на сайт'
          icon={<ArrowUpIcon className='size-[calc(18*var(--text-unit))]' />}
          className='mt-auto self-end max-lg:mt-6'
        />
      )}
    </div>
  </ProjectArticle>
)
