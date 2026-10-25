export interface Service {
  id: string
  title: string
  // TODO: replace with the service's photo in public/services/
  placeholderColor: string
}

export const SERVICES = [
  { id: 'brand-strategy', title: 'Стратегия бренда', placeholderColor: '#3b3833' },
  { id: 'growth-strategy', title: 'Стратегия развития', placeholderColor: '#2f3a40' },
  { id: 'identity', title: 'Айдентика', placeholderColor: '#5a5f6b' },
  { id: 'web-design', title: 'Дизайн сайта', placeholderColor: '#4a3b3f' },
  { id: 'web-development', title: 'Разработка сайта', placeholderColor: '#33403a' }
] as const satisfies readonly Service[]

export type ServiceId = (typeof SERVICES)[number]['id']
