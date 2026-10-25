import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { NAVIGATION_LINKS, TELEGRAM_LINK } from '@/config/navigation'

import { HeaderLink } from './HeaderLink'

// Desktop only: the links sit in the header itself; smaller screens open them from "Меню"
export const HeaderNav = () => (
  <>
    <nav aria-label='Основное меню' className='ml-auto max-[1024px]:hidden'>
      <ul className='flex gap-3.5 text-base'>
        {NAVIGATION_LINKS.map(link => (
          <li key={link.href}>
            <HeaderLink href={link.href} label={link.label} />
          </li>
        ))}
      </ul>
    </nav>

    <div className='ml-[300rem] text-base max-[1024px]:hidden'>
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
