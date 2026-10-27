'use client'

import Link from 'next/link'

import type { NavigationLink } from '@/config/navigation'
import { handleSectionLinkClick } from '@/lib/scrollToSection'

interface MenuLinkProps {
  link: NavigationLink
  onClick: () => void
}

export const MenuLink = ({ link, onClick }: MenuLinkProps) => (
  <Link
    href={link.href}
    onClick={event => {
      onClick()
      handleSectionLinkClick(event, link.href)
    }}
    className='block py-[calc(10*var(--text-unit))] text-[calc(44*var(--text-unit))] leading-none font-bold tracking-[-0.03em]'
  >
    {link.label}
  </Link>
)
