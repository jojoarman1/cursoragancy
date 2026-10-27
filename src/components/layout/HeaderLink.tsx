'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { type ComponentProps, type ReactNode, useRef } from 'react'

import { useIconFly } from '@/hooks/useIconFly'
import { handleSectionLinkClick } from '@/lib/scrollToSection'

import { RollingLabel } from './RollingLabel'

interface HeaderLinkProps extends Omit<ComponentProps<typeof Link>, 'children' | 'ref' | 'href'> {
  href: string
  label: string
  icon?: ReactNode
}

// A header text link with the same hover as the tile buttons: the label rolls, the icon flies
export const HeaderLink = ({ href, label, icon, className, ...props }: HeaderLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null)
  useIconFly({ targetRef: linkRef })

  return (
    <Link
      ref={linkRef}
      href={href}
      onClick={event => handleSectionLinkClick(event, href)}
      aria-label={label}
      className={clsx(
        'group pointer-events-auto flex items-center gap-[calc(4*var(--text-unit))]',
        className
      )}
      {...props}
    >
      <RollingLabel label={label} />
      {!!icon && (
        <span aria-hidden='true' className='flex overflow-hidden'>
          <span data-fly-icon className='flex'>
            {icon}
          </span>
        </span>
      )}
    </Link>
  )
}
