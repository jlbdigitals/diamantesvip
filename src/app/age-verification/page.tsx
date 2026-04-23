'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AgeVerificationPage() {
  const router = useRouter()
  const [verified, setVerified] = useState(false)
  const [underage, setUnderage] = useState(false)

  useEffect(() => {
    const ageVerified = document.cookie
      .split('; ')
      .find(row => row.startsWith('age-verified='))
      ?.split('=')[1]
    
    if (ageVerified === 'true') {
      router.push('/')
    }
  }, [router])

  const handleVerify = () => {
    document.cookie = 'age-verified=true; path=/; max-age=31536000'
    setVerified(true)
    setTimeout(() => router.push('/'), 500)
  }

  const handleUnderage = () => {
    setUnderage(true)
  }

  if (underage) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-red-500 mb-4">Acceso Bloqueado</h1>
          <p className="text-gray-400 text-lg">Debes tener 18 años o más para acceder a este sitio.</p>
        </div>
      </div>
    )
  }

  if (verified) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-4xl font-bold text-green-500 mb-4">¡Bienvenido!</h1>
          <p className="text-gray-400">Redireccionando...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-center p-8 max-w-md">
        <h1 className="text-4xl font-bold text-white mb-4">Diamantes VIP</h1>
        <p className="text-gray-400 text-lg mb-8">Este sitio contiene contenido para adultos.</p>
        
        <button
          onClick={handleVerify}
          className="block w-full py-3 px-6 bg-amber-500 hover:bg-amber-600 text-black font-bold rounded-lg mb-4 transition-colors"
        >
          Soy mayor de 18 años
        </button>
        
        <button
          onClick={handleUnderage}
          className="text-gray-500 hover:text-gray-400 transition-colors"
        >
          Soy menor de 18 años
        </button>
      </div>
    </div>
  )
}