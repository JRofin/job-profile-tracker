import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Job Profile Tracker',
  description: 'Job Profile Workflow Tracker with AI-powered management level suggestions',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
          <header className="bg-welocalize-blue text-white shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h1 className="text-xl font-bold">Job Profile Tracker</h1>
                  <span className="text-sm opacity-80">Welocalize</span>
                </div>
                <nav className="flex gap-4">
                  <a href="/" className="hover:underline">Dashboard</a>
                  <a href="/new" className="hover:underline">New Request</a>
                </nav>
              </div>
            </div>
          </header>
          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
