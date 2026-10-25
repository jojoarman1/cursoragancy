import { PROJECTS } from '@/config/projects'
import { padNumber } from '@/lib/format'

import { ProjectCard } from './ProjectCard'
import { SectionLabel } from './SectionLabel'

const TITLE_ID = 'works-title'

// The "Работы" menu link points at #works
export const Projects = () => (
  <section id='works' aria-labelledby={TITLE_ID} className='pt-[120rem] pr-6 pb-7 pl-7 max-lg:px-4'>
    <SectionLabel id={TITLE_ID} className='text-[22rem]' dotClassName='bg-foreground/30'>
      Наши истории
    </SectionLabel>

    <ol className='mt-6 ml-[262rem] flex flex-col gap-[42rem] max-lg:ml-0 max-lg:gap-12'>
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
