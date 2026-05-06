'use client'

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<any>(null)
  const [escortId, setEscortId] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token || !userData) {
      router.push('/admin/login')
      return
    }
    const parsed = JSON.parse(userData)
    setUser(parsed)
    fetchEscortId(token)
  }, [router])

  const fetchEscortId = async (token: string) => {
    try {
      const res = await fetch('/api/admin/escort', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.escort?.id) setEscortId(data.escort.id)
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/admin/login')
  }

  if (pathname === '/admin/login' || pathname === '/admin/register') {
    return <>{children}</>
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  const isAdmin = user.role === 'admin'

  return (
    <div className="min-h-screen relative">
      {/* Atmospheric bg */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-accent/3 rounded-full blur-[150px]" />
      </div>

      <header className="glass-edge sticky top-0 z-50">
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 flex-shrink-0">
            <Link href="/admin" className="text-xl font-bold text-brand font-serif tracking-tight whitespace-nowrap">
              Panel<span className="text-accent font-light">VIP</span>
            </Link>
            <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-semibold uppercase tracking-[0.12em] flex-shrink-0 ${isAdmin ? 'bg-brand text-white' : 'bg-accent text-white'}`}>
              {isAdmin ? 'Admin' : 'Escort'}
            </span>
          </div>

          <div className="flex items-center gap-4 min-w-0">
            <nav className="flex items-center gap-5 text-xs font-medium tracking-[0.08em] uppercase overflow-x-auto scrollbar-hide flex-nowrap -mx-1 px-1">
              <Link href="/admin" className="text-muted-light hover:text-brand transition-colors duration-300 whitespace-nowrap">
                Panel
              </Link>
              {isAdmin && (
                <Link href="/admin/escorts" className="text-muted-light hover:text-brand transition-colors duration-300 whitespace-nowrap">
                  Escorts
                </Link>
              )}
              {!isAdmin && (
                <>
                  <Link href="/admin/profile" className="text-muted-light hover:text-brand transition-colors duration-300 whitespace-nowrap">
                    Perfil
                  </Link>
                  <Link href="/admin/photos" className="text-muted-light hover:text-brand transition-colors duration-300 whitespace-nowrap">
                    Fotos
                  </Link>
                  <Link href="/admin/membresia" className="text-muted-light hover:text-brand transition-colors duration-300 whitespace-nowrap">
                    Membresía
                  </Link>
                  <Link href="/admin/historias" className="text-muted-light hover:text-brand transition-colors duration-300 whitespace-nowrap">
                    Historias
                  </Link>
                </>
              )}
              {escortId && (
                <a href={`/escort/${escortId}`} target="_blank" className="text-accent/70 hover:text-accent transition-colors duration-300 whitespace-nowrap">
                  Perfil público ↗
                </a>
              )}
            </nav>
            <button onClick={handleLogout} className="text-muted-light hover:text-accent transition-colors duration-300 text-xs tracking-[0.08em] uppercase flex-shrink-0">
              Salir
            </button>
          </div>
        </div>
      </header>

      <div className="relative">{children}</div>
    </div>
  )
}
