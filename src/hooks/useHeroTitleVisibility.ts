import { useIntersectionObserver, useUnmount } from '@siberiacancode/reactuse'

import { heroStore } from '@/stores/hero'

// Tells the header whether the big hero word is on screen; the returned ref goes on an element
// covering the word's band
export const useHeroTitleVisibility = () => {
  const intersectionObserver = useIntersectionObserver<HTMLDivElement>({
    onChange: ([entry]) => heroStore.set({ isTitleVisible: entry.isIntersecting })
  })

  // Other pages have no hero word; the next visit to home starts from "visible" again
  useUnmount(() => heroStore.set({ isTitleVisible: true }))

  return {
    refs: { titleBandRef: intersectionObserver.ref }
  }
}
