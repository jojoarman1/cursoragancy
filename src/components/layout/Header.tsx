'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CursorIcon } from '@/components/icon/CursorIcon'

export const Header = () => {
  const isHome = usePathname() === '/'

  return (
    <header
      data-header
      className='pointer-events-none fixed inset-x-0 top-0 z-40 mix-blend-difference'
    >
      <Link
        href='/'
        aria-label='На главную'
        data-header-logo
        className={clsx(
          'pointer-events-auto absolute top-10 left-10 block size-11 text-white',
          isHome && 'invisible'
        )}
      >
        <CursorIcon className='size-8' />
      </Link>
    </header>
  )
}
