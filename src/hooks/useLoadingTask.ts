import { useMount, useUnmount } from '@siberiacancode/reactuse'
import { useRef } from 'react'

import { loadingStore } from '@/stores/loading'

export const useLoadingTask = () => {
  const isCompleteRef = useRef(false)

  const complete = () => {
    if (isCompleteRef.current) return

    isCompleteRef.current = true
    loadingStore.set(state => ({ pendingTasks: state.pendingTasks - 1 }))
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
