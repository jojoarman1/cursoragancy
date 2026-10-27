'use client'

import Link from 'next/link'

import { FOOTER_LINKS, FOOTER_START_LABEL } from '@/config/navigation'
import { requestChatOpen } from '@/lib/chatEvents'
import { handleSectionLinkClick } from '@/lib/scrollToSection'

const ITEM_CLASS_NAME = 'border-b border-background/10'
const LINK_CLASS_NAME =
  'block w-full cursor-pointer py-[calc(14*var(--text-unit))] text-left text-[calc(48*var(--text-unit))] leading-none font-bold tracking-[-0.03em] transition-colors hover:text-background/60 max-lg:text-[calc(32*var(--text-unit))]'

export const FooterNav = () => (
  <nav aria-label='Навигация в подвале'>
    <ul>
      {FOOTER_LINKS.map(link => (
        <li key={link.href} className={ITEM_CLASS_NAME}>
          <Link
            href={link.href}
            onClick={event => handleSectionLinkClick(event, link.href)}
            className={LINK_CLASS_NAME}
          >
            {link.label}
          </Link>
        </li>
      ))}
      <li className={ITEM_CLASS_NAME}>
        <button type='button' onClick={requestChatOpen} className={LINK_CLASS_NAME}>
          {FOOTER_START_LABEL}
        </button>
      </li>
    </ul>
  </nav>
)
