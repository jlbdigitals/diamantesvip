import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function getEscort(id: string) {
  const escort = await prisma.escort.findUnique({
    where: { id, active: true },
    include: {
      photos: { orderBy: { order: 'asc' } },
    },
  })
  return escort
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const escort = await getEscort(id)

  if (!escort) {
    notFound()
  }

  const services = escort.services ? JSON.parse(escort.services) : []

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link 
          href="/" 
          className="inline-flex items-center text-amber-500 hover:text-amber-400 mb-6 transition-colors"
        >
          ← Volver al listado
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <div className="relative aspect-[3/4] bg-zinc-900 rounded-xl overflow-hidden border border-amber-500/20">
              {escort.mainPhoto ? (
                <Image 
                  src={escort.mainPhoto} 
                  alt={escort.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-9xl text-zinc-700">💎</span>
                </div>
              )}
            </div>

            {escort.photos.length > 0 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-2">
                {escort.photos.map((photo: { id: string; url: string }) => (
                  <div key={photo.id} className="relative w-20 h-20 flex-shrink-0 bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800">
                    <Image 
                      src={photo.url} 
                      alt=""
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-white">
                  {escort.alias || escort.name}
                </h1>
                {escort.alias && (
                  <p className="text-gray-400">{escort.name}</p>
                )}
              </div>
              {escort.featured && (
                <span className="bg-amber-500 text-black text-sm font-bold px-3 py-1 rounded-full flex items-center gap-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Destacada
                </span>
              )}
            </div>

            <div className="flex gap-4 text-gray-400 mb-6">
              <span>{escort.city}</span>
              <span className="w-1 h-5 bg-zinc-700"></span>
              <span>{escort.age} a��os</span>
            </div>

            {escort.description && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-amber-500 mb-2">Descripción</h2>
                <p className="text-gray-300 leading-relaxed">{escort.description}</p>
              </div>
            )}

            {services.length > 0 && (
              <div className="mb-6">
                <h2 className="text-lg font-bold text-amber-500 mb-2">Servicios</h2>
                <div className="flex flex-wrap gap-2">
                  {services.map((service: string, i: number) => (
                    <span 
                      key={i} 
                      className="bg-zinc-800 text-gray-300 px-3 py-1 rounded-full text-sm"
                    >
                      {service}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t border-zinc-800 pt-6">
              <h2 className="text-lg font-bold text-amber-500 mb-4">Contacto</h2>
              <div className="space-y-3">
                {escort.whatsapp && (
                  <a
                    href={`https://wa.me/${escort.whatsapp.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                  >
                    WhatsApp
                  </a>
                )}
                {escort.phone && (
                  <a
                    href={`tel:${escort.phone}`}
                    className="block w-full bg-zinc-800 hover:bg-zinc-700 text-white font-bold py-3 px-4 rounded-lg text-center transition-colors"
                  >
                    {escort.phone}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}