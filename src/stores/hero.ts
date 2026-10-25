import { createStore } from '@siberiacancode/reactuse'
import { useSyncExternalStore } from 'react'

// Starts visible, so the header logo doesn't flash on the home page before the hero reports in
export const heroStore = createStore({ isTitleVisible: true })

const getIsTitleVisible = () => heroStore.get().isTitleVisible
const getInitialIsTitleVisible = () => heroStore.getInitial().isTitleVisible

// Not `heroStore.use()`: React Compiler may skip a method named `use`
export const useIsHeroTitleVisible = () =>
  useSyncExternalStore(heroStore.subscribe, getIsTitleVisible, getInitialIsTitleVisible)
