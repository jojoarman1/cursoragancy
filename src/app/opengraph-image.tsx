import { ImageResponse } from 'next/og'

import { CURSOR_ICON_PATH } from '@/components/icon/CursorIcon'
import { SITE_CONFIG } from '@/config/site'

export const alt = SITE_CONFIG.title
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// The default next/og font has no Cyrillic: a Cyrillic name needs a font passed via `fonts`
export default function OpengraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 48,
        background: SITE_CONFIG.themeColor,
        color: 'white'
      }}
    >
      <svg width={160} height={160} viewBox='0 0 24 24' fill='white' aria-hidden='true'>
        <path d={CURSOR_ICON_PATH} />
      </svg>
      <div style={{ fontSize: 72 }}>{SITE_CONFIG.name}</div>
    </div>,
    size
  )
}
