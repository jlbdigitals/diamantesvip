'use client'

import { useState, useEffect } from 'react'

export default function AgeVerificationPage() {
  const [verified, setVerified] = useState(false)
  const [underage, setUnderage] = useState(false)

  useEffect(() => {
    const ageVerified = document.cookie
      .split('; ')
      .find(row => row.startsWith('age-verified='))
      ?.split('=')[1]
    
    if (ageVerified === 'true') {
      window.location.href = '/'
    }
  }, [])

  const handleVerify = () => {
    document.cookie = 'age-verified=true; path=/; max-age=31536000'
    setVerified(true)
    setTimeout(() => {
      window.location.href = '/'
    }, 500)
  }

  const handleUnderage = () => {
    setUnderage(true)
  }

  const backgroundVideo = (
    <>
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ filter: 'brightness(0.4) saturate(1.2) contrast(1.1)' }}
      >
        <source src="/videos/video1.mp4" type="video/mp4" />
      </video>
      <div className="absolute inset-0 bg-brand/50" />
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/10 via-transparent to-transparent" />
    </>
  )

  if (underage) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
        {backgroundVideo}
        <div className="relative z-10 text-center p-8">
          <h1 className="text-4xl font-bold text-accent font-serif mb-4">Acceso Bloqueado</h1>
          <p className="text-muted text-lg">Debes tener 18 años o más para acceder a este sitio.</p>
        </div>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
        {backgroundVideo}
        <div className="relative z-10 text-center p-8">
          <h1 className="text-4xl font-bold text-accent font-serif mb-4">Bienvenido</h1>
          <p className="text-muted">Redireccionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center relative overflow-hidden">
      {backgroundVideo}
      <div className="relative z-10 glass-card text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold text-brand font-serif mb-4">Diamantes VIP</h1>
        <p className="text-muted text-lg mb-8">Este sitio contiene contenido para adultos.</p>
        
        <button
          onClick={handleVerify}
          className="block w-full py-3 px-6 bg-brand hover:bg-brand-hover text-white font-semibold rounded-none mb-4 transition-colors uppercase tracking-wider text-sm"
        >
          Soy mayor de 18 años
        </button>
        
        <button
          onClick={handleUnderage}
          className="text-muted-light hover:text-muted transition-colors text-sm underline underline-offset-4"
        >
          Soy menor de 18 años
        </button>
      </div>
    </div>
  )
}
