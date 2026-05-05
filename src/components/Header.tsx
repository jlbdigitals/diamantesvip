'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'

export function Header() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  // Lock body scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  if (pathname === '/age-verification') {
    return null
  }

  const navLinks = [
    { key: 'inicio', href: '/', label: 'Inicio' },
    { key: 'vip', href: '#', label: 'Diamantes Vip' },
    { key: 'gold', href: '#', label: 'Diamantes Gold' },
    { key: 'silver', href: '#', label: 'Diamantes Silver' },
    { key: 'anunciate', href: '/anunciate', label: 'Anúnciate' },
    { key: 'contacto', href: 'https://wa.me/56932508878', label: 'Contáctanos', external: true },
  ]

  return (
    <>
      <header className="glass-edge sticky top-0 z-50">
        {/* Top edge gradient accent */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/logo-extendido.jpeg"
              alt="Diamantes VIP"
              className="h-16 w-auto"
            />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 font-medium text-xs tracking-[0.1em] uppercase">
            {navLinks.map((link) =>
              link.external ? (
                <a
                  key={link.key}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-light hover:text-brand transition-colors duration-300"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.key}
                  href={link.href}
                  className="text-muted-light hover:text-brand transition-colors duration-300"
                >
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden relative z-50 flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            aria-label="Toggle menu"
          >
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                menuOpen ? 'rotate-45 translate-y-2 bg-brand' : 'bg-[#db7581]'
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                menuOpen ? 'opacity-0 bg-brand' : 'bg-[#db7581]'
              }`}
            />
            <span
              className={`block w-6 h-0.5 transition-all duration-300 ${
                menuOpen ? '-rotate-45 -translate-y-2 bg-brand' : 'bg-[#db7581]'
              }`}
            />
          </button>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <div
        className={`md:hidden fixed inset-0 z-40 transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-brand/20 backdrop-blur-sm"
          onClick={() => setMenuOpen(false)}
        />

        {/* Drawer panel */}
        <div
          className={`absolute top-0 right-0 h-full w-[80%] max-w-[320px] bg-[#f9f9f9] shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Decorative top accent */}
          <div className="h-1 w-full bg-gradient-to-r from-[#f9dade] via-[#db7581] to-accent" />

          <div className="flex flex-col h-full p-8 pt-16">
            {/* Close button */}
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white shadow-sm text-[#727272] hover:text-brand transition-colors"
              aria-label="Cerrar menú"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Logo */}
            <div className="mb-10">
              <img
                src="/logo-cuadrado.jpeg"
                alt="Diamantes VIP"
                className="h-16 w-auto rounded-xl"
              />
            </div>

            {/* Navigation */}
            <nav className="flex flex-col gap-1">
              {navLinks.map((link, index) =>
                link.external ? (
                  <a
                    key={link.key}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center py-3.5 px-4 rounded-xl text-[#727272] hover:text-brand hover:bg-[#f9dade]/60 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-base font-medium tracking-wide">{link.label}</span>
                    <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity text-[#db7581]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                ) : (
                  <Link
                    key={link.key}
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className="group flex items-center py-3.5 px-4 rounded-xl text-[#727272] hover:text-brand hover:bg-[#f9dade]/60 transition-all duration-300"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <span className="text-base font-medium tracking-wide">{link.label}</span>
                    <svg className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#db7581]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                )
              )}
            </nav>

            {/* Bottom accent */}
            <div className="mt-auto pt-8">
              <div className="w-12 h-1 rounded-full bg-[#f9dade] mx-auto" />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
