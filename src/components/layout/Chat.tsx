'use client'

import clsx from 'clsx'

import { ArrowUpIcon } from '@/components/icon/ArrowUpIcon'
import { MinusIcon } from '@/components/icon/MinusIcon'
import { SITE_CONFIG } from '@/config/site'
import { useChat } from '@/hooks/useChat'
import { useChatForm } from '@/hooks/useChatForm'

import { ChatConversation } from './chat/ChatConversation'
import { TileButton } from './TileButton'

const PANEL_ID = 'chat-panel'

const ICON_TILE_CLASS_NAME =
  'flex size-6 items-center justify-center rounded-[2.4rem] bg-background/30 text-background'

export const Chat = () => {
  const chatForm = useChatForm()
  const chat = useChat({
    onContentShow: chatForm.functions.revealStep,
    onClosed: chatForm.functions.onClosed
  })

  return (
    <div ref={chat.refs.rootRef} className='font-sans'>
      <TileButton
        ref={chat.refs.buttonRef}
        label='Начать проект'
        icon={<ArrowUpIcon className='size-4.5' />}
        aria-controls={PANEL_ID}
        aria-expanded={chat.state.isOpen}
        onClick={chat.functions.open}
        className='invisible fixed bottom-6 left-6 z-40'
      />

      {/* The shadow sits outside the element that gets clipped, or the clip would cut it off. The
          radius here only sets the clip's open rounding: the inner layer has none, so its corners
          don't round before the clip does */}
      <section
        ref={chat.refs.panelRef}
        id={PANEL_ID}
        aria-label='Чат'
        className='invisible fixed top-[calc(106rem+var(--chat-viewport-top,0px))] bottom-[calc(24rem+var(--chat-viewport-bottom,0px))] left-6 z-50 w-[min(400px,calc(100vw-48rem))] rounded-[2.4rem] drop-shadow-[0_0_40rem_rgb(0_0_0/0.4)] max-[480px]:drop-shadow-none max-[480px]:right-6 max-[480px]:w-auto'
      >
        <div
          ref={chat.refs.clipRef}
          className='relative h-full bg-foreground text-background selection:bg-background selection:text-foreground'
        >
          {/* Starts over the button's arrow tile and follows the panel's corner while it expands */}
          <button
            ref={chat.refs.closeButtonRef}
            type='button'
            aria-label='Свернуть чат'
            onClick={chat.functions.close}
            className={clsx(
              ICON_TILE_CLASS_NAME,
              'absolute top-[4.5rem] right-[4.5rem] z-10 cursor-pointer focus-visible:outline-2 focus-visible:outline-background'
            )}
          >
            <ArrowUpIcon data-chat-arrow className='absolute size-4.5' />
            <MinusIcon data-chat-minus className='absolute w-4 opacity-0' />
          </button>

          <div ref={chat.refs.contentRef} className='invisible relative h-full'>
            <div ref={chatForm.refs.bodyRef} className='flex h-full flex-col'>
              <p className='px-1.5 pt-1.25 pb-[10px] text-[14rem] leading-5 tracking-[-0.2rem] capitalize'>
                To: {SITE_CONFIG.name}
              </p>

              <div
                ref={chatForm.refs.formRef}
                className='flex-1 overflow-y-auto px-3 py-[20px] text-[max(18px,20rem)] leading-[1.6]'
              >
                <ChatConversation chatForm={chatForm} />
              </div>

              <div className='flex items-end justify-between px-3 py-[20px]'>
                <a
                  href={`mailto:${SITE_CONFIG.email}`}
                  className='text-[14px] text-background/50 underline underline-offset-2'
                >
                  <span aria-hidden='true'>↳ </span>
                  {SITE_CONFIG.email}
                </a>
                <button
                  ref={chatForm.refs.sendRef}
                  type='button'
                  disabled={!chatForm.state.canSend}
                  onClick={() => chatForm.functions.send(chat.functions.close)}
                  className='cursor-pointer rounded-[2.4rem] bg-background px-2 py-[6.5rem] text-[20rem] leading-5 tracking-[-0.2rem] text-foreground transition-opacity disabled:cursor-default disabled:opacity-40'
                >
                  Отправить
                </button>
              </div>
            </div>

            <p
              ref={chatForm.refs.thanksRef}
              className='invisible absolute inset-0 flex items-center justify-center px-1.5 text-center text-[20rem]'
            >
              {chatForm.state.thanks}
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
