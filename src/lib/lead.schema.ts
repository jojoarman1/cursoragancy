import { z } from 'zod'

import { CHAT_STEPS, getChatMaxLength, isChatContact } from '@/config/chat'
import { LEAD_LIMITS } from '@/config/lead'

const leadAnswerSchema = z
  .object({
    stepId: z.string(),
    values: z.array(z.string().trim().min(1)).min(1).max(LEAD_LIMITS.values)
  })
  .refine(({ stepId, values }) => {
    if (!Object.hasOwn(CHAT_STEPS, stepId)) return false
    const step = CHAT_STEPS[stepId]
    if (!step.options) {
      return (
        values.length === 1 &&
        values[0].length <= getChatMaxLength(step) &&
        (!step.isContact || isChatContact(values[0]))
      )
    }

    const optionValues = step.options.map(option => option.value)
    return (
      (step.isMultiselect || values.length === 1) &&
      values.every(value => optionValues.includes(value))
    )
  })

// Checked again on the server: the endpoint is open to anyone
export const leadSchema = z
  .object({
    answers: z.array(leadAnswerSchema).min(1).max(LEAD_LIMITS.answers),
    // 152-FZ: a separate, active consent before any personal data is processed
    consent: z.literal(true)
  })
  .refine(lead => new Set(lead.answers.map(answer => answer.stepId)).size === lead.answers.length, {
    message: 'Each step can only be answered once'
  })
  .refine(
    lead =>
      lead.answers.flatMap(answer => answer.values).join('').length <= LEAD_LIMITS.totalTextLength,
    { message: 'The combined answers are too long' }
  )
  .refine(lead => lead.answers.some(answer => answer.stepId === 'contact'), {
    message: 'A contact to reply to is required'
  })

export type Lead = z.infer<typeof leadSchema>
export type LeadAnswer = z.infer<typeof leadAnswerSchema>
