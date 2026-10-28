import { useMount } from '@siberiacancode/reactuse'

// On reload the browser restores the last scroll position and ignores the hash, so "/#works"
// would only land on the section if the visitor was already there
export const useHashScrollOnLoad = () => {
  useMount(() => {
    const id = decodeURIComponent(window.location.hash.slice(1))
    const section = id ? document.getElementById(id) : null
    if (!section) return

    window.history.scrollRestoration = 'manual'
    section.scrollIntoView({ behavior: 'instant', block: 'start' })
    window.history.scrollRestoration = 'auto'
  })
}
