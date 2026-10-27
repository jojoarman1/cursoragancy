import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { NAVIGATION_LINKS, TELEGRAM_LINK } from '@/config/navigation'

import { HeaderLink } from './HeaderLink'

// From 1024px up the links sit in the header itself; the mobile layout opens them from "Меню"
export const HeaderNav = () => (
  <>
    <nav aria-label='Основное меню' className='ml-auto max-lg:hidden'>
      <ul className='flex gap-3.5 text-base'>
        {NAVIGATION_LINKS.map(link => (
          <li key={link.href}>
            <HeaderLink href={link.href} label={link.label} />
          </li>
        ))}
      </ul>
    </nav>

    <div className='ml-75 text-base max-lg:hidden'>
      <HeaderLink
        href={TELEGRAM_LINK.href}
        target='_blank'
        rel='noreferrer'
        label={TELEGRAM_LINK.label}
        // Cropped to the arrow itself
        icon={<ArrowUpIcon viewBox='3 3 12 12' className='size-2.25' />}
      />
    </div>
  </>
)
