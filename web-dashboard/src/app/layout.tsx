import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Errika - Modern Project Templates',
  description: 'Generate production-ready projects in seconds. Beautiful templates for Next.js, React, Discord bots, Chrome extensions, and more.',
  keywords: ['project generator', 'templates', 'nextjs', 'react', 'discord bot', 'chrome extension', 'turborepo'],
  authors: [{ name: 'Errika Team' }],
  openGraph: {
    title: 'Errika - Modern Project Templates',
    description: 'Generate production-ready projects in seconds',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} bg-gray-50 dark:bg-gray-900`}>
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}



