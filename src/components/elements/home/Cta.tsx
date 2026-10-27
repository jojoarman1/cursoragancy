'use client'

import clsx from 'clsx'
import { Fragment } from 'react'

import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { TileButton } from '@/components/layout/TileButton'
import { CTA_LINES, CTA_QUOTE, type CtaLine } from '@/config/cta'
import { useCtaReveal } from '@/hooks/useCtaReveal'
import { requestChatOpen } from '@/lib/chatEvents'

import { CtaBackground } from './CtaBackground'
import { CtaWordMask } from './CtaWordMask'

const ALIGN_CLASS_NAMES: Record<CtaLine['align'], string> = {
  start: '',
  indent: 'pl-47.5 max-lg:pl-15',
  end: 'text-right'
}

export const Cta = () => {
  const ctaReveal = useCtaReveal()

  return (
    <section
      ref={ctaReveal.refs.sectionRef}
      aria-labelledby='cta-title'
      className='relative flex min-h-375 flex-col items-center overflow-hidden pt-75 bg-foreground px-7 pb-50 text-background max-lg:min-h-svh max-lg:justify-center max-lg:px-4 max-lg:py-30'
    >
      <CtaBackground areaRef={ctaReveal.refs.sectionRef} />

      <h2
        id='cta-title'
        className='relative w-fit text-[calc(144*var(--text-unit))] leading-[calc(162*var(--text-unit))] tracking-[calc(-5*var(--text-unit))] uppercase max-lg:text-[calc(46*var(--text-unit))] max-lg:leading-[calc(52*var(--text-unit))] max-lg:tracking-[calc(-1.6*var(--text-unit))]'
      >
        {CTA_LINES.map(line => (
          <span key={line.id} className={clsx('block', ALIGN_CLASS_NAMES[line.align])}>
            {line.words.map((word, index) => (
              <Fragment key={word.id}>
                {index > 0 && ' '}
                <CtaWordMask effect={word.effect}>
                  <span data-cta-word data-effect={word.effect} className='inline-block'>
                    {word.text}
                  </span>
                </CtaWordMask>
              </Fragment>
            ))}
          </span>
        ))}
      </h2>

      <div data-cta-detail className='relative mt-22.5 max-lg:mt-10'>
        <TileButton
          label='Начать проект'
          icon={<ArrowUpIcon className='size-[calc(34*var(--text-unit))]' />}
          variant='accent'
          size='xl'
          onClick={requestChatOpen}
        />
      </div>

      <p
        data-cta-detail
        className='absolute bottom-15 left-1/2 max-w-80 -translate-x-1/2 text-center text-[calc(16*var(--text-unit))] leading-tight font-bold max-lg:relative max-lg:bottom-auto max-lg:left-auto max-lg:mt-12 max-lg:w-auto max-lg:translate-x-0 max-lg:text-sm'
      >
        {CTA_QUOTE}
      </p>
    </section>
  )
}
