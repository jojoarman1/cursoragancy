import { z } from 'zod'

import { CHAT_STEPS, getChatMaxLength, isChatContact } from '@/config/chat'
import { LEAD_LIMITS } from '@/config/lead'

const leadAnswerSchema = z
  .object({
    stepId: z.string().refine(stepId => Object.hasOwn(CHAT_STEPS, stepId)),
    values: z.array(z.string().trim().min(1)).min(1).max(LEAD_LIMITS.values)
  })
  .refine(({ stepId, values }) => {
    const step = CHAT_STEPS[stepId]
    if (!step.options) return values.length === 1 && values[0].length <= getChatMaxLength(step)

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
  .refine(
    lead =>
      lead.answers.some(answer => answer.stepId === 'contact' && isChatContact(answer.values[0])),
    { message: 'A contact to reply to is required' }
  )

export type Lead = z.infer<typeof leadSchema>
export type LeadAnswer = z.infer<typeof leadAnswerSchema>
