'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CursorIcon } from '@/components/icon/CursorIcon'

// Empty for now apart from the logo. The blend mode keeps the white logo visible
// on both the dark hero and white sections
export const Header = () => {
  // On the home page the logo appears only after the 3D hero logo has docked into it on scroll
  const isHome = usePathname() === '/'

  return (
    <header className='pointer-events-none fixed inset-x-0 top-0 z-40 mix-blend-difference'>
      <Link
        href='/'
        aria-label='На главную'
        data-header-logo
        className={clsx(
          'pointer-events-auto absolute top-6 left-11.5 block size-11 text-white',
          isHome && 'invisible'
        )}
      >
        <CursorIcon className='size-full' />
      </Link>
    </header>
  )
}
