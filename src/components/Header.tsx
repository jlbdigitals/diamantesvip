'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()
  const isAgeVerified = typeof document !== 'undefined' 
    ? document.cookie.split('; ').some(row => row.startsWith('age-verified='))
    : false

  if (pathname === '/age-verification') {
    return null
  }

  return (
    <header className="bg-black/90 backdrop-blur-sm border-b border-amber-500/30 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-amber-500">
          Diamantes VIP
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-amber-500 transition-colors">
            Inicio
          </Link>
          <Link href="/admin" className="text-gray-300 hover:text-amber-500 transition-colors">
            Panel
          </Link>
        </nav>
      </div>
    </header>
  )
}