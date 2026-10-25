'use client'

import Image from 'next/image'

import { TESTIMONIAL } from '@/config/testimonial'
import { useTestimonialReveal } from '@/hooks/useTestimonialReveal'

export const Testimonial = () => {
  const testimonialReveal = useTestimonialReveal()

  return (
    <section aria-label='Цитата' className='pr-6 pb-7 pl-7 max-[480px]:px-4'>
      <figure
        ref={testimonialReveal.refs.cardRef}
        className='bg-white px-6 py-[36rem] max-[480px]:px-4 max-[480px]:py-6'
      >
        <div className='mx-auto w-[416rem] max-[480px]:w-auto'>
          <blockquote
            ref={testimonialReveal.refs.quoteRef}
            className='text-[20rem] leading-[1.25] max-[480px]:text-lg'
          >
            {TESTIMONIAL.text}
          </blockquote>
          <figcaption
            ref={testimonialReveal.refs.authorRef}
            className='mt-[23rem] flex items-center gap-3 text-[20rem] leading-[1.25] max-[480px]:text-lg'
          >
            <Image
              src={TESTIMONIAL.author.photo}
              alt=''
              width={100}
              height={100}
              className='size-[50rem] shrink-0 rounded-full object-cover'
            />
            <span>
              <span className='block'>{TESTIMONIAL.author.name}</span>
              <span className='block text-muted'>{TESTIMONIAL.author.role}</span>
            </span>
          </figcaption>
        </div>
      </figure>
    </section>
  )
}
