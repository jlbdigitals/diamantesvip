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
  }
}

export function EscortCard({ escort }: EscortCardProps) {
  return (
    <Link 
      href={`/escort/${escort.id}`}
      className="group relative block bg-zinc-900 rounded-xl overflow-hidden border border-amber-500/20 hover:border-amber-500 transition-all hover:scale-[1.02]"
    >
      {escort.featured && (
        <div className="absolute top-3 right-3 z-10 bg-amber-500 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
          Destacada
        </div>
      )}
      
      <div className="aspect-[3/4] relative bg-zinc-800">
        {escort.mainPhoto ? (
          <Image 
            src={escort.mainPhoto} 
            alt={escort.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl text-zinc-700">💎</span>
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-bold text-white group-hover:text-amber-500 transition-colors">
          {escort.alias || escort.name}
        </h3>
        <div className="flex items-center gap-3 text-sm text-gray-400 mt-1">
          <span>{escort.city}</span>
          <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
          <span>{escort.age} años</span>
        </div>
      </div>
    </Link>
  )
}