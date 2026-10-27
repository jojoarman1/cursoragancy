import type { ComponentProps } from 'react'

// A long arrow pointing right: a bar and a triangular head
export const LongArrowIcon = (props: ComponentProps<'svg'>) => (
  <svg viewBox='0 0 405 105' fill='currentColor' aria-hidden='true' {...props}>
    <rect y='44' width='330' height='17' />
    <path d='M312 0 405 52.5 312 105Z' />
  </svg>
)
