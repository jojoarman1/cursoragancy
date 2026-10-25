import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { TileLink } from '@/components/layout/TileLink'
import type { Project } from '@/config/projects'

import { ProjectArticle } from './ProjectArticle'
import { ProjectCover } from './ProjectCover'

interface ProjectCardProps {
  project: Project
  counter: string
}

export const ProjectCard = ({ project, counter }: ProjectCardProps) => (
  <ProjectArticle className='grid grid-cols-[875rem_410rem] gap-x-4 max-lg:grid-cols-1 max-lg:gap-y-4'>
    <ProjectCover project={project} />

    <div className='flex flex-col'>
      <p className='text-[12rem] leading-4 font-light tracking-[-0.18rem] text-foreground/60'>
        [{counter}]
      </p>
      <h3 className='mt-2 text-[23rem] leading-6.5 font-bold tracking-[-0.36rem]'>
        {project.title}
      </h3>
      <p className='mt-3 text-lg leading-[1.3] text-muted'>{project.description}</p>

      {!!project.metric && (
        <div className='mt-4'>
          <span className='inline-block rounded-[2.4rem] bg-foreground px-1.5 py-0.5 text-lg text-background'>
            {project.metric.value}
          </span>
          <p className='mt-2 text-lg leading-[1.3] text-foreground/80'>{project.metric.label}</p>
        </div>
      )}

      {!!project.url && (
        <TileLink
          href={project.url}
          target='_blank'
          rel='noreferrer'
          label='Перейти на сайт'
          icon={<ArrowUpIcon className='size-4.5' />}
          className='mt-auto self-end max-lg:mt-6'
        />
      )}
    </div>
  </ProjectArticle>
)
