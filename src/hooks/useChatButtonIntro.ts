import { useGSAP } from '@gsap/react'
import { usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { CustomEase } from 'gsap/CustomEase'
import { usePathname } from 'next/navigation'
import type { RefObject } from 'react'

import { INTRO_DURATION } from '@/config/animation'
import { useIsLoadingFinished } from '@/stores/loading'

gsap.registerPlugin(useGSAP, CustomEase)

const BUTTON_FADE_DURATION = 1
const BUTTON_FADE_EASE = CustomEase.create('chatButtonFade', '0.31, 0.13, 0.11, 1')

export interface UseChatButtonIntroParams {
  buttonRef: RefObject<HTMLButtonElement | null>
}

export const useChatButtonIntro = ({ buttonRef }: UseChatButtonIntroParams) => {
  const isHome = usePathname() === '/'
  const isLoadingFinished = useIsLoadingFinished()
  const reduceMotion = usePreferredReducedMotion() === 'reduce'

  // On the home page the button waits for the title to load
  const isVisible = !isHome || isLoadingFinished

  useGSAP(
    () => {
      if (!isVisible) return

      gsap.fromTo(
        buttonRef.current,
        { autoAlpha: 0 },
        {
          autoAlpha: 1,
          delay: isHome && !reduceMotion ? INTRO_DURATION : 0,
          duration: reduceMotion ? 0 : BUTTON_FADE_DURATION,
          ease: BUTTON_FADE_EASE
        }
      )
    },
    { dependencies: [isVisible] }
  )
}
