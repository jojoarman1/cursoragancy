import assert from 'node:assert/strict'
import { describe, it } from 'node:test'

import { leadSchema } from './lead.schema'

const contact = { stepId: 'contact', values: ['test@example.com'] }
const validLead = {
  answers: [
    { stepId: 'name', values: ['Test'] },
    { stepId: 'subject', values: ['новый проект'] },
    { stepId: 'project', values: ['сайт компании'] },
    { stepId: 'projectNeeds', values: ['дизайн', 'разработка'] },
    { stepId: 'projectDeadline', values: ['за 3 месяца'] },
    contact
  ],
  consent: true
}

describe('leadSchema', () => {
  it('Should accept a complete project enquiry', () => {
    assert.equal(leadSchema.safeParse(validLead).success, true)
  })

  it('Should accept the full permitted length of a multiline answer', () => {
    const result = leadSchema.safeParse({
      answers: [{ stepId: 'something', values: ['&'.repeat(2000)] }, contact],
      consent: true
    })

    assert.equal(result.success, true)
  })

  it('Should reject unknown and inherited step IDs without throwing', () => {
    ;['nonexistent', '__proto__', 'constructor'].forEach(stepId => {
      const result = leadSchema.safeParse({
        answers: [{ stepId, values: ['test'] }, contact],
        consent: true
      })

      assert.equal(result.success, false)
    })
  })

  it('Should reject repeated answers for the same step', () => {
    const result = leadSchema.safeParse({
      ...validLead,
      answers: [...validLead.answers, validLead.answers[0]]
    })

    assert.equal(result.success, false)
  })

  it('Should reject an invalid contact followed by a valid duplicate', () => {
    const result = leadSchema.safeParse({
      answers: [{ stepId: 'contact', values: ['x'] }, contact],
      consent: true
    })

    assert.equal(result.success, false)
  })

  it('Should reject oversized combined answers even with distinct steps', () => {
    const result = leadSchema.safeParse({
      answers: [
        { stepId: 'something', values: ['a'.repeat(2000)] },
        { stepId: 'about', values: ['b'.repeat(2000)] },
        contact
      ],
      consent: true
    })

    assert.equal(result.success, false)
  })

  it('Should reject a missing or invalid contact', () => {
    const answers = [
      [{ stepId: 'name', values: ['Test'] }],
      [{ stepId: 'contact', values: ['x'] }],
      [{ stepId: 'contact', values: [] }]
    ]

    answers.forEach(answers => {
      assert.equal(leadSchema.safeParse({ answers, consent: true }).success, false)
    })
  })

  it('Should reject a submission without consent', () => {
    assert.equal(leadSchema.safeParse({ ...validLead, consent: false }).success, false)
  })
})
