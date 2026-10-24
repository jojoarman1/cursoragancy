import type { ComponentProps } from 'react'

export const CloseIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width='1em'
    height='1em'
    viewBox='0 0 12 12'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    {...props}
  >
    <path d='M1.4 0 6 4.6 10.6 0 12 1.4 7.4 6 12 10.6 10.6 12 6 7.4 1.4 12 0 10.6 4.6 6 0 1.4Z' />
  </svg>
)
