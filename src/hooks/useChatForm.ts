import { useGSAP } from '@gsap/react'
import { useBoolean, usePreferredReducedMotion } from '@siberiacancode/reactuse'
import gsap from 'gsap'
import { type KeyboardEvent, useRef, useState } from 'react'

import { LINE_REVEAL_DURATION, LINE_REVEAL_EASE } from '@/config/animation'
import {
  CHAT_EMAIL_PATTERN,
  CHAT_FIRST_STEP_ID,
  CHAT_STEPS,
  type ChatOption,
  getChatThanks
} from '@/config/chat'
import { SITE_CONFIG } from '@/config/site'

gsap.registerPlugin(useGSAP)

const TYPING_CHAR_DELAY = 0.07
const TYPING_CHAR_DURATION = 0.1
const CONTROLS_DURATION = 0.8
const CONTROLS_STAGGER = 0.15
const CONTROLS_SHIFT = 8
const CONTROLS_EASE = 'power2.out'
const THANKS_DURATION = 0.5
const THANKS_EASE = 'power1.out'

const TITLE_SELECTOR = '[data-chat-title]'
const CONTROL_SELECTOR = '[data-chat-control]'
const OPTION_SELECTOR = '[data-chat-option]'
const OPTIONS_STAGGER = 0.25

const getHiddenElements = (form: HTMLElement | null, selector: string) =>
  Array.from(form?.querySelectorAll<HTMLElement>(selector) ?? []).filter(
    element => getComputedStyle(element).visibility === 'hidden'
  )

interface ChatAnswer {
  stepId: string
  values: string[]
}

const getMailtoHref = (answers: ChatAnswer[]) => {
  const subject = answers.find(answer => answer.stepId === 'subject')?.values[0] ?? ''
  const body = answers
    .map(answer => `${CHAT_STEPS[answer.stepId].label}: ${answer.values.join(', ')}`)
    .join('\n')

  return `mailto:${SITE_CONFIG.email}?subject=${encodeURIComponent(`Заявка с сайта: ${subject}`)}&body=${encodeURIComponent(body)}`
}

// Every character takes its place up front, so words don't jump to the next line mid-typing
const getHiddenChars = (title: HTMLElement, text: string) => {
  if (!title.childElementCount) {
    title.replaceChildren(
      ...Array.from(text, char => {
        const span = document.createElement('span')
        span.textContent = char
        span.style.opacity = '0'
        return span
      })
    )
  }

  return Array.from(title.children).filter(
    char => char instanceof HTMLElement && Number(char.style.opacity) < 1
  )
}

const focusAtEnd = (element: HTMLElement) => {
  element.focus()

  const selection = window.getSelection()
  selection?.selectAllChildren(element)
  selection?.collapseToEnd()
}

export const useChatForm = () => {
  const reduceMotion = usePreferredReducedMotion() === 'reduce'
  const [answers, setAnswers] = useState<ChatAnswer[]>([])
  const [stepId, setStepId] = useState<string | null>(CHAT_FIRST_STEP_ID)
  const [selected, setSelected] = useState<string[]>([])
  const [isEmailError, toggleEmailError] = useBoolean()
  const [isSent, toggleSent] = useBoolean()

  const formRef = useRef<HTMLDivElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const thanksRef = useRef<HTMLParagraphElement>(null)
  const inputRef = useRef<HTMLSpanElement>(null)
  const sendRef = useRef<HTMLButtonElement>(null)
  const timelineRef = useRef<gsap.core.Timeline>(null)
  // Steps change only while the panel is shown; the first reveal comes from opening it
  const isShownRef = useRef(false)
  const isEditingRef = useRef(false)
  const editValueRef = useRef('')

  const step = stepId ? CHAT_STEPS[stepId] : null
  const name = answers[0]?.values[0] ?? ''
  const canSend = !isSent && (!step || Boolean(step.isOptional))

  const { contextSafe } = useGSAP({ scope: formRef })

  const revealStep = contextSafe(() => {
    isShownRef.current = true
    timelineRef.current?.kill()

    if (!step) {
      sendRef.current?.focus()
      return
    }

    const input = inputRef.current
    const timeline = gsap.timeline({
      onComplete: () => {
        if (input) focusAtEnd(input)
        else formRef.current?.querySelector<HTMLElement>(OPTION_SELECTOR)?.focus()
      }
    })
    timelineRef.current = timeline

    if (input && editValueRef.current) input.textContent = editValueRef.current
    editValueRef.current = ''

    const title = formRef.current?.querySelector<HTMLElement>(TITLE_SELECTOR)
    if (title) {
      const hiddenChars = getHiddenChars(title, step.text)
      // An edited step was already typed once
      if (isEditingRef.current) gsap.set(hiddenChars, { opacity: 1 })
      else {
        timeline.to(hiddenChars, {
          opacity: 1,
          duration: TYPING_CHAR_DURATION,
          ease: 'none',
          stagger: TYPING_CHAR_DELAY
        })
      }
    }
    isEditingRef.current = false

    // Reopening the panel must not replay what is already shown
    const hiddenControls = getHiddenElements(formRef.current, CONTROL_SELECTOR)
    const hiddenOptions = getHiddenElements(formRef.current, OPTION_SELECTOR)

    if (hiddenControls.length) {
      timeline.fromTo(
        hiddenControls,
        { autoAlpha: 0, y: CONTROLS_SHIFT },
        {
          autoAlpha: 1,
          y: 0,
          duration: CONTROLS_DURATION,
          ease: CONTROLS_EASE,
          stagger: CONTROLS_STAGGER
        }
      )
    }
    if (hiddenOptions.length) {
      timeline.fromTo(
        hiddenOptions,
        { autoAlpha: 0, yPercent: 100 },
        {
          autoAlpha: 1,
          yPercent: 0,
          duration: LINE_REVEAL_DURATION,
          ease: LINE_REVEAL_EASE,
          stagger: OPTIONS_STAGGER
        }
      )
    }

    if (reduceMotion) timeline.progress(1)
  })

  useGSAP(
    () => {
      if (isShownRef.current) revealStep()
    },
    { dependencies: [answers.length, stepId], scope: formRef }
  )

  const completeStep = (values: string[], next?: string) => {
    if (!stepId || !step) return

    setAnswers(prevAnswers => [...prevAnswers, { stepId, values }])
    setStepId(next ?? step.next ?? null)
    setSelected([])
    toggleEmailError(false)
  }

  const submitInput = () => {
    const value = inputRef.current?.innerText.trim()
    if (!step || !value) return

    if (step.inputMode === 'email' && !CHAT_EMAIL_PATTERN.test(value)) {
      toggleEmailError(true)
      return
    }

    completeStep([value])
  }

  const onInputKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (event.key !== 'Enter') return
    // Shift+Enter adds a line in multiline answers
    if (event.shiftKey && step?.isMultiline) return

    event.preventDefault()
    submitInput()
  }

  const onInput = () => {
    if (isEmailError) toggleEmailError(false)
  }

  const selectOption = (option: ChatOption) => {
    if (!step?.isMultiselect) {
      completeStep([option.value], option.next)
      return
    }

    setSelected(prevSelected =>
      prevSelected.includes(option.value)
        ? prevSelected.filter(value => value !== option.value)
        : [...prevSelected, option.value]
    )
  }

  const applySelection = () => {
    if (selected.length) completeStep(selected)
  }

  const editAnswer = (index: number) => {
    const answer = answers[index]
    const answerStep = CHAT_STEPS[answer.stepId]

    isEditingRef.current = true
    editValueRef.current = answerStep.options ? '' : answer.values.join('')
    setAnswers(prevAnswers => prevAnswers.slice(0, index))
    setStepId(answer.stepId)
    setSelected(answerStep.isMultiselect ? answer.values : [])
    toggleEmailError(false)
  }

  const send = contextSafe(() => {
    if (!canSend) return

    const optionalValue = step?.isOptional ? inputRef.current?.innerText.trim() : ''
    const sentAnswers =
      stepId && optionalValue ? [...answers, { stepId, values: [optionalValue] }] : answers

    window.location.href = getMailtoHref(sentAnswers)
    toggleSent(true)

    timelineRef.current?.kill()
    gsap
      .timeline()
      .to(bodyRef.current, { autoAlpha: 0, duration: THANKS_DURATION, ease: THANKS_EASE })
      .to(thanksRef.current, { autoAlpha: 1, duration: THANKS_DURATION, ease: THANKS_EASE })
  })

  const onClosed = contextSafe(() => {
    isShownRef.current = false
    if (!isSent) return

    setAnswers([])
    setStepId(CHAT_FIRST_STEP_ID)
    setSelected([])
    toggleSent(false)
    gsap.set(bodyRef.current, { autoAlpha: 1 })
    gsap.set(thanksRef.current, { autoAlpha: 0 })
  })

  return {
    state: {
      answers,
      step,
      stepId,
      selected,
      isEmailError,
      canSend,
      thanks: getChatThanks(name)
    },
    refs: { formRef, bodyRef, thanksRef, inputRef, sendRef },
    functions: {
      revealStep,
      onClosed,
      onInputKeyDown,
      onInput,
      submitInput,
      selectOption,
      applySelection,
      editAnswer,
      send
    }
  }
}
