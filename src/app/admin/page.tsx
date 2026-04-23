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
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-500 mb-2">Panel de Administración</h1>
        <p className="text-gray-400 mb-8">Bienvenido, {user.name || user.email}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            href="/admin/profile"
            className="block p-6 bg-zinc-900 rounded-xl border border-amber-500/20 hover:border-amber-500 transition-colors"
          >
            <div className="text-4xl mb-3">👤</div>
            <h2 className="text-xl font-bold text-white mb-2">Editar Perfil</h2>
            <p className="text-gray-400 text-sm">Actualiza tu información pública</p>
          </Link>

          <Link
            href="/admin/photos"
            className="block p-6 bg-zinc-900 rounded-xl border border-amber-500/20 hover:border-amber-500 transition-colors"
          >
            <div className="text-4xl mb-3">📸</div>
            <h2 className="text-xl font-bold text-white mb-2">Fotos</h2>
            <p className="text-gray-400 text-sm">Sube fotos para tu galería</p>
          </Link>

          <a
            href="/"
            className="block p-6 bg-zinc-900 rounded-xl border border-amber-500/20 hover:border-amber-500 transition-colors"
          >
            <div className="text-4xl mb-3">🏠</div>
            <h2 className="text-xl font-bold text-white mb-2">Ver Mi Perfil</h2>
            <p className="text-gray-400 text-sm">Cómo te ven los clientes</p>
          </a>
        </div>
      </div>
    </div>
  )
}