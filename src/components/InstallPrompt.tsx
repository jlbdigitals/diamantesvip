'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallPrompt() {
  const [showPrompt, setShowPrompt] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsStandalone(true)
      return
    }

    // Check if previously dismissed this session
    if (sessionStorage.getItem('pwa-prompt-dismissed')) {
      setDismissed(true)
      return
    }

    // Register service worker
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').catch(() => {
        // SW registration failed silently
      })
    }

    // Listen for beforeinstallprompt event
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      // Show prompt after 3 seconds on the site
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handler)

    // Also show a generic prompt on iOS/Safari (which doesn't support beforeinstallprompt)
    const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())
    const isSafari = /safari/.test(navigator.userAgent.toLowerCase()) && !/chrome/.test(navigator.userAgent.toLowerCase())

    if (isIOS && isSafari && !isStandalone) {
      setTimeout(() => setShowPrompt(true), 4000)
    }

    // Show prompt after delay even without the event (manual banner)
    const timer = setTimeout(() => {
      if (!deferredPrompt && !isStandalone && !dismissed) {
        setShowPrompt(true)
      }
    }, 5000)

    return () => {
      window.removeEventListener('beforeinstallprompt', handler)
      clearTimeout(timer)
    }
  }, [])

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const result = await deferredPrompt.userChoice
      setShowPrompt(false)
      if (result.outcome === 'accepted') {
        setIsStandalone(true)
      }
    } else {
      // Fallback for browsers without beforeinstallprompt (iOS)
      setShowPrompt(false)
      setDismissed(true)
      sessionStorage.setItem('pwa-prompt-dismissed', 'true')
    }
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    setDismissed(true)
    sessionStorage.setItem('pwa-prompt-dismissed', 'true')
  }

  if (!showPrompt || isStandalone || dismissed) return null

  const isIOS = /iphone|ipad|ipod/.test(navigator.userAgent.toLowerCase())

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[100] p-4 animate-in">
      <div className="glass-luxe rounded-xl p-4 max-w-md mx-auto shadow-2xl">
        {/* iOS instructions */}
        {isIOS && !deferredPrompt ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Image src="/favicon.jpeg" alt="Diamantes VIP" width={40} height={40} className="w-10 h-10 rounded-xl" />
              <span className="text-brand font-bold font-serif text-lg">Diamantes VIP</span>
            </div>
            <p className="text-muted-light text-xs mb-3 leading-relaxed">
              Instala esta app en tu pantalla de inicio para acceso rápido.
            </p>
            <div className="flex items-center justify-center gap-1.5 text-xs text-muted-light mb-4">
              <span>Toca</span>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 1.5A2.25 2.25 0 0012 6a2.25 2.25 0 000-4.5zM12 6v4.5M12 6l3.75 2.25M12 6L8.25 8.25M12 10.5a3 3 0 013 3v4.5a3 3 0 01-6 0v-4.5a3 3 0 013-3z"/>
              </svg>
              <span>y luego &quot;Agregar a inicio&quot;</span>
            </div>
            <button
              onClick={handleDismiss}
              className="text-muted-light hover:text-brand text-xs underline underline-offset-4 transition-colors"
            >
              Entendido
            </button>
          </div>
        ) : (
          /* Android/Chrome install prompt */
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
              <Image src="/favicon.jpeg" alt="Diamantes VIP" width={48} height={48} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-brand font-bold text-sm font-serif">Diamantes VIP</p>
              <p className="text-muted-light text-xs">Instalar en pantalla de inicio</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleInstall}
                className="text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-[0.08em] transition-all"
                style={{ backgroundColor: '#f9dade', color: '#727272' }}
              >
                Instalar
              </button>
              <button
                onClick={handleDismiss}
                className="text-muted-light hover:text-brand p-1 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
