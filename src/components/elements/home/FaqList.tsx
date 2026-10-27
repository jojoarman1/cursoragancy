'use client'

import { FAQ_ITEMS } from '@/config/faq'
import { useFaqList } from '@/hooks/useFaqList'

import { FaqEntry } from './FaqEntry'

export const FaqList = () => {
  const faqList = useFaqList()

  return (
    <ul
      ref={faqList.refs.listRef}
      className='text-[calc(24*var(--text-unit))] leading-[calc(28*var(--text-unit))] max-lg:text-[calc(18*var(--text-unit))] max-lg:leading-[calc(24*var(--text-unit))]'
    >
      {FAQ_ITEMS.map(item => (
        <FaqEntry
          key={item.id}
          item={item}
          isOpen={item.id === faqList.state.openId}
          onToggle={() => faqList.functions.toggle(item.id)}
        />
      ))}
    </ul>
  )
}
