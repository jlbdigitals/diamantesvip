'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { hash } from 'bcryptjs'

export default function RegisterPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    alias: '',
    age: '',
    city: 'Santiago',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden')
      return
    }

    if (parseInt(formData.age) < 18) {
      setError('Debes tener al menos 18 años')
      return
    }

    setLoading(true)

    try {
      const hashedPassword = await hash(formData.password, 10)

      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: hashedPassword,
          name: formData.name,
          alias: formData.alias,
          age: parseInt(formData.age),
          city: formData.city,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Error al registrar')
      }

      router.push('/admin/login?registered=true')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const cities = ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'Antofagasta', 'La Serena']

  return (
    <div className="min-h-screen bg-black flex items-center justify-center py-12">
      <div className="w-full max-w-lg p-8">
        <h1 className="text-3xl font-bold text-amber-500 text-center mb-8">Diamantes VIP</h1>
        <h2 className="text-xl font-bold text-white text-center mb-6">Crear Cuenta</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2"> Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-400 mb-2">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 mb-2">Nombre real *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
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
                value={formData.alias}
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
                value={formData.age}
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
                value={formData.city}
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
            <label className="block text-gray-400 mb-2">Confirmar contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-zinc-800 text-white px-4 py-3 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-3 rounded-lg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>
        
        <p className="text-center text-gray-400 mt-6">
          ¿Ya tienes cuenta?{' '}
          <a href="/admin/login" className="text-amber-500 hover:text-amber-400">
            Iniciar Sesión
          </a>
        </p>
      </div>
    </div>
  )
}