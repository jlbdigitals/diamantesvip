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

      {/* Overlay suave */}
      <div className="absolute inset-0 bg-[#1f0f16]/28" />

      {/* Ventana tipo age verification */}
      <div className="relative w-full max-w-[520px] rounded-[52px] bg-[#e9a1b2]/95 backdrop-blur-[2px] shadow-[0_24px_70px_rgba(60,24,38,0.35)] px-8 py-12 md:px-12 md:py-14">
        <div className="flex flex-col items-center justify-between min-h-[520px] md:min-h-[600px]">
          <Image
            src="/logo-cuadrado.jpeg"
            alt="Diamantes VIP"
            width={360}
            height={360}
            className="w-full max-w-[360px] h-auto rounded-[28px]"
            priority
          />

          <p
            className="text-center text-white/95 text-4xl md:text-5xl italic tracking-wide"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            PRONTO...
          </p>
        </div>
      </div>
    </div>
  )
}
