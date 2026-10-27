import { LEAD_ENDPOINT } from '@/config/lead'

import type { Lead } from './lead.schema'

export const sendLead = async (lead: Lead) => {
  const response = await fetch(LEAD_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(lead)
  })

  if (!response.ok) throw new Error(`The lead was not sent: ${response.status}`)
}
