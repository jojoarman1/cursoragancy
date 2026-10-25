'use client'

import clsx from 'clsx'
import { type ComponentProps, useRef } from 'react'

import { useIconFly } from '@/hooks/useIconFly'

import { TileContent, type TileContentProps } from './TileContent'
import { TILE_CLASS_NAME, TILE_VARIANT_CLASS_NAMES } from './tile.styles'

type TileLinkProps = Omit<ComponentProps<'a'>, 'children' | 'ref' | 'href'> & {
  href: string
} & Omit<TileContentProps, 'variant'> &
  Partial<Pick<TileContentProps, 'variant'>>

// TileButton's look and hover for a plain link, e.g. to an external site
export const TileLink = ({
  href,
  label,
  icon,
  variant = 'dark',
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
      className={clsx('group', TILE_CLASS_NAME, TILE_VARIANT_CLASS_NAMES[variant].root, className)}
      {...props}
    >
      <TileContent label={label} icon={icon} variant={variant} tileClassName={tileClassName} />
    </a>
  )
}
