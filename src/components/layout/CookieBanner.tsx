import Link from 'next/link'

import { LEGAL_LINKS } from '@/config/legal'
import { setCookieChoice } from '@/stores/cookieConsent'

const BUTTON_CLASS_NAME =
  'cursor-pointer rounded-[calc(2.4*var(--text-unit))] bg-foreground px-[calc(8*var(--text-unit))] py-[calc(4.5*var(--text-unit))] text-[calc(20*var(--text-unit))] leading-[calc(20*var(--text-unit))] tracking-[-0.01em] text-background'

export const CookieBanner = () => (
  <section
    aria-label='Cookies'
    className='fixed right-[calc(24*var(--text-unit))] bottom-[calc(24*var(--text-unit))] z-40 w-[min(calc(422*var(--text-unit)),calc(100vw-48*var(--text-unit)))] rounded-[calc(4*var(--text-unit))] bg-silver p-[calc(24*var(--text-unit))] shadow-[0_0_calc(40*var(--text-unit))_rgb(0_0_0/0.4)] motion-safe:animate-slide-in-right text-foreground max-lg:right-[calc(16*var(--text-unit))] max-lg:bottom-[calc(69*var(--text-unit))] max-lg:left-[calc(16*var(--text-unit))] max-lg:w-auto'
  >
    <p className='text-[calc(16*var(--text-unit))] leading-[1.3] font-medium tracking-[-0.01em]'>
      Мы используем cookies и Яндекс Метрику, чтобы понимать, как улучшить сайт. Подробнее в{' '}
      <Link href={LEGAL_LINKS.privacy} className='underline underline-offset-2'>
        политике обработки данных
      </Link>
      .
    </p>
    <div className='mt-[calc(10*var(--text-unit))] flex gap-[calc(16*var(--text-unit))]'>
      <button
        type='button'
        onClick={() => setCookieChoice('accepted')}
        className={BUTTON_CLASS_NAME}
      >
        Принять
      </button>
      <button
        type='button'
        onClick={() => setCookieChoice('declined')}
        className={BUTTON_CLASS_NAME}
      >
        Отказаться
      </button>
    </div>
  </section>
)
