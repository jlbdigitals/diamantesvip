import Link from 'next/link'
import Image from 'next/image'

interface EscortCardProps {
  escort: {
    id: string
    name: string
    alias: string | null
    age: number
    city: string
    mainPhoto: string | null
    featured: boolean
    price: number | null
    nationality: string | null
    verified: boolean
  }
}

export function EscortCard({ escort }: EscortCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(price)
  }

  return (
    <Link
      href={`/escort/${escort.id}`}
      className="group block glass-float rounded-sm overflow-hidden"
    >
      {/* Image */}
      <div className="aspect-[3/4] relative bg-surface-container overflow-hidden">
        {escort.mainPhoto && escort.mainPhoto.startsWith('http') ? (
          <Image
            src={escort.mainPhoto}
            alt={escort.name}
            fill
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl text-surface-dim">💎</span>
          </div>
        )}

        {/* Image overlay gradient on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-brand/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* VIP Badge — VS-style glass label */}
        {escort.featured && (
          <div className="absolute top-3 left-3 z-10">
            <div className="glass-strong text-brand text-[10px] font-semibold px-2.5 py-1 rounded-sm uppercase tracking-[0.12em] group-hover:bg-accent group-hover:text-white group-hover:border-accent transition-all duration-400">
              <span className="flex items-center gap-1">
                <svg className="w-2.5 h-2.5 group-hover:animate-spin" fill="currentColor" viewBox="0 0 20 20" style={{ animationDuration: '3s' }}>
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                VIP
              </span>
            </div>
          </div>
        )}

        {/* Price badge — VS-style */}
        {escort.price && (
          <div className="absolute top-3 right-3 z-10">
            <div className="glass-strong text-accent text-xs font-bold px-3 py-1.5 rounded-sm shadow-lg group-hover:scale-105 transition-transform duration-400">
              {formatPrice(escort.price)}
            </div>
          </div>
        )}
      </div>

      {/* Info — minimal VS-style */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-brand group-hover:text-accent transition-colors font-serif italic tracking-[0.02em]">
          {escort.alias || escort.name}
        </h3>
        <div className="flex items-center gap-2 text-xs text-muted-light mt-1">
          <span>{escort.city}</span>
          <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
          <span>{escort.age} años</span>
          {escort.nationality && (
            <>
              <span className="w-1 h-1 bg-accent/30 rounded-full"></span>
              <span className="text-accent">{escort.nationality}</span>
            </>
          )}
        </div>
        {/* Price highlight below info */}
        {escort.price && (
          <div className="mt-2 text-accent font-bold text-base font-serif">
            {formatPrice(escort.price)}
            <span className="text-muted-light text-[10px] font-sans ml-1 uppercase tracking-wider">/ 1h</span>
          </div>
        )}
      </div>
    </Link>
  )
}
