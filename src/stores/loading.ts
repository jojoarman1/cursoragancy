import { createStore } from '@siberiacancode/reactuse'
import { useSyncExternalStore } from 'react'

export const loadingStore = createStore({ pendingTasks: 0, isFinished: false })

const getIsFinished = () => loadingStore.get().isFinished
const getInitialIsFinished = () => loadingStore.getInitial().isFinished
const getIsContentReady = () => loadingStore.get().pendingTasks === 0
const getInitialIsContentReady = () => loadingStore.getInitial().pendingTasks === 0

// Not `loadingStore.use()`: React Compiler may skip a method named `use`
export const useIsLoadingFinished = () =>
  useSyncExternalStore(loadingStore.subscribe, getIsFinished, getInitialIsFinished)

export const useIsContentReady = () =>
  useSyncExternalStore(loadingStore.subscribe, getIsContentReady, getInitialIsContentReady)
