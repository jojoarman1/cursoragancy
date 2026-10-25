'use client'

import clsx from 'clsx'

import { SERVICES } from '@/config/services'
import { useScrollStep } from '@/hooks/useScrollStep'

const TITLE_ID = 'services-title'

// Full screen and pinned: scrolling steps through the services, the current one white with its
// photo on the left. The "Сервис" menu link points at #services
export const Services = () => {
  const scrollStep = useScrollStep<HTMLElement>({ count: SERVICES.length })
  const activeId = SERVICES[scrollStep.state.step].id

  return (
    <section
      ref={scrollStep.refs.triggerRef}
      id='services'
      aria-labelledby={TITLE_ID}
      className='flex h-svh flex-col justify-center bg-foreground pr-6 pl-[86rem] text-background max-[1024px]:pl-7 max-[480px]:px-4'
    >
      {/* Lines up with the list, past the photo column */}
      <h2
        id={TITLE_ID}
        className='ml-[567rem] flex items-center gap-2 text-[20rem] max-[1024px]:ml-0'
      >
        <span aria-hidden='true' className='size-3.5 shrink-0 rounded-full bg-background/60' />
        Чем мы вам сможем помочь?
      </h2>

      <div className='mt-[126rem] grid grid-cols-[469rem_1fr] items-center gap-x-[98rem] max-[1024px]:mt-12 max-[1024px]:grid-cols-[1fr_2fr] max-[1024px]:gap-x-8 max-[480px]:mt-6 max-[480px]:grid-cols-1 max-[480px]:gap-y-6'>
        <div className='relative aspect-[469/563] overflow-hidden max-[480px]:aspect-[4/3]'>
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

        <ul className='text-[120rem] leading-[1.05] font-bold tracking-[-0.03em] max-[1024px]:text-[72rem] max-[480px]:text-[40rem]'>
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
