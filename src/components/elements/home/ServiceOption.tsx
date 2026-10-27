import clsx from 'clsx'

import type { Service } from '@/config/services'

interface ServiceOptionProps {
  service: Service
  isActive: boolean
  onSelect: () => void
}

// One service in the list: a button that shows its picture; the chosen one is white
export const ServiceOption = ({ service, isActive, onSelect }: ServiceOptionProps) => (
  <li>
    <button
      type='button'
      aria-pressed={isActive}
      onClick={onSelect}
      className={clsx(
        'origin-left cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-background',
        // Pressing squeezes it quickly; letting go springs it back, like the tile buttons
        '[transition:color_0.6s_var(--ease-expo-out),scale_0.6s_var(--ease-spring)] active:scale-96 active:[transition:color_0.6s_var(--ease-expo-out),scale_0.1s_ease-out]',
        isActive ? 'text-background' : 'text-background/40 hover:text-background/70'
      )}
    >
      {service.title}
    </button>
  </li>
)
