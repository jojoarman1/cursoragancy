'use client'

import { useState } from 'react'

import { SERVICES, type ServiceId } from '@/config/services'

import { SectionLabel } from './SectionLabel'
import { ServiceArtwork } from './ServiceArtwork'
import { ServiceOption } from './ServiceOption'

const TITLE_ID = 'services-title'

// Full screen (from 1024px up): clicking a service makes it white and shows its picture on the
// left. The mobile layout gets a plain block with the list alone. The "Сервис" menu link points at
// #services
export const Services = () => {
  const [activeId, setActiveId] = useState<ServiceId>(SERVICES[0].id)

  return (
    <section
      id='services'
      aria-labelledby={TITLE_ID}
      className='flex h-svh flex-col justify-center bg-foreground pr-6 pl-21.5 text-background max-lg:h-auto max-lg:px-4 max-lg:pt-12.5 max-lg:pb-10'
    >
      {/* Lines up with the list, past the photo column */}
      <SectionLabel
        id={TITLE_ID}
        className='ml-141.75 text-[20rem] max-lg:ml-0'
        dotClassName='bg-background/60'
      >
        Чем мы вам сможем помочь?
      </SectionLabel>

      <div className='mt-31.5 grid grid-cols-[469rem_1fr] gap-x-24.5 max-lg:mt-6 max-lg:grid-cols-1'>
        {/* As tall as the list: the grid row stretches it. The mobile layout shows the list alone */}
        <div className='relative max-lg:hidden'>
          {SERVICES.map(service => (
            <ServiceArtwork key={service.id} service={service} isActive={service.id === activeId} />
          ))}
        </div>

        <ul className='text-[122rem] leading-[1.05] font-bold tracking-[-0.03em] max-lg:text-[32rem]'>
          {SERVICES.map(service => (
            <ServiceOption
              key={service.id}
              service={service}
              isActive={service.id === activeId}
              onSelect={() => setActiveId(service.id)}
            />
          ))}
        </ul>
      </div>
    </section>
  )
}
