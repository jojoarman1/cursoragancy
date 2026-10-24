import clsx from 'clsx'

import type { ChatStep } from '@/config/chat'
import type { useChatForm } from '@/hooks/useChatForm'

import { CHAT_HINT_CLASS_NAME, CHAT_NOTE_CLASS_NAME, CHAT_OPTION_CLASS_NAME } from './chat.styles'

interface ChatCurrentStepProps {
  step: ChatStep
  chatForm: ReturnType<typeof useChatForm>
}

export const ChatCurrentStep = ({ step, chatForm }: ChatCurrentStepProps) => {
  const selectedCount = chatForm.state.selected.length

  if (step.options) {
    return (
      <>
        {step.options.map(option => (
          <button
            key={option.value}
            type='button'
            data-chat-option
            aria-pressed={
              step.isMultiselect ? chatForm.state.selected.includes(option.value) : undefined
            }
            onClick={() => chatForm.functions.selectOption(option)}
            className={CHAT_OPTION_CLASS_NAME}
          >
            {option.value}
          </button>
        ))}
        {step.isMultiselect && selectedCount > 0 ? (
          <button
            type='button'
            onClick={chatForm.functions.applySelection}
            className={CHAT_HINT_CLASS_NAME}
          >
            [Применить]
          </button>
        ) : null}
        {step.isMultiselect ? (
          // Kept mounted and only hidden, so it keeps its revealed state
          <span
            data-chat-option
            className={clsx(CHAT_NOTE_CLASS_NAME, selectedCount > 0 && 'hidden')}
          >
            [Можно несколько]
          </span>
        ) : null}
      </>
    )
  }

  return (
    <>
      <button
        type='button'
        aria-label='Ответить'
        data-chat-control
        onClick={chatForm.functions.submitInput}
        className={clsx('invisible float-right ml-[6px]', CHAT_HINT_CLASS_NAME)}
      >
        [Enter]
      </button>
      {/* biome-ignore lint/a11y/useSemanticElements: an input can't wrap inline with the sentence */}
      <span
        ref={chatForm.refs.inputRef}
        role='textbox'
        aria-label={step.label}
        aria-multiline={step.isMultiline}
        aria-invalid={chatForm.state.isEmailError}
        contentEditable='plaintext-only'
        inputMode={step.inputMode}
        enterKeyHint={step.isMultiline ? 'enter' : 'next'}
        autoCapitalize={step.inputMode === 'email' ? 'off' : 'sentences'}
        spellCheck={step.inputMode !== 'email'}
        tabIndex={0}
        data-chat-control
        onKeyDown={chatForm.functions.onInputKeyDown}
        onInput={chatForm.functions.onInput}
        className='invisible mr-[6px] break-all pr-[5px] outline-none aria-invalid:rounded-[4px] aria-invalid:border aria-invalid:border-dashed aria-invalid:border-red-500 aria-invalid:px-[4px] aria-multiline:block aria-multiline:whitespace-pre-wrap'
      />
      {chatForm.state.isEmailError ? (
        <span role='alert' className='block text-[14px] text-red-500'>
          Неверный email
        </span>
      ) : null}
    </>
  )
}
