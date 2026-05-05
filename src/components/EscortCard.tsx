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
    tier: string
  }
}

const TIER_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  VIP: { bg: '#db7581', text: '#ffffff', label: 'VIP' },
  Gold: { bg: '#c5a059', text: '#ffffff', label: 'Gold' },
  Silver: { bg: '#8c8484', text: '#ffffff', label: 'Silver' },
}

export function EscortCard({ escort }: EscortCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const tierStyle = TIER_STYLES[escort.tier] || TIER_STYLES.Silver

  return (
    <Link
      href={`/escort/${escort.id}`}
      className="group block glass-float rounded-sm overflow-hidden"
    >
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

        <div className="absolute inset-0 bg-gradient-to-t from-brand/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Tier badge */}
        <div className="absolute top-3 left-3 z-10">
          <span
            className="text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-[0.12em]"
            style={{ backgroundColor: tierStyle.bg, color: tierStyle.text }}
          >
            {tierStyle.label}
          </span>
        </div>

        {/* Price badge */}
        {escort.price && (
          <div className="absolute top-3 right-3 z-10">
            <div className="glass-strong text-accent text-xs font-bold px-3 py-1.5 rounded-sm shadow-lg group-hover:scale-105 transition-transform duration-400">
              {formatPrice(escort.price)}
            </div>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-brand group-hover:text-accent transition-colors font-serif capitalize">
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
