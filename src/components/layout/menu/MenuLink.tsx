'use client'

import Link from 'next/link'
import { useRef } from 'react'

import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import type { NavigationLink } from '@/config/navigation'
import { useIconFly } from '@/hooks/useIconFly'
import { handleSectionLinkClick } from '@/lib/scrollToSection'

interface MenuLinkProps {
  link: NavigationLink
  onClick: () => void
}

export const MenuLink = ({ link, onClick }: MenuLinkProps) => {
  const linkRef = useRef<HTMLAnchorElement>(null)
  useIconFly({ targetRef: linkRef })

  return (
    <Link
      ref={linkRef}
      href={link.href}
      onClick={event => {
        onClick()
        handleSectionLinkClick(event, link.href)
      }}
      className='flex items-center justify-between py-[10rem] text-[56rem] leading-none font-bold tracking-[-0.03em] max-[480px]:text-[44rem]'
    >
      {link.label}
      <span aria-hidden='true' className='flex size-[43rem] overflow-hidden max-[480px]:hidden'>
        <span data-fly-icon className='flex size-full'>
          {/* Cropped to the arrow itself, so it fills the 43px box like in the design */}
          <ArrowUpIcon viewBox='3 3 12 12' className='size-full' />
        </span>
      </span>
    </Link>
  )
}
