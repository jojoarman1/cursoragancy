import { ImageResponse } from 'next/og'

import { CURSOR_ICON_PATH } from '@/components/icon/CursorIcon'
import { SITE_CONFIG } from '@/config/site'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: SITE_CONFIG.themeColor
      }}
    >
      <svg width={108} height={108} viewBox='0 0 24 24' fill='white' aria-hidden='true'>
        <path d={CURSOR_ICON_PATH} />
      </svg>
    </div>,
    size
  )
}
