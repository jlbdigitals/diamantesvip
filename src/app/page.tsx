'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'

export default function LandingPage() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        // Autoplay bloqueado
      })
    }
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6">
      {/* Video de fondo */}
      <video
        ref={videoRef}
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/videos/video_age.mp4" type="video/mp4" />
      </video>

      {/* Overlay oscuro */}
      <div className="absolute inset-0 bg-black/50" />

      {/* Contenido centrado */}
      <div className="relative flex flex-col items-center gap-6">
        {/* Logo */}
        <Image
          src="/logo-cuadrado.jpeg"
          alt="Diamantes VIP"
          width={160}
          height={160}
          className="rounded-2xl shadow-2xl"
          priority
        />

        {/* Texto */}
        <p
          className="text-center text-2xl md:text-4xl font-bold font-serif tracking-wide"
          style={{ color: '#f9dade' }}
        >
          Pronto
        </p>
      </div>
    </div>
  )
}
