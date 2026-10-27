import { useSyncExternalStore } from 'react'

import { COOKIE_CHOICES, COOKIE_CONSENT_KEY, type CookieChoice } from '@/config/analytics'

const listeners = new Set<() => void>()
// Keeps the choice for this visit when the browser blocks localStorage
let memoryChoice: CookieChoice | null = null

const isCookieChoice = (value: string | null): value is CookieChoice =>
  COOKIE_CHOICES.some(choice => choice === value)

const readChoice = () => {
  try {
    const stored = localStorage.getItem(COOKIE_CONSENT_KEY)
    if (isCookieChoice(stored)) return stored
  } catch {}
  return memoryChoice
}

const subscribe = (listener: () => void) => {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export const setCookieChoice = (choice: CookieChoice) => {
  memoryChoice = choice
  try {
    localStorage.setItem(COOKIE_CONSENT_KEY, choice)
  } catch {}
  for (const listener of listeners) listener()
}

// 'pending' on the server and during hydration: nothing loads or flashes before the choice is read
export const useCookieChoice = () =>
  useSyncExternalStore(subscribe, readChoice, () => 'pending' as const)
