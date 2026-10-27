import clsx from 'clsx'

import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { NAVIGATION_LINKS, TELEGRAM_LINK } from '@/config/navigation'

import { HeaderLink } from './HeaderLink'

// Like bymonolog.com: 20px medium, links touching, each padded 8px so the words sit 16px apart
const LINK_TEXT_CLASS_NAME =
  'text-[calc(20*var(--text-unit))] leading-[calc(25*var(--text-unit))] font-medium tracking-[-0.01em]'
const LINK_PADDING_CLASS_NAME = 'px-[calc(8*var(--text-unit))] py-[calc(3*var(--text-unit))]'

// From 1024px up the links sit in the header itself; the mobile layout opens them from "Меню"
export const HeaderNav = () => (
  <>
    <nav aria-label='Основное меню' className='ml-auto max-lg:hidden'>
      <ul className={clsx('flex', LINK_TEXT_CLASS_NAME)}>
        {NAVIGATION_LINKS.map(link => (
          <li key={link.href}>
            <HeaderLink href={link.href} label={link.label} className={LINK_PADDING_CLASS_NAME} />
          </li>
        ))}
      </ul>
    </nav>

    <div className={clsx('ml-[calc(300*var(--text-unit))] max-lg:hidden', LINK_TEXT_CLASS_NAME)}>
      <HeaderLink
        href={TELEGRAM_LINK.href}
        target='_blank'
        rel='noreferrer'
        label={TELEGRAM_LINK.label}
        className={LINK_PADDING_CLASS_NAME}
        // Cropped to the arrow itself
        icon={<ArrowUpIcon viewBox='3 3 12 12' className='size-[calc(11*var(--text-unit))]' />}
      />
    </div>
  </>
)
