'use client'

import clsx from 'clsx'
import type { ReactNode } from 'react'

import { useSectionLabelReveal } from '@/hooks/useSectionLabelReveal'

interface SectionLabelProps {
  id: string
  children: ReactNode
  className?: string
  dotClassName: string
}

// A section's "● Title" label; the text comes out from under the dot (useSectionLabelReveal)
export const SectionLabel = ({ id, children, className, dotClassName }: SectionLabelProps) => {
  const sectionLabelReveal = useSectionLabelReveal()

  return (
    <h2
      ref={sectionLabelReveal.refs.labelRef}
      id={id}
      className={clsx('flex items-center gap-2', className)}
    >
      {/* Above the text, which slides out from behind it */}
      <span
        data-label-dot
        aria-hidden='true'
        className={clsx('relative z-10 size-3.5 shrink-0 rounded-full', dotClassName)}
      />
      {/* Clipped on the left only, so the hidden text sits behind the dot, not over the page */}
      <span className='[clip-path:inset(-50%_-50%_-50%_0)]'>
        <span data-label-text className='block'>
          {children}
        </span>
      </span>
    </h2>
  )
}
