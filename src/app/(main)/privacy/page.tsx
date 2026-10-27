import type { Metadata } from 'next'

import { LegalDocument } from '@/components/elements/legal/LegalDocument'
import { LEGAL_LINKS } from '@/config/legal'
import { PRIVACY_POLICY_SECTIONS, PRIVACY_POLICY_TITLE } from '@/config/privacyPolicy'

export const metadata: Metadata = {
  title: PRIVACY_POLICY_TITLE,
  alternates: { canonical: LEGAL_LINKS.privacy }
}

export default function PrivacyPage() {
  return <LegalDocument title={PRIVACY_POLICY_TITLE} sections={PRIVACY_POLICY_SECTIONS} />
}
