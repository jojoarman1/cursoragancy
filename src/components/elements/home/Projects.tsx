import { PROJECTS } from '@/config/projects'
import { padNumber } from '@/lib/format'

import { ProjectCard } from './ProjectCard'

const TITLE_ID = 'works-title'

// The "Работы" menu link points at #works
export const Projects = () => (
  <section
    id='works'
    aria-labelledby={TITLE_ID}
    className='pt-[120rem] pr-6 pb-7 pl-7 max-[480px]:px-4'
  >
    <h2 id={TITLE_ID} className='flex items-center gap-2 text-[22rem]'>
      <span aria-hidden='true' className='size-3.5 shrink-0 rounded-full bg-foreground/30' />
      Наши истории
    </h2>

    <ol className='mt-6 ml-[262rem] flex flex-col gap-[42rem] max-[1024px]:ml-0 max-[480px]:gap-12'>
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
