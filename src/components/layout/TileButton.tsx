'use client'

import { useMergedRef } from '@siberiacancode/reactuse'
import clsx from 'clsx'
import { type ComponentProps, type ReactNode, useRef } from 'react'

import { useTileButtonHover } from '@/hooks/useTileButtonHover'

export const TILE_BUTTON_VARIANTS = ['dark', 'light'] as const
export type TileButtonVariant = (typeof TILE_BUTTON_VARIANTS)[number]

const VARIANT_CLASS_NAMES: Record<TileButtonVariant, { button: string; tile: string }> = {
  dark: { button: 'bg-foreground text-background', tile: 'bg-background/30' },
  light: { button: 'bg-background text-foreground', tile: 'bg-foreground text-background' }
}

interface TileButtonProps extends Omit<ComponentProps<'button'>, 'children'> {
  label: string
  icon: ReactNode
  variant?: TileButtonVariant
  tileClassName?: string
}

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
  const chars = Array.from(label, (char, index) => ({ id: index, char }))
  useTileButtonHover({ buttonRef })

  return (
    <button
      ref={mergedRef}
      type='button'
      aria-label={label}
      className={clsx(
        'flex cursor-pointer items-center gap-2 rounded-[2.4rem] py-[4.5rem] pr-[4.5rem] pl-2 text-[20rem] leading-5 tracking-[-0.2rem] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current',
        VARIANT_CLASS_NAMES[variant].button,
        className
      )}
      {...props}
    >
      {/* Every letter has a copy above it: on hover each one falls out while its copy drops in.
          The clip is vertical only, so the tight tracking doesn't cut glyph edges */}
      <span aria-hidden='true' className='flex'>
        {chars.map(item => (
          <span key={item.id} className='relative whitespace-pre [clip-path:inset(0_-50%)]'>
            <span data-button-char className='block'>
              {item.char}
            </span>
            <span data-button-char-clone className='absolute inset-0'>
              {item.char}
            </span>
          </span>
        ))}
      </span>
      <span
        aria-hidden='true'
        className={clsx(
          'flex size-6 items-center justify-center overflow-hidden rounded-[2.4rem]',
          VARIANT_CLASS_NAMES[variant].tile,
          tileClassName
        )}
      >
        <span data-fly-icon className='flex'>
          {icon}
        </span>
      </span>
    </button>
  )
}
