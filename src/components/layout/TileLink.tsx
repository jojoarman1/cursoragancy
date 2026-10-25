'use client'

import clsx from 'clsx'
import { type ComponentProps, useRef } from 'react'

import { useIconFly } from '@/hooks/useIconFly'

import { TileContent, type TileContentProps } from './TileContent'
import { TILE_CLASS_NAME, TILE_SIZE_CLASS_NAMES, TILE_VARIANT_CLASS_NAMES } from './tile.styles'

type TileLinkProps = Omit<ComponentProps<'a'>, 'children' | 'ref' | 'href'> & {
  href: string
} & Omit<TileContentProps, 'variant' | 'size'> &
  Partial<Pick<TileContentProps, 'variant' | 'size'>>

// TileButton's look and hover for a plain link, e.g. to an external site
export const TileLink = ({
  href,
  label,
  icon,
  variant = 'dark',
  size = 'md',
  className,
  tileClassName,
  ...props
}: TileLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null)
  useIconFly({ targetRef: linkRef })

  return (
    <a
      ref={linkRef}
      href={href}
      aria-label={label}
      className={clsx(
        'group',
        TILE_CLASS_NAME,
        TILE_SIZE_CLASS_NAMES[size].root,
        TILE_VARIANT_CLASS_NAMES[variant].root,
        className
      )}
      {...props}
    >
      <TileContent
        label={label}
        icon={icon}
        variant={variant}
        size={size}
        tileClassName={tileClassName}
      />
    </a>
  )
}
