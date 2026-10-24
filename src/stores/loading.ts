import { createStore } from '@siberiacancode/reactuse'
import { useSyncExternalStore } from 'react'

export const loadingStore = createStore({ pendingTasks: 0, isFinished: false })

const getIsFinished = () => loadingStore.get().isFinished
const getInitialIsFinished = () => loadingStore.getInitial().isFinished

// Not `loadingStore.use()`: React Compiler may skip a method named `use`
export const useIsLoadingFinished = () =>
  useSyncExternalStore(loadingStore.subscribe, getIsFinished, getInitialIsFinished)
