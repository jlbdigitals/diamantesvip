'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from '@/components/ThemeProvider'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return (
    <button
      onClick={toggle}
      className="relative w-8 h-8 flex items-center justify-center rounded-full hover:bg-accent/10 transition-colors duration-300"
      aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
    >
      {/* Sun icon */}
      <svg
        className={`absolute w-[18px] h-[18px] transition-all duration-300 ${
          theme === 'dark' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
      </svg>
      {/* Moon icon */}
      <svg
        className={`absolute w-[18px] h-[18px] transition-all duration-300 ${
          theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
      </svg>
    </button>
  )
}

export function Header() {
  const pathname = usePathname()

  if (pathname === '/age-verification') {
    return null
  }

  return (
    <header className="glass-edge sticky top-0 z-50 overflow-hidden">
      {/* Video background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.35) saturate(1.2) contrast(1.1)' }}
      >
        <source src="/videos/video2.mp4" type="video/mp4" />
      </video>

      {/* Overlay for depth */}
      <div className="absolute inset-0 bg-brand/40" />

      {/* Top edge gradient accent */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/40 to-transparent z-10" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between">
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
          <ThemeToggle />
        </nav>
      </div>
    </header>
  )
}
