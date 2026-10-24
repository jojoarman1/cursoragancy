import type { ComponentProps } from 'react'

export const MenuIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width='1em'
    height='0.667em'
    viewBox='0 0 15 10'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    {...props}
  >
    <rect width='15' height='2' />
    <rect y='4' width='15' height='2' />
    <rect y='8' width='15' height='2' />
  </svg>
)
