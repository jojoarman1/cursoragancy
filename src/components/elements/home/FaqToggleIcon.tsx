import clsx from 'clsx'

// Both arms pivot on the tip, where they meet
const ARM_CLASS_NAME =
  'transition-transform duration-700 ease-expo-out [transform-box:view-box] [transform-origin:12px_8px]'

interface FaqToggleIconProps {
  isOpen: boolean
  className?: string
}

// A ">" whose two arms straighten into a flat "—" when the answer opens, and fold back on close
export const FaqToggleIcon = ({ isOpen, className }: FaqToggleIconProps) => (
  <svg
    viewBox='0 0 16 16'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.1'
    strokeLinecap='square'
    aria-hidden='true'
    className={className}
  >
    <path d='M12 8 6.5 2.5' className={clsx(ARM_CLASS_NAME, isOpen && '-rotate-45')} />
    <path d='M12 8 6.5 13.5' className={clsx(ARM_CLASS_NAME, isOpen && 'rotate-45')} />
  </svg>
)
