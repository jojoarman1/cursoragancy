// Lets any button on the page open the chat, which lives in the layout (useChat listens for it)
export const CHAT_OPEN_EVENT = 'dialog:chat-open'

declare global {
  interface WindowEventMap {
    [CHAT_OPEN_EVENT]: Event
  }
}

export const requestChatOpen = () => window.dispatchEvent(new Event(CHAT_OPEN_EVENT))
