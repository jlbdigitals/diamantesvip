'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

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
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
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
    <div className="min-h-screen bg-surface flex items-center justify-center py-12">
      <div className="w-full max-w-lg p-8 glass-card">
        <h1 className="text-3xl font-bold text-accent text-center font-serif mb-8">Diamantes VIP</h1>
        <h2 className="text-xl font-bold text-brand text-center mb-6 font-serif">Crear Cuenta</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-accent/10 border border-accent text-accent px-4 py-2 rounded-none text-center text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Contraseña *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"
                required
                minLength={6}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Nombre real *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Alias (público)</label>
              <input
                type="text"
                name="alias"
                value={formData.alias}
                onChange={handleChange}
                className="w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Edad *</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                className="w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"
                required
                min={18}
                max={99}
              />
            </div>

            <div>
              <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Ciudad *</label>
              <select
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"
              >
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Confirmar contraseña *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-brand hover:bg-brand-hover text-white font-semibold py-3 rounded-none transition-colors disabled:opacity-50 uppercase tracking-wider"
          >
            {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
          </button>
        </form>

        <p className="text-center text-muted mt-6 text-sm">
          ¿Ya tienes cuenta?{' '}
          <a href="/admin/login" className="text-accent hover:text-accent-hover font-medium">
            Iniciar Sesión
          </a>
        </p>
      </div>
    </div>
  )
}
