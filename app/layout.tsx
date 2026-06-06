import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Qnsult — Portfolio Intelligence',
  description: 'AI-powered consulting intelligence. 12 agents running continuously against every client account.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
