import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
  server: {
    // Optional so builds work without them; the lead route answers 503 until they're set
    TELEGRAM_BOT_TOKEN: z.string().optional(),
    TELEGRAM_CHAT_ID: z.string().optional()
  },
  client: {
    NEXT_PUBLIC_SITE_URL: z.url().optional()
  },
  experimental__runtimeEnv: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL
  },
  emptyStringAsUndefined: true
})
