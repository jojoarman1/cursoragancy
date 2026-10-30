export const CTA_WORD_EFFECTS = ['rise', 'cascade', 'focus', 'drop', 'flip', 'slide'] as const
export type CtaWordEffect = (typeof CTA_WORD_EFFECTS)[number]

export interface CtaWord {
  id: string
  text: string
  effect: CtaWordEffect
}

export interface CtaLine {
  id: string
  words: CtaWord[]
  // The design's staircase: some lines step right, the last one sits at the right edge
  align: 'start' | 'indent' | 'end'
}

// Every word comes in its own way (useCtaReveal)
export const CTA_LINES: CtaLine[] = [
  { id: 'start', align: 'start', words: [{ id: 'start', text: 'Начнем', effect: 'rise' }] },
  {
    id: 'create',
    align: 'start',
    words: [{ id: 'create', text: 'создавать', effect: 'cascade' }]
  },
  {
    id: 'impressions',
    align: 'indent',
    words: [{ id: 'impressions', text: 'впечатления', effect: 'focus' }]
  },
  {
    id: 'which',
    align: 'start',
    words: [
      { id: 'which', text: 'которые', effect: 'drop' },
      { id: 'surprise', text: 'удивят', effect: 'flip' }
    ]
  },
  { id: 'people', align: 'end', words: [{ id: 'people', text: 'людей', effect: 'slide' }] }
]

export const CTA_QUOTE =
  '«Мы - команда увлечённых делом. Внимательно относимся к каждому проекту, открыты к диалогу и создаём продукты, за качество которых можем отвечать.»'
