import clsx from 'clsx'
import type { ReactNode } from 'react'

import { RollingLabel } from './RollingLabel'
import {
  TILE_SIZE_CLASS_NAMES,
  TILE_VARIANT_CLASS_NAMES,
  type TileSize,
  type TileVariant
} from './tile.styles'

export interface TileContentProps {
  label: string
  icon: ReactNode
  variant: TileVariant
  size: TileSize
  tileClassName?: string
}

// The label and icon tile shared by TileButton and TileLink; the label rolls on the parent's hover
// and useIconFly flies the icon
export const TileContent = ({ label, icon, variant, size, tileClassName }: TileContentProps) => (
  <>
    <RollingLabel label={label} />
    <span
      aria-hidden='true'
      className={clsx(
        'flex items-center justify-center overflow-hidden',
        TILE_SIZE_CLASS_NAMES[size].tile,
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
