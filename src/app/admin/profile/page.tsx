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
  nationality: string | null
  height: number | null
  weight: number | null
  measurements: string | null
  bodyType: string | null
  hairColor: string | null
  eyeColor: string | null
  bustSize: string | null
  buttSize: string | null
  waxing: string | null
  tattoos: boolean
  piercings: boolean
  languages: string | null
  atHome: boolean
  hotels: boolean
  homeService: boolean
  price: number | null
  availability: string | null
}

const CITIES = ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', 'Antofagasta', 'La Serena']
const servicesList = ['Acompañamiento', 'Masaje', 'Cenas', 'Viajes', 'Eventos', 'Actividades', 'Besos', 'Oral', 'Parejas']
const bodyTypes = ['Delgada', 'Atlética', 'Curvy', 'Voluptuosa']
const hairColors = ['Rubio', 'Castaño', 'Negro', 'Rojo', 'Platinado']
const eyeColors = ['Azules', 'Verdes', 'Cafés', 'Negros', 'Grises']
const sizes = ['Pequeño', 'Mediano', 'Grande']
const waxingTypes = ['Full', 'Parcial', 'Natural']
const languagesList = ['Español', 'Inglés', 'Portugués', 'Francés', 'Italiano']

export default function ProfileEditor() {
  const router = useRouter()
  const [formData, setFormData] = useState<EscortData | null>(null)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedServices, setSelectedServices] = useState<string[]>([])
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
    }
  }, [router])

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      fetchEscort(token)
    }
  }, [])

  const fetchEscort = async (token: string) => {
    try {
      const res = await fetch('/api/admin/escort', {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (data.escort) {
        setFormData(data.escort)
        setSelectedServices(data.escort.services ? JSON.parse(data.escort.services) : [])
        setSelectedLanguages(data.escort.languages ? JSON.parse(data.escort.languages) : [])
      }
    } catch (error) {
      console.error('Error fetching escort:', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (!formData) return
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData({ ...formData, [name]: checked })
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  const handleServiceToggle = (service: string) => {
    setSelectedServices(prev =>
      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
    )
  }

  const handleLanguageToggle = (lang: string) => {
    setSelectedLanguages(prev =>
      prev.includes(lang) ? prev.filter(l => l !== lang) : [...prev, lang]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData) return

    setSaving(true)
    setMessage('')

    const token = localStorage.getItem('token')
    if (!token) {
      setMessage('Error: Sesión expirada')
      setSaving(false)
      return
    }

    try {
      const res = await fetch('/api/admin/escort', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          services: JSON.stringify(selectedServices),
          languages: JSON.stringify(selectedLanguages),
        }),
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

  if (!formData) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center">
        <div className="text-accent">Cargando...</div>
      </div>
    )
  }

  const inputClass = "w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"
  const selectClass = "w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors"

  return (
    <div className="min-h-screen bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin" className="text-accent hover:text-accent-hover mb-6 inline-block text-sm">
          ← Volver al panel
        </Link>

        <h1 className="text-3xl font-bold text-brand mb-6 font-serif">Editar Perfil</h1>

        {message && (
          <div className={`mb-6 px-4 py-2 rounded-none text-center text-sm ${message.includes('Error') ? 'bg-accent/10 border border-accent text-accent' : 'bg-accent/5 border border-border text-accent'}`}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Datos básicos */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-accent mb-4 font-serif">Datos Básicos</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Nombre real *</label>
                <input type="text" name="name" value={formData.name || ''} onChange={handleChange} className={inputClass} required />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Alias (público)</label>
                <input type="text" name="alias" value={formData.alias || ''} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Edad *</label>
                <input type="number" name="age" value={formData.age || ''} onChange={handleChange} className={inputClass} required min={18} max={99} />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Ciudad *</label>
                <select name="city" value={formData.city || ''} onChange={handleChange} className={selectClass}>
                  {CITIES.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Físico */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-accent mb-4 font-serif">Apariencia Física</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Nacionalidad</label>
                <input type="text" name="nationality" value={formData.nationality || ''} onChange={handleChange} className={inputClass} placeholder="Chilena" />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Altura (cm)</label>
                <input type="number" name="height" value={formData.height || ''} onChange={handleChange} className={inputClass} placeholder="170" />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Peso (kg)</label>
                <input type="number" name="weight" value={formData.weight || ''} onChange={handleChange} className={inputClass} placeholder="55" />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Medidas (cm)</label>
                <input type="text" name="measurements" value={formData.measurements || ''} onChange={handleChange} className={inputClass} placeholder="90-60-90" />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Contextura</label>
                <select name="bodyType" value={formData.bodyType || ''} onChange={handleChange} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {bodyTypes.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Color de cabello</label>
                <select name="hairColor" value={formData.hairColor || ''} onChange={handleChange} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {hairColors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Color de ojos</label>
                <select name="eyeColor" value={formData.eyeColor || ''} onChange={handleChange} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {eyeColors.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Tamaño busto</label>
                <select name="bustSize" value={formData.bustSize || ''} onChange={handleChange} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Tamaño cola</label>
                <select name="buttSize" value={formData.buttSize || ''} onChange={handleChange} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {sizes.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Depilación</label>
                <select name="waxing" value={formData.waxing || ''} onChange={handleChange} className={selectClass}>
                  <option value="">Seleccionar</option>
                  {waxingTypes.map(w => <option key={w} value={w}>{w}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="tattoos" checked={formData.tattoos} onChange={handleChange} className="w-5 h-5 accent-accent" />
                <label className="text-muted text-sm">Tatuajes</label>
              </div>
              <div className="flex items-center gap-3">
                <input type="checkbox" name="piercings" checked={formData.piercings} onChange={handleChange} className="w-5 h-5 accent-accent" />
                <label className="text-muted text-sm">Piercings</label>
              </div>
            </div>
          </div>

          {/* Servicios */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-accent mb-4 font-serif">Servicios</h2>
            <div className="flex flex-wrap gap-2">
              {servicesList.map(service => (
                <label key={service} className={`flex items-center gap-2 px-3 py-2 rounded-none cursor-pointer transition-colors text-sm ${selectedServices.includes(service) ? 'bg-rose/30 border border-accent/30 text-accent' : 'bg-surface border border-border text-muted hover:bg-surface-container'}`}>
                  <input type="checkbox" checked={selectedServices.includes(service)} onChange={() => handleServiceToggle(service)} className="hidden" />
                  <span>{service}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Idiomas */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-accent mb-4 font-serif">Idiomas</h2>
            <div className="flex flex-wrap gap-2">
              {languagesList.map(lang => (
                <label key={lang} className={`flex items-center gap-2 px-3 py-2 rounded-none cursor-pointer transition-colors text-sm ${selectedLanguages.includes(lang) ? 'bg-rose/30 border border-accent/30 text-accent' : 'bg-surface border border-border text-muted hover:bg-surface-container'}`}>
                  <input type="checkbox" checked={selectedLanguages.includes(lang)} onChange={() => handleLanguageToggle(lang)} className="hidden" />
                  <span>{lang}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Atención */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-accent mb-4 font-serif">Lugar de Atención</h2>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-3">
                <input type="checkbox" name="atHome" checked={formData.atHome} onChange={handleChange} className="w-5 h-5 accent-accent" />
                <span className="text-muted text-sm">Depto propio</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" name="hotels" checked={formData.hotels} onChange={handleChange} className="w-5 h-5 accent-accent" />
                <span className="text-muted text-sm">Hoteles</span>
              </label>
              <label className="flex items-center gap-3">
                <input type="checkbox" name="homeService" checked={formData.homeService} onChange={handleChange} className="w-5 h-5 accent-accent" />
                <span className="text-muted text-sm">Domicilio</span>
              </label>
            </div>
          </div>

          {/* Precio y contacto */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-accent mb-4 font-serif">Precio y Contacto</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Valor por hora (CLP)</label>
                <input type="number" name="price" value={formData.price || ''} onChange={handleChange} className={inputClass} placeholder="200000" />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">Teléfono</label>
                <input type="tel" name="phone" value={formData.phone || ''} onChange={handleChange} className={inputClass} placeholder="+56 9 XXXX XXXX" />
              </div>
              <div>
                <label className="block text-muted-light mb-2 text-sm uppercase tracking-wider font-semibold">WhatsApp</label>
                <input type="tel" name="whatsapp" value={formData.whatsapp || ''} onChange={handleChange} className={inputClass} placeholder="+56 9 XXXX XXXX" />
              </div>
            </div>
          </div>

          {/* Descripción */}
          <div className="glass-card p-6">
            <h2 className="text-lg font-bold text-accent mb-4 font-serif">Descripción</h2>
            <textarea name="description" value={formData.description || ''} onChange={handleChange} rows={5}
              className="w-full bg-surface-container text-brand px-4 py-3 rounded-none border border-border focus:border-accent outline-none transition-colors resize-y" placeholder="Cuéntanos sobre ti..." />
          </div>

          <button type="submit" disabled={saving}
            className="w-full bg-brand hover:bg-brand-hover text-white font-semibold py-3 rounded-none transition-colors disabled:opacity-50 text-lg uppercase tracking-wider">
            {saving ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
