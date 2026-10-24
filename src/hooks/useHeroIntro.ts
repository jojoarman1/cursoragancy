import { useEffect } from 'react'

import { useLoadingTask } from '@/hooks/useLoadingTask'
import { useIsLoadingFinished } from '@/stores/loading'

// Shows the page even if the scene never reports ready (e.g. no WebGL)
const MAX_LOADING_TIME = 8000

export const useHeroIntro = () => {
  const loadingTask = useLoadingTask()
  const isLoaded = useIsLoadingFinished()

  useEffect(() => {
    const timeoutId = setTimeout(loadingTask.functions.complete, MAX_LOADING_TIME)
    return () => clearTimeout(timeoutId)
  }, [loadingTask.functions.complete])

  return {
    state: { isLoaded },
    functions: { onSceneReady: loadingTask.functions.complete }
  }
}
