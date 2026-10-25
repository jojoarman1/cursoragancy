'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MenuIcon } from '@/components/icon/MenuIcon'
import { SITE_CONFIG } from '@/config/site'
import { useMenu } from '@/hooks/useMenu'
import { useIsHeroTitleVisible } from '@/stores/hero'

import { HeaderNav } from './HeaderNav'
import { MENU_PANEL_ID, MenuPanel } from './menu/MenuPanel'
import { TileButton } from './TileButton'

const BAR_CLASS_NAME =
  'pointer-events-none fixed top-0 z-40 flex h-23 items-center px-6 max-[480px]:h-auto max-[480px]:py-2.5'

export const Header = () => {
  const menu = useMenu()
  const isHome = usePathname() === '/'
  const isHeroTitleVisible = useIsHeroTitleVisible()
  // On home the big centred word is the logo until it scrolls away
  const isLogoHidden = isHome && isHeroTitleVisible

  return (
    <>
      {/* White + difference inverts the text against whatever is under it. It has to be on the
          fixed bar itself: the bar is its own stacking context, so a child would only blend with
          the bar's empty background */}
      <header className={clsx(BAR_CLASS_NAME, 'inset-x-0 text-white mix-blend-difference')}>
        <Link
          href='/'
          className={clsx(
            'text-[26rem] leading-none font-bold tracking-tighter transition-[opacity,visibility]',
            isLogoHidden ? 'invisible opacity-0' : 'pointer-events-auto'
          )}
        >
          {SITE_CONFIG.name}
        </Link>
        <HeaderNav />
      </header>

      {/* Outside the blended bar, so the dark button keeps its own colours */}
      <div className={clsx(BAR_CLASS_NAME, 'right-0 min-[1024px]:hidden')}>
        <TileButton
          ref={menu.refs.buttonRef}
          label='Меню'
          icon={<MenuIcon className='h-2.5 w-3.75' />}
          aria-controls={MENU_PANEL_ID}
          aria-expanded={menu.state.isOpen}
          onClick={menu.functions.open}
          className='pointer-events-auto'
        />
      </div>
      <MenuPanel menu={menu} />
    </>
  )
}
