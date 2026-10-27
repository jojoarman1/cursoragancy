import Link from 'next/link'

import { LEGAL_LINKS } from '@/config/legal'
import type { useChatForm } from '@/hooks/useChatForm'

const LINK_CLASS_NAME = 'underline underline-offset-2 hover:text-background'

interface ChatConsentProps {
  chatForm: ReturnType<typeof useChatForm>
}

// 152-FZ: an unticked box the visitor ticks themselves; "Отправить" stays off until then
export const ChatConsent = ({ chatForm }: ChatConsentProps) => (
  <label className='flex cursor-pointer items-start gap-[calc(8*var(--text-unit))] px-[calc(12*var(--text-unit))] text-[14px] leading-snug text-background/70'>
    <input
      type='checkbox'
      checked={chatForm.state.isConsentGiven}
      onChange={() => chatForm.functions.toggleConsent()}
      className='mt-[calc(2*var(--text-unit))] size-[calc(16*var(--text-unit))] shrink-0 cursor-pointer accent-background'
    />
    <span>
      Даю{' '}
      <Link href={LEGAL_LINKS.consent} target='_blank' className={LINK_CLASS_NAME}>
        согласие на обработку персональных данных
      </Link>{' '}
      и принимаю{' '}
      <Link href={LEGAL_LINKS.privacy} target='_blank' className={LINK_CLASS_NAME}>
        политику обработки данных
      </Link>
    </span>
  </label>
)
