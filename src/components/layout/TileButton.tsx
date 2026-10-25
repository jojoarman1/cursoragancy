'use client'

import { useMergedRef } from '@siberiacancode/reactuse'
import clsx from 'clsx'
import { type ComponentProps, useRef } from 'react'

import { useIconFly } from '@/hooks/useIconFly'

import { TileContent, type TileContentProps } from './TileContent'
import { TILE_CLASS_NAME, TILE_VARIANT_CLASS_NAMES } from './tile.styles'

type TileButtonProps = Omit<ComponentProps<'button'>, 'children'> &
  Omit<TileContentProps, 'variant'> &
  Partial<Pick<TileContentProps, 'variant'>>

// A label with an icon tile, as in the design's "Начать проект" / "Меню" buttons
export const TileButton = ({
  label,
  icon,
  variant = 'dark',
  className,
  tileClassName,
  ref,
  ...props
}: TileButtonProps) => {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const mergedRef = useMergedRef(buttonRef, ref ?? null)
  useIconFly({ targetRef: buttonRef })

  return (
    <button
      ref={mergedRef}
      type='button'
      aria-label={label}
      className={clsx('group', TILE_CLASS_NAME, TILE_VARIANT_CLASS_NAMES[variant].root, className)}
      {...props}
    >
      <TileContent label={label} icon={icon} variant={variant} tileClassName={tileClassName} />
    </button>
  )
}
