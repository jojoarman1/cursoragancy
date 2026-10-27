import type { MetadataRoute } from 'next'

import { SITE_CONFIG } from '@/config/site'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.name,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    lang: SITE_CONFIG.lang,
    start_url: '/',
    display: 'standalone',
    background_color: SITE_CONFIG.themeColor,
    theme_color: SITE_CONFIG.themeColor,
    icons: [
      {
        src: '/web-app-manifest-192x192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable'
      },
      {
        src: '/web-app-manifest-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable'
      }
    ]
  }
}
