import { useMount, useUnmount } from '@siberiacancode/reactuse'
import { useRef } from 'react'

import { loadingStore } from '@/stores/loading'

export const useLoadingTask = () => {
  const isCompleteRef = useRef(false)

  const complete = () => {
    if (isCompleteRef.current) return

    isCompleteRef.current = true
    loadingStore.set(state => {
      const pendingTasks = state.pendingTasks - 1
      // Stays finished: coming back to the page doesn't replay the intro
      return { pendingTasks, isFinished: state.isFinished || pendingTasks === 0 }
    })
  }

  useMount(() => {
    isCompleteRef.current = false
    loadingStore.set(state => ({ pendingTasks: state.pendingTasks + 1 }))
  })

  useUnmount(complete)

  return {
    functions: { complete }
  }
}
