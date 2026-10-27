import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { ImageResponse } from 'next/og'

import { SITE_CONFIG } from '@/config/site'

export const alt = SITE_CONFIG.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The site's Geist, read from disk: next/og's default font has no Cyrillic for the tagline
const loadFont = (file: string) => readFile(join(process.cwd(), 'assets/fonts', file))

// The favicon's look on a wide card: the light wordmark on the logo's dark tile
export default async function OpengraphImage() {
  const [bold, regular] = await Promise.all([
    loadFont('Geist-Bold.ttf'),
    loadFont('Geist-Regular.ttf')
  ])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 28,
        background: SITE_CONFIG.logoColors.tile,
        color: SITE_CONFIG.logoColors.mark,
        fontFamily: 'Geist'
      }}
    >
      <div style={{ fontSize: 240, fontWeight: 700, letterSpacing: '-0.05em', lineHeight: 1 }}>
        {SITE_CONFIG.name}
      </div>
      <div style={{ fontSize: 40, fontWeight: 400, opacity: 0.6 }}>{SITE_CONFIG.tagline}</div>
    </div>,
    {
      ...size,
      fonts: [
        { name: 'Geist', data: bold, weight: 700, style: 'normal' },
        { name: 'Geist', data: regular, weight: 400, style: 'normal' }
      ]
    }
  )
}
