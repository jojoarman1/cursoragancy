'use client'

import { useState } from 'react'

import { FAQ_ITEMS } from '@/config/faq'

import { FaqEntry } from './FaqEntry'

// One answer open at a time; the first is open to start with, as in the design
export const FaqList = () => {
  const [openId, setOpenId] = useState<string | null>(FAQ_ITEMS[0].id)

  return (
    <ul className='mt-8.5 text-[24rem] leading-7 max-lg:mt-6 max-lg:text-[18rem] max-lg:leading-6'>
      {FAQ_ITEMS.map(item => (
        <FaqEntry
          key={item.id}
          item={item}
          isOpen={item.id === openId}
          onToggle={() => setOpenId(item.id === openId ? null : item.id)}
        />
      ))}
    </ul>
  )
}
