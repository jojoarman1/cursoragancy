import clsx from 'clsx'

import { PROJECTS } from '@/config/projects'
import { padNumber } from '@/lib/format'

import { ProjectCard } from './ProjectCard'
import { SectionLabel } from './SectionLabel'
import { SECTION_CONTENT_CLASS_NAME, SECTION_GRID_CLASS_NAME } from './section.styles'

const TITLE_ID = 'works-title'

// The "Работы" menu link points at #works
export const Projects = () => (
  <section
    id='works'
    aria-labelledby={TITLE_ID}
    className={clsx(SECTION_GRID_CLASS_NAME, 'px-7 pt-30 pb-7 max-lg:px-4')}
  >
    <SectionLabel
      id={TITLE_ID}
      className='text-[calc(22*var(--text-unit))]'
      dotClassName='bg-foreground/30'
    >
      Наши истории
    </SectionLabel>

    <ol className={clsx(SECTION_CONTENT_CLASS_NAME, 'flex flex-col gap-10.5 max-lg:gap-12')}>
      {PROJECTS.map((project, index) => (
        <li key={project.slug}>
          <ProjectCard
            project={project}
            counter={`${padNumber(index + 1)}/${padNumber(PROJECTS.length)}`}
          />
        </li>
      ))}
    </ol>
  </section>
)
