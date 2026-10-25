import clsx from 'clsx'

import type { FaqItem } from '@/config/faq'

import { FaqToggleIcon } from './FaqToggleIcon'

interface FaqEntryProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}

export const FaqEntry = ({ item, isOpen, onToggle }: FaqEntryProps) => {
  const answerId = `faq-answer-${item.id}`

  return (
    <li className='border-b border-background/20'>
      <h3>
        <button
          type='button'
          aria-expanded={isOpen}
          aria-controls={answerId}
          onClick={onToggle}
          className={clsx(
            'flex min-h-[76rem] w-full cursor-pointer items-center justify-between gap-6 py-3 text-left transition-[background-color,padding] duration-500 hover:bg-background/10',
            isOpen && 'bg-background/40 px-[18rem] hover:bg-background/40'
          )}
        >
          {item.question}
          <FaqToggleIcon isOpen={isOpen} className='size-[34rem] shrink-0 max-lg:size-[24rem]' />
        </button>
      </h3>
      {/* 0fr → 1fr animates to the answer's own height without measuring it */}
      <div
        id={answerId}
        aria-hidden={!isOpen}
        className={clsx(
          'grid transition-[grid-template-rows] duration-500',
          isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
        )}
      >
        <div className='overflow-hidden'>
          <p className='max-w-[900rem] px-[18rem] pt-4 pb-6 text-[20rem] leading-[1.4] text-background/60 max-lg:text-lg'>
            {item.answer}
          </p>
        </div>
      </div>
    </li>
  )
}
