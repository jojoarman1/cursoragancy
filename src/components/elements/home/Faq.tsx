import clsx from 'clsx'

import { FaqList } from './FaqList'
import { SectionLabel } from './SectionLabel'
import { SECTION_CONTENT_CLASS_NAME, SECTION_GRID_CLASS_NAME } from './section.styles'

const TITLE_ID = 'faq-title'

export const Faq = () => (
  <section
    id='faq'
    aria-labelledby={TITLE_ID}
    className={clsx(
      SECTION_GRID_CLASS_NAME,
      'bg-faq px-7 pt-12 pb-30 text-background max-lg:px-4 max-lg:py-12.5'
    )}
  >
    <SectionLabel
      id={TITLE_ID}
      className='text-[calc(20*var(--text-unit))]'
      dotClassName='bg-background/60'
    >
      FAQ
    </SectionLabel>
    <div className={SECTION_CONTENT_CLASS_NAME}>
      <FaqList />
    </div>
  </section>
)
