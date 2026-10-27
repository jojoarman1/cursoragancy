import { FaqList } from './FaqList'
import { SectionLabel } from './SectionLabel'

const TITLE_ID = 'faq-title'

export const Faq = () => (
  <section
    id='faq'
    aria-labelledby={TITLE_ID}
    className='bg-faq pt-12 pr-7 pb-30 pl-7 text-background max-lg:px-4 max-lg:py-12.5'
  >
    <SectionLabel id={TITLE_ID} className='text-[20rem]' dotClassName='bg-background/60'>
      FAQ
    </SectionLabel>
    <FaqList />
  </section>
)
