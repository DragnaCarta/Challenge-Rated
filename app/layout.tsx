import React from 'react'
import type { Metadata } from 'next'

import Footer from './ui/footer'
import Header from './ui/header'

import './globals.css'

export const metadata: Metadata = {
  title: `ChallengeRated - Encounter Building Tool`,
  description:
    'An encounter-building tool for determining combat difficulty in Dungeons & Dragons 5th Edition Based on the Challenge Ratings 2.0 system developed by DragnaCarta.',

  openGraph: {
    title: `ChallengeRated - Encounter Building Tool`,
    description: '',
    url: 'https://challengerated.com',
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <section
          className="grid relative bg-neutral"
          style={{ gridTemplateRows: 'auto 1fr auto', minHeight: '100vh' }}
        >
          <Header />
          <main>{children}</main>
          <Footer className="mt-auto" />
        </section>
      </body>
    </html>
  )
}
