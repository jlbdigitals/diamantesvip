import Link from 'next/link'

export function Footer() {
  return (
    <footer className="glass-strong border-t border-border/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center gap-10">
          {/* Brand */}
          <div className="flex flex-col items-center">
            <img
              src="/logo-cuadrado.jpeg"
              alt="Diamantes VIP"
              className="h-24 w-auto mb-4 rounded-xl"
            />
            <p className="text-muted text-sm leading-relaxed max-w-xs">
              El directorio de acompañantes más exclusivo de Chile. Conectamos personas exigentes con experiencias únicas.
            </p>
          </div>

          {/* Menus — 2 sections centered */}
          <div className="flex flex-col sm:flex-row gap-10 sm:gap-20">
            {/* Explora */}
            <div className="flex flex-col items-center">
              <h4 className="text-brand font-semibold mb-3 uppercase tracking-wider text-sm">Explora</h4>
              <nav className="flex flex-col items-center gap-2">
                <Link href="/" className="text-muted hover:text-accent text-sm transition-colors">
                  Inicio
                </Link>
                <Link href="/anunciate" className="text-muted hover:text-accent text-sm transition-colors">
                  Anúnciate
                </Link>
                <Link href="/admin" className="text-muted hover:text-accent text-sm transition-colors">
                  Panel
                </Link>
                <a href="https://wa.me/56932508878" target="_blank" rel="noopener noreferrer" className="text-muted hover:text-accent text-sm transition-colors">
                  Contacto
                </a>
              </nav>
            </div>

            {/* Legal */}
            <div className="flex flex-col items-center">
              <h4 className="text-brand font-semibold mb-3 uppercase tracking-wider text-sm">Legal</h4>
              <nav className="flex flex-col items-center gap-2">
                <span className="text-muted-light text-sm">Solo para mayores de 18 años</span>
                <span className="text-muted-light text-sm">Todas las modelos son verificadas</span>
                <span className="text-muted text-sm">&copy; {new Date().getFullYear()} Diamantes VIP</span>
              </nav>
            </div>
          </div>

          {/* Disclaimer */}
          <div className="pt-6 border-t border-border w-full max-w-lg">
            <p className="text-muted-light text-xs">
              Diamantes VIP no interfiere en los acuerdos entre las partes. Todo servicio es entre adultos consintientes.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
