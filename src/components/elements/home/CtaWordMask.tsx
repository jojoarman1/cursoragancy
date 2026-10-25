import clsx from 'clsx'
import type { ReactNode } from 'react'

import type { CtaWordEffect } from '@/config/cta'

// Effects that move the word in from outside its box clip to it; the rest (blur, flip) don't,
// so their soft edges and turning letters aren't cut
const CLIPPED_EFFECTS: CtaWordEffect[] = ['rise', 'cascade', 'drop', 'slide']

interface CtaWordMaskProps {
  effect: CtaWordEffect
  children: ReactNode
}

export const CtaWordMask = ({ effect, children }: CtaWordMaskProps) => (
  <span
    className={clsx(
      'inline-block align-top',
      CLIPPED_EFFECTS.includes(effect) ? 'overflow-hidden' : 'perspective-[600rem]'
    )}
  >
    {children}
  </span>
)
