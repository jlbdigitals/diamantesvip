'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface EscortData {
  id: string
  name: string
  alias: string | null
  age: number
  city: string
  description: string | null
  services: string | null
  phone: string | null
  whatsapp: string | null
}

export default function ProfileEditor() {
  const router = useRouter()
  const [formData, setFormData] = useState<EscortData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      fetchEscort()
    }
  }, [])

  const fetchEscort = async () => {
    try {
      const res = await fetch('/api/admin/escort')
      const data = await res.json()
      if (data.escort) {
        setFormData(data.escort)
      }
    } catch (error) {
      console.error('Error fetching escort:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)
    setMessage('')

    try {
      const res = await fetch('/api/admin/escort', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        setMessage('Perfil actualizado correctamente')
      } else {
        setMessage(data.error || 'Error al guardar')
      }
    } catch (error) {
      setMessage('Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const cities = ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'Antofagasta', 'La Serena']
  const servicesList = ['Acompañamiento', 'Masaje', 'Actividades', 'Viajes', 'Eventos', 'Parejas']

  if (!formData) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link href="/admin" className="text-amber-500 hover:text-amber-400 mb-6 inline-block">
          ← Volver al panel
        </Link>
        
        <h1 className="text-3xl font-bold text-white mb-6">Editar Perfil</h1>

        {message && (
          <div className={`mb-6 px-4 py-2 rounded-lg text-center ${message.includes('Error') ? 'bg-red-500/10 border border-red-500 text-red-500' : 'bg-green-500/10 border border-green-500 text-green-500'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Nombre real *</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Alias (público)</label>
              <input
                type="text"
                name="alias"
                value={formData.alias || ''}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Edad *</label>
              <input
                type="number"
                name="age"
                value={formData.age || ''}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
                required
                min={18}
                max={99}
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">Ciudad *</label>
              <select
                name="city"
                value={formData.city || ''}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Descripción</label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={4}
              className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
              placeholder="Cuéntas sobre ti..."
            />
          </div>

          <div>
            <label className="block text-gray-400 mb-2">Servicios (selecciona)</label>
            <div className="flex flex-wrap gap-2">
              {servicesList.map(service => (
                <label key={service} className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-lg cursor-pointer hover:bg-zinc-700">
                  <input
                    type="checkbox"
                    name="services"
                    value={service}
                    defaultChecked={formData.services?.includes(service)}
                    className="accent-amber-500"
                  />
                  <span className="text-sm">{service}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Teléfono</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone || ''}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
                placeholder="+56 9 XXXX XXXX"
              />
            </div>

            <div>
              <label className="block text-gray-400 mb-2">WhatsApp</label>
              <input
                type="tel"
                name="whatsapp"
                value={formData.whatsapp || ''}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
                placeholder="+56 9 XXXX XXXX"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}