import Link from 'next/link'

import { LEGAL_LINKS } from '@/config/legal'
import { FOOTER_ID, TELEGRAM_LINK } from '@/config/navigation'
import { SITE_CONFIG } from '@/config/site'

import { FooterNav } from './FooterNav'
import { RollingLabel } from './RollingLabel'

const LABEL_CLASS_NAME = 'font-mono text-xs text-background/50 uppercase'
const LINKS_CLASS_NAME = 'mt-[calc(19*var(--text-unit))] flex flex-col items-start'

export const Footer = () => (
  <footer
    id={FOOTER_ID}
    className='flex items-start bg-foreground px-7 pt-11 pb-7 text-background max-lg:flex-col max-lg:px-4 max-lg:pt-10 max-lg:pb-24'
  >
    <div className='mt-16 w-[890rem] max-lg:order-last max-lg:mt-10 max-lg:w-full'>
      <FooterNav />
    </div>

    <div className='ml-[213rem] w-[337rem] max-lg:ml-0 max-lg:w-auto'>
      <p className={LABEL_CLASS_NAME}>(Studio details)</p>
      <div className={LINKS_CLASS_NAME}>
        <a href={`mailto:${SITE_CONFIG.email}`} className='text-sm underline underline-offset-2'>
          <span aria-hidden='true'>↳ </span>
          {SITE_CONFIG.email}
        </a>
        <Link
          href={LEGAL_LINKS.privacy}
          className='mt-[calc(8*var(--text-unit))] text-sm text-background/50 underline underline-offset-2 hover:text-background'
        >
          Политика обработки персональных данных
        </Link>
      </div>
    </div>

    <div className='max-lg:mt-8'>
      <p className={LABEL_CLASS_NAME}>(Socials)</p>
      <div className={LINKS_CLASS_NAME}>
        <a
          href={TELEGRAM_LINK.href}
          target='_blank'
          rel='noreferrer'
          className='group inline-flex text-base'
        >
          <RollingLabel label={TELEGRAM_LINK.label} />
        </a>
      </div>
    </div>
  </footer>
)
