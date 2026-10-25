import clsx from 'clsx'
import type { ReactNode } from 'react'

import { RollingLabel } from './RollingLabel'
import { TILE_VARIANT_CLASS_NAMES, type TileVariant } from './tile.styles'

export interface TileContentProps {
  label: string
  icon: ReactNode
  variant: TileVariant
  tileClassName?: string
}

// The label and icon tile shared by TileButton and TileLink; the label rolls on the parent's hover
// and useIconFly flies the icon
export const TileContent = ({ label, icon, variant, tileClassName }: TileContentProps) => (
  <>
    <RollingLabel label={label} />
    <span
      aria-hidden='true'
      className={clsx(
        'flex size-6 items-center justify-center overflow-hidden rounded-[2.4rem]',
        TILE_VARIANT_CLASS_NAMES[variant].tile,
        tileClassName
      )}
    >
      <span data-fly-icon className='flex'>
        {icon}
      </span>
    </span>
  </>
)
