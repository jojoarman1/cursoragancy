import type { Metadata } from 'next'

import { LegalDocument } from '@/components/elements/legal/LegalDocument'
import { CONSENT_SECTIONS, CONSENT_TITLE } from '@/config/consent'
import { LEGAL_LINKS } from '@/config/legal'

export const metadata: Metadata = {
  title: CONSENT_TITLE,
  alternates: { canonical: LEGAL_LINKS.consent }
}

export default function ConsentPage() {
  return <LegalDocument title={CONSENT_TITLE} sections={CONSENT_SECTIONS} />
}
