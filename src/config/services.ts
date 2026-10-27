// A service's picture is a lens collage: a background and an optional cut-out, a transparent PNG
// laid over it (files in public/services/<id>/)
export interface ServiceArt {
  background: string
  foreground?: string
  // A plain sheet covers the whole column (stretched: the paper's proportions differ from the
  // column's by ~2%, which doesn't show)
  isSheet?: boolean
}

export interface Service {
  id: string
  title: string
  art: ServiceArt
}

const PAPER_SHEET: ServiceArt = { background: '/services/paper.webp', isSheet: true }

export const SERVICES = [
  {
    id: 'brand-strategy',
    title: 'Стратегия бренда',
    art: {
      background: '/services/brand-strategy/background.webp',
      foreground: '/services/brand-strategy/foreground.webp'
    }
  },
  { id: 'growth-strategy', title: 'Стратегия развития', art: PAPER_SHEET },
  { id: 'identity', title: 'Айдентика', art: PAPER_SHEET },
  { id: 'web-design', title: 'Дизайн сайта', art: PAPER_SHEET },
  { id: 'web-development', title: 'Разработка сайта', art: PAPER_SHEET }
] as const satisfies readonly Service[]

export type ServiceId = (typeof SERVICES)[number]['id']
