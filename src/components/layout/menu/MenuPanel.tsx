'use client'

import clsx from 'clsx'
import dynamic from 'next/dynamic'

import { CloseIcon } from '@/components/icon/CloseIcon'
import { NAVIGATION_LINKS, SOCIAL_LINKS } from '@/config/navigation'
import { SITE_CONFIG } from '@/config/site'
import type { useMenu } from '@/hooks/useMenu'

import { TileButton } from '../TileButton'
import { MenuLink } from './MenuLink'
import { MenuReveal } from './MenuReveal'

const PrismTitleScene = dynamic(
  () =>
    import('@/components/elements/home/PrismTitleScene').then(
      module => module.PrismTitleScene
    ),
  { ssr: false }
)

export const MENU_PANEL_ID = 'menu-panel'

// The small mobile title sits in the panel's flow, left-aligned above the links
const MENU_TITLE_FONT_SIZES = { desktop: 195, mobile: 48 }

const LABEL_CLASS_NAME = 'text-xs text-background/50 uppercase'
const DETAIL_CLASS_NAME = 'block text-[18rem] leading-[1.2]'
const DETAIL_SPACING_CLASS_NAME = 'mt-[38rem]'

interface MenuPanelProps {
  menu: ReturnType<typeof useMenu>
}

export const MenuPanel = ({ menu }: MenuPanelProps) => (
  // The shadow sits outside the element that gets clipped, or the clip would cut it off. The top
  // and right match the header's menu button (centred in the 92 header, 10 from the top on
  // phones), so the panel opens level with it; on phones it is as tall as its content
  <section
    ref={menu.refs.panelRef}
    id={MENU_PANEL_ID}
    aria-label="Меню"
    className="invisible fixed inset-x-6 top-[29.5rem] bottom-6 z-50 rounded-[2.4rem] drop-shadow-[0_0_40rem_rgb(0_0_0/0.82)] max-[480px]:drop-shadow-none max-[480px]:top-2.5 max-[480px]:bottom-auto max-[480px]:left-14.75"
  >
    <div
      ref={menu.refs.clipRef}
      className="relative h-full bg-foreground text-background selection:bg-background selection:text-foreground max-[480px]:h-auto"
    >
      <div
        ref={menu.refs.contentRef}
        className="invisible relative h-full max-[480px]:h-auto max-[480px]:px-4 max-[480px]:pt-24[480px]:pb-6.5"
      >
        <div className="absolute inset-x-0 top-0 h-[62%] max-[480px]:relative max-[480px]:h-17.5 max-[480px]:w-32">
          {menu.state.hasOpened ? (
            <PrismTitleScene
              isRevealed={menu.state.isOpen}
              isInverted
              fontSizes={MENU_TITLE_FONT_SIZES}
            />
          ) : null}
        </div>

        <MenuReveal className="absolute top-6 right-6 max-[480px]:top-3 max-[480px]:right-3.5">
          <TileButton
            label="Закрыть"
            icon={<CloseIcon className="size-3" />}
            variant="light"
            onClick={menu.functions.close}
            tileClassName="max-[480px]:hidden"
            className="max-[480px]:pr-2"
          />
        </MenuReveal>

        <nav
          aria-label="Основное меню"
          className="absolute bottom-6 left-7 w-1/2 max-[480px]:static max-[480px]:w-auto"
        >
          <ul>
            {NAVIGATION_LINKS.map(link => (
              <li
                key={link.href}
                className="border-b border-dotted border-background/40"
              >
                <MenuReveal>
                  <MenuLink
                    link={link}
                    onClick={menu.functions.close}
                  />
                </MenuReveal>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute top-[56%] left-[57%] grid grid-cols-[340rem_auto] max-[480px]:hidden">
          <div>
            <MenuReveal>
              <p className={LABEL_CLASS_NAME}>(Studio details)</p>
            </MenuReveal>
            <MenuReveal className={DETAIL_SPACING_CLASS_NAME}>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className={clsx(
                  DETAIL_CLASS_NAME,
                  'underline underline-offset-2'
                )}
              >
                <span aria-hidden="true">↳ </span>
                {SITE_CONFIG.email}
              </a>
            </MenuReveal>
          </div>
          <div>
            <MenuReveal>
              <p className={LABEL_CLASS_NAME}>(Socials)</p>
            </MenuReveal>
            {SOCIAL_LINKS.map(link => (
              <MenuReveal
                key={link.href}
                className={DETAIL_SPACING_CLASS_NAME}
              >
                <a
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className={DETAIL_CLASS_NAME}
                >
                  {link.label}
                </a>
              </MenuReveal>
            ))}
          </div>
        </div>
      </div>
    </div>
  </section>
)
