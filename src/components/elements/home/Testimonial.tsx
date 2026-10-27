'use client'

import Image from 'next/image'

import { TESTIMONIAL } from '@/config/testimonial'
import { useTestimonialReveal } from '@/hooks/useTestimonialReveal'

export const Testimonial = () => {
  const testimonialReveal = useTestimonialReveal()

  return (
    <section aria-label='Цитата' className='pr-6 pb-7 pl-7 max-lg:px-4'>
      <figure
        ref={testimonialReveal.refs.cardRef}
        className='rounded-sm bg-white px-6 py-9 max-lg:px-4 max-lg:py-6'
      >
        <div className='mx-auto w-104 max-lg:w-auto'>
          <blockquote
            ref={testimonialReveal.refs.quoteRef}
            className='text-[20rem] leading-tight max-lg:text-lg'
          >
            {TESTIMONIAL.text}
          </blockquote>
          <figcaption
            ref={testimonialReveal.refs.authorRef}
            className='mt-5.75 flex items-center gap-3 text-[20rem] leading-tight max-lg:text-lg'
          >
            <Image
              data-author-avatar
              src={TESTIMONIAL.author.photo}
              alt=''
              width={100}
              height={100}
              className='size-12.5 shrink-0 rounded-full object-cover'
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
