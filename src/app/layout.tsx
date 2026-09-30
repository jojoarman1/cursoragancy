import type { Metadata, Viewport } from 'next'
import { Geist, IBM_Plex_Mono } from 'next/font/google'

import { CursorFollower } from '@/components/layout/CursorFollower'
import { ZoomLock } from '@/components/layout/ZoomLock'
import { SITE_CONFIG } from '@/config/site'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin', 'cyrillic']
})

const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-ibm-plex-mono',
  weight: ['100', '200', '300', '400', '500', '600', '700'],
  subsets: ['latin', 'cyrillic']
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: SITE_CONFIG.title,
    template: `%s — ${SITE_CONFIG.name}`
  },
  description: SITE_CONFIG.description,
  applicationName: SITE_CONFIG.name,
  openGraph: {
    type: 'website',
    locale: SITE_CONFIG.locale,
    siteName: SITE_CONFIG.name,
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_CONFIG.title,
    description: SITE_CONFIG.description
  },
  // No index/follow: it would contradict the noindex Next.js adds to 404 pages
  robots: {
    googleBot: {
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1
    }
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  // The on-screen keyboard shrinks the layout, so fixed panels like the chat stay above it
  interactiveWidget: 'resizes-content',
  themeColor: SITE_CONFIG.themeColor,
  colorScheme: 'dark'
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={SITE_CONFIG.lang}
      className={`${geistSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className='min-h-full flex flex-col'>
        {children}
        <CursorFollower />
        <ZoomLock />
      </body>
    </html>
  )
}
