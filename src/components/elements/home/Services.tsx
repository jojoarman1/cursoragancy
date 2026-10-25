'use client'

import clsx from 'clsx'

import { SERVICES } from '@/config/services'
import { useScrollStep } from '@/hooks/useScrollStep'

import { SectionLabel } from './SectionLabel'

const TITLE_ID = 'services-title'

// Full screen and pinned (from 1024px up): scrolling steps through the services, the current one
// white with its photo on the left. The mobile layout gets a plain block with the list alone.
// The "Сервис" menu link points at #services
export const Services = () => {
  const scrollStep = useScrollStep<HTMLElement>({ count: SERVICES.length })
  const activeId = SERVICES[scrollStep.state.step].id

  return (
    <section
      ref={scrollStep.refs.triggerRef}
      id='services'
      aria-labelledby={TITLE_ID}
      className='flex h-svh flex-col justify-center bg-foreground pr-6 pl-[86rem] text-background max-lg:h-auto max-lg:px-4 max-lg:pt-[50rem] max-lg:pb-[40rem]'
    >
      {/* Lines up with the list, past the photo column */}
      <SectionLabel
        id={TITLE_ID}
        className='ml-[567rem] text-[20rem] max-lg:ml-0'
        dotClassName='bg-background/60'
      >
        Чем мы вам сможем помочь?
      </SectionLabel>

      <div className='mt-[126rem] grid grid-cols-[469rem_1fr] gap-x-[98rem] max-lg:mt-6 max-lg:grid-cols-1'>
        {/* As tall as the list: the grid row stretches it. The mobile layout shows the list alone */}
        <div className='relative overflow-hidden max-lg:hidden'>
          {SERVICES.map(service => (
            <div
              key={service.id}
              aria-hidden='true'
              className={clsx(
                'absolute inset-0 transition-opacity duration-500',
                service.id !== activeId && 'opacity-0'
              )}
              style={{ backgroundColor: service.placeholderColor }}
            />
          ))}
        </div>

        <ul className='text-[122rem] leading-[1.05] font-bold tracking-[-0.03em] max-lg:text-[32rem]'>
          {SERVICES.map(service => (
            <li
              key={service.id}
              className={clsx(
                'transition-colors duration-300',
                service.id === activeId ? 'text-background' : 'text-background/40'
              )}
            >
              {service.title}
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
