'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function Header() {
  const pathname = usePathname()

  if (pathname === '/age-verification') {
    return null
  }

  return (
    <header className="glass-edge sticky top-0 z-50">
      {/* Top edge gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
        <Link href="/" className="flex items-center">
          <img
            src="/logo-extendido.jpeg"
            alt="Diamantes VIP"
            className="h-10 w-auto"
          />
        </Link>

        <nav className="flex items-center gap-6 font-medium text-xs tracking-[0.1em] uppercase">
          <Link href="/" className="text-muted-light hover:text-brand transition-colors duration-300">
            Inicio
          </Link>
          <Link href="/anunciate" className="text-muted-light hover:text-brand transition-colors duration-300">
            Anunciate
          </Link>
          <Link
            href="/dev-login?role=admin"
            className="text-accent/70 hover:text-accent transition-colors duration-300"
          >
            Admin
          </Link>
          <Link
            href="/dev-login?role=escort"
            className="text-accent/70 hover:text-accent transition-colors duration-300"
          >
            Escort
          </Link>
        </nav>
      </div>
    </header>
  )
}
