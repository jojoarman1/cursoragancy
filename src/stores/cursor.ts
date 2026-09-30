import { createStore } from '@siberiacancode/reactuse'
import { useSyncExternalStore } from 'react'

export const cursorStore = createStore({ isOverLogo: false })

const getIsOverLogo = () => cursorStore.get().isOverLogo
const getInitialIsOverLogo = () => cursorStore.getInitial().isOverLogo

export const useIsOverLogo = () =>
  useSyncExternalStore(cursorStore.subscribe, getIsOverLogo, getInitialIsOverLogo)
