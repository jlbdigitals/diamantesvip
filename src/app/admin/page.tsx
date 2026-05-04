'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function AdminDashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    const userData = localStorage.getItem('user')
    if (!token || !userData) {
      router.push('/admin/login')
      return
    }
    setUser(JSON.parse(userData))
  }, [router])

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  const isAdmin = user.role === 'admin'

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="animate-in">
        <h1 className="text-3xl font-bold text-brand font-serif italic mb-1">
          {isAdmin ? 'Panel de Administración' : 'Mi Panel'}
        </h1>
        <p className="text-muted-light text-sm uppercase tracking-[0.06em] mb-10">
          {isAdmin
            ? 'Gestiona perfiles y contenido del sitio'
            : `Bienvenida, ${user.name || user.email} — administra tu perfil`}
        </p>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 stagger">
          <Link href="/admin/escorts" className="glass-float rounded-sm p-7 group hover:border-accent/30 transition-all duration-400 hover:-translate-y-1">
            <div className="w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-brand font-serif mb-1.5 group-hover:text-accent transition-colors">Escorts</h2>
            <p className="text-muted-light text-sm">Gestiona perfiles, verificaciones y destacados.</p>
          </Link>
          <div className="glass-float rounded-sm p-7">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="text-lg font-bold text-brand font-serif mb-1.5">Estadísticas</h2>
            <p className="text-muted-light text-sm mb-4">Visitas, contactos y métricas del sitio.</p>
            <span className="text-[10px] text-muted-light uppercase tracking-[0.12em]">Próximamente</span>
          </div>
          <div className="glass-float rounded-sm p-7">
            <div className="text-4xl mb-4">⚙️</div>
            <h2 className="text-lg font-bold text-brand font-serif mb-1.5">Configuración</h2>
            <p className="text-muted-light text-sm mb-4">Ajustes generales del sitio.</p>
            <span className="text-[10px] text-muted-light uppercase tracking-[0.12em]">Próximamente</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 stagger">
          <Link href="/admin/profile" className="glass-float rounded-sm p-7 group hover:border-accent/30 transition-all duration-400 hover:-translate-y-1">
            <div className="w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-brand font-serif mb-1.5 group-hover:text-accent transition-colors">Editar Perfil</h2>
            <p className="text-muted-light text-sm">Nombre, alias, descripción, servicios, medidas, horarios.</p>
          </Link>

          <Link href="/admin/photos" className="glass-float rounded-sm p-7 group hover:border-accent/30 transition-all duration-400 hover:-translate-y-1">
            <div className="w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-brand font-serif mb-1.5 group-hover:text-accent transition-colors">Fotos y Videos</h2>
            <p className="text-muted-light text-sm">Sube hasta 8 fotos. Selecciona tu foto principal.</p>
          </Link>

          <Link href="/admin/membresia" className="glass-float rounded-sm p-7 group hover:border-accent/30 transition-all duration-400 hover:-translate-y-1">
            <div className="w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-brand font-serif mb-1.5 group-hover:text-accent transition-colors">Membresía</h2>
            <p className="text-muted-light text-sm">Administra tu suscripción y pagos mensuales.</p>
          </Link>

          <Link href="/admin/historias" className="glass-luxe rounded-sm p-7 group hover:border-accent/40 transition-all duration-400 hover:-translate-y-1 glow-pulse">
            <div className="w-10 h-10 bg-accent rounded-sm flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-brand font-serif mb-1.5 group-hover:text-accent transition-colors">Historias</h2>
            <p className="text-muted-light text-sm">Sube fotos y videos que desaparecen en 24h. Lo más visto del sitio.</p>
          </Link>

          <div className="glass-float rounded-sm p-7 group hover:border-accent/30 transition-all duration-400 hover:-translate-y-1">
            <div className="w-10 h-10 bg-accent/10 rounded-sm flex items-center justify-center text-accent mb-4 group-hover:bg-accent group-hover:text-white transition-all duration-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-bold text-brand font-serif mb-1.5 group-hover:text-accent transition-colors">Vista Previa</h2>
            <p className="text-muted-light text-sm">Así ven tu perfil los clientes. Revisa que todo esté correcto.</p>
          </div>
        </div>
      )}

      {/* Quick actions */}
      <div className="mt-12 pt-8 border-t border-border/40">
        <h2 className="text-xs font-semibold text-muted-light uppercase tracking-[0.12em] mb-5">Acciones rápidas</h2>
        <div className="flex flex-wrap gap-3">
          {!isAdmin && (
            <>
              <Link href="/admin/profile" className="bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-sm text-xs uppercase tracking-[0.1em] transition-all hover:shadow-lg hover:shadow-accent/20">
                Editar perfil
              </Link>
              <Link href="/admin/photos" className="glass text-brand font-semibold px-5 py-2.5 rounded-sm text-xs uppercase tracking-[0.1em] transition-all hover:border-accent/40">
                Subir fotos
              </Link>
              <Link href="/admin/historias" className="bg-accent hover:bg-accent-hover text-white font-semibold px-5 py-2.5 rounded-sm text-xs uppercase tracking-[0.1em] transition-all hover:shadow-lg hover:shadow-accent/20 glow-pulse">
                Subir historias
              </Link>
            </>
          )}
          <Link href="/" className="glass text-muted hover:text-brand font-medium px-5 py-2.5 rounded-sm text-xs transition-all">
            ← Volver al sitio
          </Link>
        </div>
      </div>
    </div>
  )
}
