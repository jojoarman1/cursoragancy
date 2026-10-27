'use client'

import { SERVICES } from '@/config/services'
import { useServiceSwitch } from '@/hooks/useServiceSwitch'

import { SectionLabel } from './SectionLabel'
import { ServiceArtwork } from './ServiceArtwork'
import { ServiceOption } from './ServiceOption'

const TITLE_ID = 'services-title'

export const Services = () => {
  const serviceSwitch = useServiceSwitch()

  return (
    <section
      id='services'
      aria-labelledby={TITLE_ID}
      // The collage canvas overflows its column, which touches the screen edge on mobile
      className='flex h-svh flex-col justify-center bg-foreground pr-7 pl-21.5 text-background max-lg:h-auto max-lg:overflow-x-clip max-lg:px-4 max-lg:pt-12.5 max-lg:pb-10'
    >
      {/* Lines up with the list, past the photo column */}
      <SectionLabel
        id={TITLE_ID}
        className='ml-141.75 text-[calc(20*var(--text-unit))] max-lg:ml-0'
        dotClassName='bg-background/60'
      >
        Чем мы вам сможем помочь?
      </SectionLabel>

      <div className='mt-31.5 grid grid-cols-[469rem_1fr] gap-x-24.5 max-lg:mt-6 max-lg:grid-cols-[1fr_104rem] max-lg:gap-x-4'>
        {/* On mobile the list is lower than the column's proportions, so the column keeps its own,
            or the paper sheet would stretch */}
        <div className='relative max-lg:order-last max-lg:aspect-469/640 max-lg:self-center max-lg:motion-safe:animate-levitate'>
          {SERVICES.map(service => (
            <ServiceArtwork
              key={service.id}
              service={service}
              isActive={service.id === serviceSwitch.state.shownId}
            />
          ))}
        </div>

        <ul className='text-[calc(122*var(--text-unit))] leading-[1.05] font-bold tracking-[-0.03em] max-lg:text-[calc(32*var(--text-unit))]'>
          {SERVICES.map(service => (
            <ServiceOption
              key={service.id}
              service={service}
              isActive={service.id === serviceSwitch.state.activeId}
              onSelect={() => serviceSwitch.functions.select(service.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
