'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { CursorIcon } from '@/components/icon/CursorIcon'
import { MenuIcon } from '@/components/icon/MenuIcon'
import { useMenu } from '@/hooks/useMenu'

import { MENU_PANEL_ID, MenuPanel } from './menu/MenuPanel'
import { TileButton } from './TileButton'

export const Header = () => {
  const isHome = usePathname() === '/'
  const menu = useMenu()

  return (
    <>
      <header className="pointer-events-none fixed inset-x-0 top-0 z-40 flex h-23 items-center justify-between px-6 max-[480px]:h-auto max-[480px]:py-2.5">
        <Link
          href="/"
          aria-label="На главную"
          className={clsx(
            'pointer-events-auto block size-11 text-foreground max-[480px]:size-8.25',
            isHome && 'invisible'
          )}
        >
          <CursorIcon className="size-8" />
        </Link>
        <TileButton
          ref={menu.refs.buttonRef}
          label="Меню"
          icon={<MenuIcon className="h-2.5 w-3.75" />}
          aria-controls={MENU_PANEL_ID}
          aria-expanded={menu.state.isOpen}
          onClick={menu.functions.open}
          className="pointer-events-auto"
        />
      </header>
      <MenuPanel menu={menu} />
    </>
  )
}
