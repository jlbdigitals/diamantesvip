import Link from 'next/link'

export function Footer() {
  return (
    <footer className="glass-strong border-t border-border/20 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <img
              src="/logo-cuadrado.jpeg"
              alt="Diamantes VIP"
              className="h-16 w-auto mb-3"
            />
            <h3 className="text-accent font-bold text-lg font-serif mb-3">Diamantes VIP</h3>
            <p className="text-muted text-sm leading-relaxed">
              El directorio de acompañantes más exclusivo de Chile. Conectamos personas
              exigentes con experiencias únicas.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-brand font-semibold mb-3 uppercase tracking-wider text-sm">Explora</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/" className="text-muted hover:text-accent text-sm transition-colors">
                Inicio
              </Link>
              <Link href="/anunciate" className="text-muted hover:text-accent text-sm transition-colors">
                Anúnciate
              </Link>
              <Link href="/admin" className="text-muted hover:text-accent text-sm transition-colors">
                Panel
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-brand font-semibold mb-3 uppercase tracking-wider text-sm">Legal</h4>
            <nav className="flex flex-col gap-2">
              <span className="text-muted-light text-sm">
                Solo para mayores de 18 años
              </span>
              <span className="text-muted-light text-sm">
                Todas las modelos son verificadas
              </span>
              <span className="text-muted text-sm">
                &copy; {new Date().getFullYear()} Diamantes VIP
              </span>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-muted-light text-xs">
            Diamantes VIP no interfiere en los acuerdos entre las partes. Todo servicio es entre adultos consintientes.
          </p>
          <p className="text-muted-light text-xs">
            Chile &middot; 2026
          </p>
        </div>
      </div>
    </footer>
  )
}
