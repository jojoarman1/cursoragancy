import { Fragment } from 'react'

import { CHAT_STEPS } from '@/config/chat'
import type { useChatForm } from '@/hooks/useChatForm'

import { ChatCurrentStep } from './ChatCurrentStep'
import { CHAT_ANSWER_CLASS_NAME } from './chat.styles'

const PARAGRAPH_GAP = <span aria-hidden='true' className='block h-[30px]' />

interface ChatConversationProps {
  chatForm: ReturnType<typeof useChatForm>
}

export const ChatConversation = ({ chatForm }: ChatConversationProps) => {
  const currentStep = chatForm.state.step

  return (
    <p>
      {chatForm.state.answers.map((answer, index) => {
        const step = CHAT_STEPS[answer.stepId]

        return (
          <Fragment key={answer.stepId}>
            {step.isNewParagraph ? PARAGRAPH_GAP : null}
            <span className='mr-[6px] select-none'>{step.text}</span>
            {answer.values.map(value => (
              <button
                key={value}
                type='button'
                aria-label={`Изменить ответ: ${value}`}
                onClick={() => chatForm.functions.editAnswer(index)}
                className={CHAT_ANSWER_CLASS_NAME}
              >
                {value}
              </button>
            ))}
          </Fragment>
        )
      })}

      {currentStep ? (
        <Fragment key={`current-${chatForm.state.stepId}`}>
          {currentStep.isNewParagraph ? PARAGRAPH_GAP : null}
          <span className='sr-only'>{currentStep.text}</span>
          {/* Filled by the typing animation, so React never owns this text */}
          <span aria-hidden='true' data-chat-title className='mr-[6px] select-none' />
          <ChatCurrentStep step={currentStep} chatForm={chatForm} />
        </Fragment>
      ) : null}
    </p>
  )
}
