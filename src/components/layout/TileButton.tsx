'use client'

import { useMergedRef } from '@siberiacancode/reactuse'
import clsx from 'clsx'
import { type ComponentProps, useRef } from 'react'

import { useIconFly } from '@/hooks/useIconFly'

import { TileContent, type TileContentProps } from './TileContent'
import { TILE_CLASS_NAME, TILE_SIZE_CLASS_NAMES, TILE_VARIANT_CLASS_NAMES } from './tile.styles'

type TileButtonProps = Omit<ComponentProps<'button'>, 'children'> &
  Omit<TileContentProps, 'variant' | 'size'> &
  Partial<Pick<TileContentProps, 'variant' | 'size'>>

// A label with an icon tile, as in the design's "Начать диалог" / "Меню" buttons
export const TileButton = ({
  label,
  icon,
  variant = 'dark',
  size = 'md',
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
    </button>
  )
}
