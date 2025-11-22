import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'GC React DB',
  description: 'Next.js + Tailwind CSS + Prisma + Postgres scaffold',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
