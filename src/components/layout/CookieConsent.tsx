'use client'

import { useCookieChoice } from '@/stores/cookieConsent'

import { CookieBanner } from './CookieBanner'
import { YandexMetrika } from './YandexMetrika'

// Metrika's cookies count as personal data: it only loads after "Принять"
export const CookieConsent = () => {
  const cookieChoice = useCookieChoice()

  if (cookieChoice === 'accepted') return <YandexMetrika />
  if (cookieChoice === null) return <CookieBanner />
  return null
}
