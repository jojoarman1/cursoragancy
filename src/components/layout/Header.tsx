'use client'

import clsx from 'clsx'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import { MenuIcon } from '@/components/icon/MenuIcon'
import { SITE_CONFIG } from '@/config/site'
import { useMenu } from '@/hooks/useMenu'
import { handleSectionLinkClick } from '@/lib/scrollToSection'
import { useIsHeroTitleVisible } from '@/stores/hero'

import { HeaderNav } from './HeaderNav'
import { MENU_PANEL_ID, MenuPanel } from './menu/MenuPanel'
import { TileButton } from './TileButton'

const BAR_CLASS_NAME =
  'pointer-events-none fixed top-0 z-40 flex h-[calc(92*var(--text-unit))] items-center px-[calc(28*var(--text-unit))] max-lg:h-auto max-lg:py-[calc(10*var(--text-unit))]'

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
          onClick={event => handleSectionLinkClick(event, '/')}
          className={clsx(
            'text-[calc(26*var(--text-unit))] leading-none font-bold tracking-tighter transition-[opacity,visibility]',
            isLogoHidden ? 'invisible opacity-0' : 'pointer-events-auto'
          )}
        >
          {SITE_CONFIG.name}
        </Link>
        <HeaderNav />
      </header>

      {/* Outside the blended bar, so the dark button keeps its own colours */}
      <div className={clsx(BAR_CLASS_NAME, 'right-0 lg:hidden')}>
        <TileButton
          ref={menu.refs.buttonRef}
          label='Меню'
          icon={
            <MenuIcon className='h-[calc(10*var(--text-unit))] w-[calc(15*var(--text-unit))]' />
          }
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
