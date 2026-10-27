import clsx from 'clsx'

import type { FaqItem } from '@/config/faq'

import { FaqToggleIcon } from './FaqToggleIcon'

// One curve for every part, so the row, its fill and the answer move as one
const EASE_CLASS_NAME = 'ease-expo-out'

interface FaqEntryProps {
  item: FaqItem
  isOpen: boolean
  onToggle: () => void
}

// Opening: the grey fill sweeps in from the left, the question steps in, the row grows to the
// answer's height and the answer rises from under it, sharpening. Closing runs faster, the answer
// leaving first
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
          className='group relative flex min-h-19 w-full cursor-pointer items-center justify-between gap-6 py-3 text-left'
        >
          <span
            aria-hidden='true'
            className={clsx(
              'absolute inset-0 origin-left transition-[scale,background-color] duration-700',
              EASE_CLASS_NAME,
              isOpen
                ? 'scale-x-100 bg-background/40'
                : 'scale-x-0 bg-background/10 group-hover:scale-x-100'
            )}
          />
          <span
            className={clsx(
              'relative transition-[translate] duration-700',
              EASE_CLASS_NAME,
              isOpen && 'translate-x-4.5'
            )}
          >
            {item.question}
          </span>
          <FaqToggleIcon
            isOpen={isOpen}
            className={clsx(
              'relative size-8.5 shrink-0 transition-[translate] duration-700 max-lg:size-6',
              EASE_CLASS_NAME,
              isOpen && '-translate-x-4.5'
            )}
          />
        </button>
      </h3>
      {/* 0fr → 1fr animates to the answer's own height without measuring it */}
      <div
        id={answerId}
        aria-hidden={!isOpen}
        className={clsx(
          'grid transition-[grid-template-rows]',
          EASE_CLASS_NAME,
          isOpen ? 'grid-rows-[1fr] duration-800' : 'grid-rows-[0fr] duration-500'
        )}
      >
        <div className='overflow-hidden'>
          <p
            className={clsx(
              'max-w-225 px-4.5 pt-4 pb-6 text-[calc(20*var(--text-unit))] leading-[1.4] text-background/60 transition-[translate,opacity,filter] max-lg:text-lg',
              EASE_CLASS_NAME,
              isOpen
                ? 'translate-y-0 opacity-100 blur-none delay-150 duration-800'
                : 'translate-y-6 opacity-0 blur-[6px] duration-300'
            )}
          >
            {item.answer}
          </p>
        </div>
      </div>
    </li>
  )
}
