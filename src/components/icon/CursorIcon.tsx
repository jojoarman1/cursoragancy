import type { ComponentProps } from 'react'

export const CURSOR_ICON_PATH = 'M0 0H12L24 12H12V24L0 12V0Z'

export const CursorIcon = (props: ComponentProps<'svg'>) => (
  <svg
    width='1em'
    height='1em'
    viewBox='0 0 24 24'
    fill='currentColor'
    xmlns='http://www.w3.org/2000/svg'
    aria-hidden='true'
    {...props}
  >
    <path d={CURSOR_ICON_PATH} />
  </svg>
)
