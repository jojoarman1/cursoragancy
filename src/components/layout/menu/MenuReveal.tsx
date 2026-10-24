import clsx from 'clsx'
import type { ReactNode } from 'react'

interface MenuRevealProps {
  children: ReactNode
  className?: string
}

// Clips only below the item, so on open it rises from under itself and can overshoot upwards
// (useMenu animates it)
export const MenuReveal = ({ children, className }: MenuRevealProps) => (
  <div className={clsx('[clip-path:inset(-100%_-100%_0_-100%)]', className)}>
    <div data-menu-reveal>{children}</div>
  </div>
)
