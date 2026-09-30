'use client'

import clsx from 'clsx'
import { Fragment } from 'react'

import { CHAT_STEPS } from '@/config/chat'
import { SITE_CONFIG } from '@/config/site'
import { useChat } from '@/hooks/useChat'
import { useChatForm } from '@/hooks/useChatForm'

const CHAT_DOT_POSITIONS = ['left-0', 'left-[9px]', 'right-0']
// Dots are 9px dashes scaled down; scaling them back up joins them into a line
const CLOSE_DOT_POSITIONS = ['left-0 origin-left', 'left-[9px] origin-left', 'right-0 origin-right']

const PANEL_ID = 'chat-panel'

const ANSWER_CLASS_NAME =
  'mr-[6px] inline-block max-w-full cursor-pointer rounded-[10px] bg-[#eaeaeb] px-[10px] pt-[3px] pb-[1px] text-left leading-[1.3] break-words whitespace-pre-wrap text-black/50 transition-colors hover:text-black focus-visible:text-black focus-visible:outline-none'
const OPTION_CLASS_NAME =
  'invisible mr-[4px] mb-[4px] cursor-pointer rounded-[10px] border border-black/50 px-[10px] pt-[3px] pb-[1px] text-left leading-[1.3] text-black/50 transition-colors hover:text-black focus-visible:border-black focus-visible:text-black focus-visible:outline-none aria-pressed:border-black aria-pressed:bg-black aria-pressed:text-white'
const HINT_CLASS_NAME =
  'relative -top-[1rem] cursor-pointer align-middle font-mono text-sm font-light whitespace-nowrap text-black/50 uppercase transition-colors after:absolute after:-inset-x-[6px] after:-inset-y-[14px] hover:text-black focus-visible:text-black focus-visible:outline-none'

const NOTE_CLASS_NAME =
  'invisible relative -top-[1rem] align-middle font-mono text-sm font-light whitespace-nowrap text-black/50 uppercase select-none'

const PARAGRAPH_GAP = <span aria-hidden='true' className='block h-[30px]' />

// Button and panel are separate fixed elements: a shared positioned parent would
// isolate the button's mix-blend-difference from the page
export const Chat = () => {
  const chatForm = useChatForm()
  const chat = useChat({
    onContentShow: chatForm.functions.revealStep,
    onClosed: chatForm.functions.onClosed
  })

  const currentStep = chatForm.state.step

  return (
    <div ref={chat.refs.rootRef} className='font-mono text-sm'>
      {/* px, not artboard rem: the tap target must not shrink on small screens */}
      <button
        ref={chat.refs.buttonRef}
        type='button'
        aria-label='Открыть чат'
        aria-controls={PANEL_ID}
        aria-expanded={chat.state.isOpen}
        onClick={chat.functions.open}
        className='invisible fixed bottom-6 left-6 z-40 h-[35px] mix-blend-difference w-[60px] cursor-pointer rounded-[17px] bg-white focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-black max-[480px]:h-[28px] max-[480px]:w-0.7]'
      >
        <span
          aria-hidden='true'
          className='absolute top-[18px] left-1/2 h-[3px] w-[21px] -translate-x-1/2 max-[480px]:top-[13px]'
        >
          {CHAT_DOT_POSITIONS.map(position => (
            <span
              key={position}
              data-chat-jump-dot
              className={clsx('absolute top-0 size-[3px] bg-[#0c0c0c]', position)}
            />
          ))}
        </span>
      </button>

      <section
        ref={chat.refs.panelRef}
        id={PANEL_ID}
        aria-label='Чат'
        className='invisible fixed top-[calc(106rem+var(--chat-viewport-top,0px))] bottom-[calc(24rem+var(--chat-viewport-bottom,0px))] left-6 z-50 w-[min(400px,calc(100vw-48rem))] rounded-[17px] text-black selection:bg-black selection:text-white max-[480px]:right-6 max-[480px]:w-auto'
      >
        {/* Same box as the chat button; follows the panel's top-right corner while it expands */}
        <button
          ref={chat.refs.closeButtonRef}
          type='button'
          aria-label='Свернуть чат'
          onClick={chat.functions.close}
          className='absolute top-0 right-0 z-10 h-[35px] w-[60px] cursor-pointer rounded-[17px] focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-black max-[480px]:h-[28px]'
        >
          <span
            aria-hidden='true'
            className='absolute top-[18px] left-1/2 h-[3px] w-[21px] -translate-x-1/2 max-[480px]:top-[13px]'
          >
            {CLOSE_DOT_POSITIONS.map(position => (
              <span
                key={position}
                data-chat-dot
                className={clsx('absolute top-0 h-[3px] w-[9px] bg-black', position)}
              />
            ))}
          </span>
        </button>

        <div ref={chat.refs.contentRef} className='invisible relative h-full'>
          <div ref={chatForm.refs.bodyRef} className='flex h-full flex-col'>
            <p className='px-[20px] pt-[22px] pb-[10px] leading-[1.2] text-[14px] font-light uppercase'>
              To: {SITE_CONFIG.name}
            </p>

            <div
              ref={chatForm.refs.formRef}
              className='flex-1 overflow-y-auto p-[20px] font-sans text-[max(18px,20rem)] leading-[1.6]'
            >
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
                          className={ANSWER_CLASS_NAME}
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
                    {currentStep.options ? (
                      <>
                        {currentStep.options.map(option => {
                          const isSelected = chatForm.state.selected.includes(option.value)

                          return (
                            <button
                              key={option.value}
                              type='button'
                              data-chat-option
                              aria-pressed={currentStep.isMultiselect ? isSelected : undefined}
                              onClick={() => chatForm.functions.selectOption(option)}
                              className={OPTION_CLASS_NAME}
                            >
                              {option.value}
                            </button>
                          )
                        })}
                        {currentStep.isMultiselect && chatForm.state.selected.length ? (
                          <button
                            type='button'
                            onClick={chatForm.functions.applySelection}
                            className={HINT_CLASS_NAME}
                          >
                            [Применить]
                          </button>
                        ) : null}
                        {currentStep.isMultiselect ? (
                          // Kept mounted and only hidden, so it keeps its revealed state
                          <span
                            data-chat-option
                            className={clsx(
                              NOTE_CLASS_NAME,
                              chatForm.state.selected.length > 0 && 'hidden'
                            )}
                          >
                            [Можно несколько]
                          </span>
                        ) : null}
                      </>
                    ) : (
                      <>
                        {/* biome-ignore lint/a11y/useSemanticElements: an input can't wrap inline with the sentence */}
                        <span
                          ref={chatForm.refs.inputRef}
                          role='textbox'
                          aria-label={currentStep.label}
                          aria-multiline={currentStep.isMultiline}
                          aria-invalid={chatForm.state.isEmailError}
                          contentEditable='plaintext-only'
                          inputMode={currentStep.inputMode}
                          enterKeyHint={currentStep.isMultiline ? 'enter' : 'next'}
                          autoCapitalize={currentStep.inputMode === 'email' ? 'off' : 'sentences'}
                          spellCheck={currentStep.inputMode !== 'email'}
                          tabIndex={0}
                          data-chat-control
                          onKeyDown={chatForm.functions.onInputKeyDown}
                          onInput={chatForm.functions.onInput}
                          className='invisible mr-[6px] break-all pr-[5px] outline-none aria-invalid:rounded-[4px] aria-invalid:border aria-invalid:border-dashed aria-invalid:border-red-600 aria-invalid:px-[4px] aria-multiline:block aria-multiline:whitespace-pre-wrap'
                        />
                        <button
                          type='button'
                          aria-label='Ответить'
                          data-chat-control
                          onClick={chatForm.functions.submitInput}
                          className={clsx('invisible', HINT_CLASS_NAME)}
                        >
                          [Enter]
                        </button>
                        {chatForm.state.isEmailError ? (
                          <span
                            role='alert'
                            className='block font-mono text-sm text-red-600 uppercase'
                          >
                            Неверный email
                          </span>
                        ) : null}
                      </>
                    )}
                  </Fragment>
                ) : null}
              </p>
            </div>

            <div className='flex items-end justify-between p-[20px]'>
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className='relative text-[max(10px,12rem)] uppercase opacity-50 after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:bg-current'
              >
                {SITE_CONFIG.email}
              </a>
              <button
                ref={chatForm.refs.sendRef}
                type='button'
                disabled={!chatForm.state.canSend}
                onClick={() => chatForm.functions.send(chat.functions.close)}
                className='cursor-pointer rounded-[10px] border border-white bg-white px-[8px] py-[6px] text-[14px] leading-[1.2] text-black uppercase transition-[background-color,color,opacity] duration-300 ease-in-out disabled:cursor-default disabled:opacity-50'
              >
                Отправить
              </button>
            </div>
          </div>

          <p
            ref={chatForm.refs.thanksRef}
            className='invisible absolute inset-0 flex items-center justify-center px-[20px] text-center uppercase'
          >
            {chatForm.state.thanks}
          </p>
        </div>
      </section>
    </div>
  )
}
