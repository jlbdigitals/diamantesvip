'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Photo {
  id: string
  url: string
  order: number
}

interface Video {
  id: string
  url: string
  thumbnail: string | null
  order: number
}

interface Review {
  id: string
  author: string
  rating: number
  comment: string
  createdAt: Date
}

interface EscortProfile {
  id: string
  name: string
  alias: string | null
  age: number
  city: string
  description: string | null
  services: string | null
  phone: string | null
  whatsapp: string | null
  featured: boolean
  mainPhoto: string | null
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
  verified: boolean
  photos: Photo[]
  videos: Video[]
  reviews: Review[]
}

export default function EscortProfilePage({ escort }: { escort: EscortProfile }) {
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const services = escort.services ? JSON.parse(escort.services) : []
  const languages = escort.languages ? JSON.parse(escort.languages) : []
  const availability = escort.availability ? JSON.parse(escort.availability) : null
  const avgRating = escort.reviews.length > 0
    ? (escort.reviews.reduce((sum, r) => sum + r.rating, 0) / escort.reviews.length).toFixed(1)
    : '0'

  const allMedia = [
    ...(escort.mainPhoto ? [{ type: 'photo' as const, url: escort.mainPhoto }] : []),
    ...escort.videos.map((v) => ({ type: 'video' as const, url: v.url, thumbnail: v.thumbnail || v.url })),
    ...escort.photos.map((p) => ({ type: 'photo' as const, url: p.url })),
  ]

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setLightboxOpen(true)
  }

  const nextImage = () => setLightboxIndex((prev) => (prev + 1) % allMedia.length)
  const prevImage = () => setLightboxIndex((prev) => (prev - 1 + allMedia.length) % allMedia.length)

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const daysMap: Record<string, string> = {
    LUN: 'Lunes', MAR: 'Martes', MIE: 'Miércoles',
    JUE: 'Jueves', VIE: 'Viernes', SAB: 'Sábado', DOM: 'Domingo',
  }

  return (
    <div className="min-h-screen bg-surface">
      {/* Breadcrumb */}
      <div className="glass-strong">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center gap-2 text-xs md:text-sm">
          <Link href="/" className="text-accent hover:text-accent-hover transition-colors">
            Inicio
          </Link>
          <span className="text-border">/</span>
          <span className="text-muted-light hidden sm:inline">Escorts VIP</span>
          <span className="text-border hidden sm:inline">/</span>
          <span className="text-brand font-medium truncate">{escort.alias || escort.name}</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Name & badges */}
        <div className="mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold text-brand font-serif lowercase tracking-tight">
              {escort.alias || escort.name}
            </h1>
            {escort.verified && (
              <div className="flex items-center gap-1.5 bg-accent/10 border border-accent/30 text-accent px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Verificada
              </div>
            )}
            {escort.featured && (
              <div className="flex items-center gap-1.5 bg-brand/5 border border-brand/20 text-brand px-3 py-1.5 rounded-full text-xs md:text-sm font-medium">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                VIP
              </div>
            )}
          </div>
          {/* Price highlight */}
          {escort.price && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xl md:text-2xl font-bold text-accent font-serif">{formatPrice(escort.price)}</span>
              <span className="text-xs text-muted-light uppercase tracking-wider">/ 1 hora</span>
            </div>
          )}
        </div>

        {/* Quick info */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
          {escort.atHome && (
            <div className="flex items-center gap-2.5 glass-card bg-surface-alt/50 px-3 md:px-4 py-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <div>
                <div className="text-xs text-muted-light">Depto</div>
                <div className="text-sm font-medium text-brand">Propio</div>
              </div>
            </div>
          )}
          {escort.price && (
            <div className="flex items-center gap-2.5 glass-card bg-surface-alt/50 px-3 md:px-4 py-3">
              <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <div className="text-xs text-muted-light">Valor 1H</div>
                <div className="text-sm font-medium text-accent">{formatPrice(escort.price)}</div>
              </div>
            </div>
          )}
          <div className="flex items-center gap-2.5 glass-card bg-surface-alt/50 px-3 md:px-4 py-3">
            <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <div>
              <div className="text-xs text-muted-light">Ubicación</div>
              <div className="text-sm font-medium text-brand">{escort.city}</div>
            </div>
          </div>
          <div className="flex items-center gap-2.5 glass-card bg-surface-alt/50 px-3 md:px-4 py-3">
            <svg className="w-5 h-5 text-accent flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <div className="text-xs text-muted-light">Disponibilidad</div>
              <div className="text-sm font-medium text-brand">{availability ? 'Ver horarios' : 'Consultar'}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Left column — Main photo + stats */}
          <div className="lg:col-span-1">
            <div
              className="relative aspect-[3/4] bg-surface-container rounded-[24px] overflow-hidden cursor-pointer group"
              onClick={() => openLightbox(0)}
            >
              {escort.mainPhoto && escort.mainPhoto.startsWith('http') ? (
                <Image
                  src={escort.mainPhoto}
                  alt={escort.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl text-surface-dim">💎</span>
                </div>
              )}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
              <div className="absolute bottom-4 right-4 glass-strong text-brand px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                </svg>
                Ampliar
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-2">
              {escort.nationality && (
                <div className="glass-card px-3 py-2 text-center rounded-xl">
                  <div className="text-xs text-muted-light">Nacionalidad</div>
                  <div className="text-sm font-medium text-accent">{escort.nationality}</div>
                </div>
              )}
              <div className="glass-card px-3 py-2 text-center rounded-xl">
                <div className="text-xs text-muted-light">Edad</div>
                <div className="text-sm font-medium text-accent">{escort.age} años</div>
              </div>
              {escort.height && (
                <div className="glass-card px-3 py-2 text-center rounded-xl">
                  <div className="text-xs text-muted-light">Altura</div>
                  <div className="text-sm font-medium text-accent">{escort.height} cm</div>
                </div>
              )}
              {escort.weight && (
                <div className="glass-card px-3 py-2 text-center rounded-xl">
                  <div className="text-xs text-muted-light">Peso</div>
                  <div className="text-sm font-medium text-accent">{escort.weight} kg</div>
                </div>
              )}
              {escort.measurements && (
                <div className="glass-card px-3 py-2 text-center rounded-xl col-span-2 sm:col-span-1">
                  <div className="text-xs text-muted-light">Medidas</div>
                  <div className="text-sm font-medium text-accent">{escort.measurements} cm</div>
                </div>
              )}
            </div>

            {availability && (
              <div className="mt-6">
                <h3 className="text-lg font-bold text-brand mb-3 font-serif flex items-center gap-2">
                  <svg className="w-5 h-5 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Mis Horarios
                </h3>
                <p className="text-xs text-muted-light mb-3">La disponibilidad es relativa, recuerda siempre confirmar.</p>
                <div className="space-y-1.5">
                  {Object.entries(availability).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center glass-card px-3 py-2 rounded-xl">
                      <span className="text-xs font-medium text-muted uppercase">{daysMap[day] || day}</span>
                      <span className="text-sm text-brand">{hours as string}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right column — Description, Contact, Services */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {escort.description && (
              <div className="glass-card bg-surface-alt/50 border border-border rounded-[24px] p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-brand mb-4 font-serif">Sobre Mí</h2>
                <p className="text-muted leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {escort.description}
                </p>
              </div>
            )}

            {/* Contact */}
            <div className="glass-card border border-border rounded-[24px] p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand mb-4 font-serif">Contacto</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {escort.whatsapp && (
                  <a
                    href={`https://wa.me/${escort.whatsapp.replace(/\D/g, '')}?text=Hola!%20Te%20acabo%20de%20ver%20en%20Diamantes%20VIP`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 text-white font-bold py-3.5 px-4 rounded-xl transition-all hover:scale-[1.02]"
                    style={{ backgroundColor: '#db7581' }}
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.008-.57-.008-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                    WhatsApp
                  </a>
                )}
                {escort.phone && (
                  <a
                    href={`tel:${escort.phone}`}
                    className="flex items-center justify-center gap-2 font-bold py-3.5 px-4 rounded-xl transition-all hover:scale-[1.02] border-2"
                    style={{ borderColor: '#db7581', color: '#db7581' }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {escort.phone}
                  </a>
                )}
              </div>
            </div>

            {/* Reviews */}
            {escort.reviews.length > 0 && (
              <div className="glass-card bg-surface-alt/50 border border-border rounded-[24px] p-4 md:p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-bold text-brand font-serif flex items-center gap-2">
                    <svg className="w-5 h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Opiniones
                  </h2>
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          className={`w-4 h-4 ${parseFloat(avgRating) >= star ? 'text-accent' : 'text-border'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-accent font-bold">{avgRating}</span>
                    <span className="text-muted-light text-sm">({escort.reviews.length})</span>
                  </div>
                </div>
                <div className="space-y-4">
                  {escort.reviews.slice(0, 3).map((review) => (
                    <div key={review.id} className="glass-overlay border border-border rounded-xl p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-brand">{review.author}</span>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-3.5 h-3.5 ${review.rating >= star ? 'text-accent' : 'text-border'}`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-muted">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {services.length > 0 && (
              <div className="glass-card bg-surface-alt/50 border border-border rounded-[24px] p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-bold text-brand mb-4 font-serif">Mis Servicios</h2>
                <div className="flex flex-wrap gap-2">
                  {services.map((service: string, i: number) => (
                    <span
                      key={i}
                      className="bg-surface-container text-muted px-3 md:px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-default border border-border"
                    >
                      {service}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-muted-light mt-3">Algunos servicios podrían tener un costo adicional.</p>
              </div>
            )}

            {/* Attributes */}
            <div className="glass-card border border-border rounded-[24px] p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand mb-4 font-serif">Mis Atributos</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  escort.nationality,
                  escort.bodyType,
                  escort.hairColor,
                  escort.eyeColor,
                  escort.bustSize && `Busto ${escort.bustSize}`,
                  escort.buttSize && `Cola ${escort.buttSize}`,
                  escort.waxing && `Depilación ${escort.waxing}`,
                  escort.tattoos && 'Tatuada',
                  escort.piercings && 'Piercings',
                  escort.atHome && 'Depto propio',
                  escort.hotels && 'Hoteles',
                  escort.homeService && 'Domicilio',
                  ...languages,
                ].filter(Boolean).map((attr, i) => (
                  <span
                    key={i}
                    className="bg-surface text-muted px-3 py-1.5 rounded-xl text-sm border border-border"
                  >
                    {attr}
                  </span>
                ))}
              </div>
            </div>

            {/* Share */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: `${escort.alias || escort.name} — Diamantes VIP`,
                      url: window.location.href,
                    })
                  } else {
                    navigator.clipboard.writeText(window.location.href)
                    alert('Link copiado al portapapeles')
                  }
                }}
                className="flex items-center gap-2 text-muted hover:text-accent transition-colors text-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Compartir perfil
              </button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        {allMedia.length > 0 && (
          <div className="mt-8 md:mt-10">
            <div className="glass-card border border-border rounded-[24px] p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-bold text-brand mb-4 font-serif">Mis Fotos & Videos</h2>
              {escort.verified && (
                <p className="text-xs text-muted-light mb-4">
                  {escort.alias || escort.name} ha sido entrevistada personalmente, sus fotografías están levemente retocadas.
                </p>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {allMedia.slice(1).map((media, idx) => (
                  <div
                    key={idx}
                    className="relative aspect-[3/4] bg-surface-container rounded-[16px] overflow-hidden border border-border cursor-pointer group"
                    onClick={() => openLightbox(idx + 1)}
                  >
                    {media.type === 'video' && (
                      <>
                        <Image
                          src={media.thumbnail}
                          alt={`Video ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
                          <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-accent/90 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                            <svg className="w-5 h-5 md:w-6 md:h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                        <div className="absolute top-2 left-2 glass-strong text-brand text-xs px-2 py-1 rounded-full flex items-center gap-1">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                          Video
                        </div>
                      </>
                    )}
                    {media.type === 'photo' && (
                      <>
                        <Image
                          src={media.url}
                          alt={`Foto ${idx + 1}`}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                          <svg className="w-6 h-6 md:w-8 md:h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 z-50 glass-dark flex items-center justify-center"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-20"
            onClick={(e) => { e.stopPropagation(); setLightboxOpen(false) }}
          >
            <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {allMedia.length > 1 && (
            <>
              <button
                className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 glass-dark text-white/80 hover:text-white p-1.5 md:p-2 rounded-full z-20"
                onClick={(e) => { e.stopPropagation(); prevImage() }}
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 glass-dark text-white/80 hover:text-white p-1.5 md:p-2 rounded-full z-20"
                onClick={(e) => { e.stopPropagation(); nextImage() }}
              >
                <svg className="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          <div
            className="relative w-full max-w-4xl h-[70vh] md:h-[80vh] mx-2 md:mx-4 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {allMedia[lightboxIndex]?.type === 'video' ? (
              <video
                src={allMedia[lightboxIndex].url}
                controls
                autoPlay
                playsInline
                className="max-w-full max-h-[70vh] md:max-h-[80vh] rounded-xl"
              />
            ) : (
              <Image
                src={allMedia[lightboxIndex]?.url || ''}
                alt={`${escort.name} ${lightboxIndex + 1}`}
                fill
                className="object-contain"
                priority
              />
            )}
          </div>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 text-white/60 text-sm flex items-center gap-2 z-20">
            {allMedia[lightboxIndex]?.type === 'video' && (
              <span className="bg-accent/30 text-white text-xs px-2 py-0.5 rounded-full">Video</span>
            )}
            {lightboxIndex + 1} / {allMedia.length}
          </div>
        </div>
      )}
    </div>
  )
}
