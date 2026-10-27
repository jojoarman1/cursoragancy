'use client'

import clsx from 'clsx'
import Image from 'next/image'

import { TESTIMONIAL } from '@/config/testimonial'
import { useTestimonialReveal } from '@/hooks/useTestimonialReveal'

import { SECTION_GRID_CLASS_NAME } from './section.styles'

export const Testimonial = () => {
  const testimonialReveal = useTestimonialReveal()

  return (
    <section aria-label='Цитата' className={clsx(SECTION_GRID_CLASS_NAME, 'px-7 pb-7 max-lg:px-4')}>
      <figure
        ref={testimonialReveal.refs.cardRef}
        className='col-start-2 rounded-sm bg-white px-6 py-9 max-lg:col-start-1 max-lg:px-4 max-lg:py-6'
      >
        <div className='mx-auto w-[calc(454*var(--text-unit))] max-lg:w-auto'>
          <blockquote
            ref={testimonialReveal.refs.quoteRef}
            className='text-[calc(24*var(--text-unit))] leading-[1.25] font-medium tracking-[-0.01em] max-lg:text-lg'
          >
            {TESTIMONIAL.text}
          </blockquote>
          <figcaption
            ref={testimonialReveal.refs.authorRef}
            className='mt-5.75 flex items-center gap-[calc(12*var(--text-unit))] text-[calc(20*var(--text-unit))] leading-[1.25] font-medium tracking-[-0.01em] max-lg:text-lg'
          >
            <Image
              data-author-avatar
              src={TESTIMONIAL.author.photo}
              alt=''
              width={100}
              height={100}
              className='size-[calc(45*var(--text-unit))] shrink-0 rounded-full object-cover'
            />
            <span>
              {/* Each line clips to itself, so it rises from under its own line */}
              <span className='block overflow-hidden'>
                <span data-author-line className='block'>
                  {TESTIMONIAL.author.name}
                </span>
              </span>
              <span className='block overflow-hidden'>
                <span data-author-line className='block text-muted'>
                  {TESTIMONIAL.author.role}
                </span>
              </span>
            </span>
          </figcaption>
        </div>
      </figure>
    </section>
  )
}
