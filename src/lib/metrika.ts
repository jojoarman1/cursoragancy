import { type MetrikaGoal, YANDEX_METRIKA } from '@/config/analytics'

declare global {
  interface Window {
    ym?: (id: number, action: 'reachGoal', goal: MetrikaGoal, params?: object) => void
  }
}

// ym only exists on the production domain, so this is a no-op locally
export const reachGoal = (goal: MetrikaGoal, params?: object) => {
  window.ym?.(YANDEX_METRIKA.id, 'reachGoal', goal, params)
}
