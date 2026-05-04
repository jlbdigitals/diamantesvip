'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface EscortItem {
  id: string
  name: string
  alias: string | null
  age: number
  city: string
  featured: boolean
  verified: boolean
  active: boolean
  mainPhoto: string | null
  price: number | null
  createdAt: string
  user: { email: string }
  _count: { photos: number; videos: number; reviews: number }
}

export default function EscortsManager() {
  const router = useRouter()
  const [escorts, setEscorts] = useState<EscortItem[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<string | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchEscorts(token)
  }, [router])

  const fetchEscorts = async (token: string) => {
    try {
      const res = await fetch('/api/admin/escorts', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.escorts) setEscorts(data.escorts)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const toggleStatus = async (escortId: string, field: 'featured' | 'verified' | 'active', value: boolean) => {
    setUpdating(escortId)
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/admin/escorts', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ escortId, [field]: value }),
      })
      if (res.ok) {
        setEscorts((prev) =>
          prev.map((e) => (e.id === escortId ? { ...e, [field]: value } : e))
        )
      }
    } catch (err) {
      console.error(err)
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <Link href="/admin" className="text-accent hover:text-accent-hover mb-6 inline-block text-sm transition-colors">
        ← Volver al panel
      </Link>

      <div className="animate-in mb-10">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-brand font-serif italic mb-1">Gestión de Escorts</h1>
            <p className="text-muted-light text-sm uppercase tracking-[0.06em]">
              {escorts.length} perfiles registrados
            </p>
          </div>
          <div className="glass rounded-sm px-4 py-2 text-xs text-muted-light">
            VIP · Verificadas · Activas
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {escorts.map((escort) => (
          <div
            key={escort.id}
            className={`glass-float rounded-sm p-5 flex items-center gap-5 transition-all duration-300 ${
              !escort.active ? 'opacity-50' : ''
            }`}
          >
            {/* Avatar */}
            <div className="w-14 h-14 rounded-sm bg-surface-container overflow-hidden flex-shrink-0 relative">
              {escort.mainPhoto && escort.mainPhoto.startsWith('http') ? (
                <Image src={escort.mainPhoto} alt={escort.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-2xl">💎</div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <h3 className="text-base font-semibold text-brand font-serif">
                  {escort.alias || escort.name}
                </h3>
                <span className="text-xs text-muted-light">({escort.age} años)</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted-light">
                <span>{escort.city}</span>
                <span>·</span>
                <span>{escort.user.email}</span>
                <span>·</span>
                <span>{escort._count.photos} fotos</span>
                <span>·</span>
                <span>{escort._count.videos} videos</span>
                <span>·</span>
                <span>{escort._count.reviews} reseñas</span>
                {escort.price && (
                  <>
                    <span>·</span>
                    <span className="text-accent">
                      ${new Intl.NumberFormat('es-CL').format(escort.price)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Toggles */}
            <div className="flex items-center gap-3 flex-shrink-0">
              <button
                onClick={() => toggleStatus(escort.id, 'featured', !escort.featured)}
                disabled={updating === escort.id}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] transition-all ${
                  escort.featured
                    ? 'bg-brand text-white hover:bg-brand-hover'
                    : 'bg-surface-container text-muted-light hover:bg-surface-dim'
                }`}
              >
                {escort.featured ? '★ VIP' : 'VIP'}
              </button>

              <button
                onClick={() => toggleStatus(escort.id, 'verified', !escort.verified)}
                disabled={updating === escort.id}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] transition-all ${
                  escort.verified
                    ? 'bg-accent text-white hover:bg-accent-hover'
                    : 'bg-surface-container text-muted-light hover:bg-surface-dim'
                }`}
              >
                {escort.verified ? '✓ Verificada' : 'Verificar'}
              </button>

              <button
                onClick={() => toggleStatus(escort.id, 'active', !escort.active)}
                disabled={updating === escort.id}
                className={`px-3 py-1.5 rounded-full text-[10px] font-semibold uppercase tracking-[0.08em] transition-all ${
                  escort.active
                    ? 'bg-surface-container text-muted hover:bg-surface-dim'
                    : 'bg-accent/10 text-accent hover:bg-accent/20'
                }`}
              >
                {escort.active ? 'Activa' : 'Inactiva'}
              </button>

              <Link
                href={`/escort/${escort.id}`}
                target="_blank"
                className="text-muted-light hover:text-accent transition-colors text-xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
