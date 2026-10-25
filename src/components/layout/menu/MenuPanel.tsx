'use client'

import { CloseIcon } from '@/components/icon/CloseIcon'
import { NAVIGATION_LINKS } from '@/config/navigation'
import type { useMenu } from '@/hooks/useMenu'

import { TileButton } from '../TileButton'
import { MenuLink } from './MenuLink'
import { MenuReveal } from './MenuReveal'

export const MENU_PANEL_ID = 'menu-panel'

interface MenuPanelProps {
  menu: ReturnType<typeof useMenu>
}

// Mobile layout only: from 1024px up the links sit in the header itself (HeaderNav). It opens
// level with the header's menu button, 10 from the top, and is as tall as its content
export const MenuPanel = ({ menu }: MenuPanelProps) => (
  <section
    ref={menu.refs.panelRef}
    id={MENU_PANEL_ID}
    aria-label='Меню'
    className='invisible fixed top-2.5 right-6 left-14.75 z-50 rounded-[2.4rem]'
  >
    <div
      ref={menu.refs.clipRef}
      className='relative bg-foreground text-background selection:bg-background selection:text-foreground'
    >
      <div ref={menu.refs.contentRef} className='invisible relative px-4 pt-14 pb-6.5'>
        <MenuReveal className='absolute top-3 right-3.5'>
          <TileButton
            label='Закрыть'
            icon={<CloseIcon className='size-3' />}
            variant='light'
            onClick={menu.functions.close}
            tileClassName='hidden'
            className='pr-2'
          />
        </MenuReveal>

        <nav aria-label='Основное меню'>
          <ul>
            {NAVIGATION_LINKS.map(link => (
              <li key={link.href} className='border-b border-dotted border-background/40'>
                <MenuReveal>
                  <MenuLink link={link} onClick={menu.functions.close} />
                </MenuReveal>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </section>
)
