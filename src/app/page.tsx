import { prisma } from '@/lib/prisma'
import { EscortCard } from '@/components/EscortCard'

export const dynamic = 'force-dynamic'

const CITIES = ['Santiago', 'Valparaíso', 'Viña del Mar', 'Concepción', ' Antofagasta', 'La Serena'] as const

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ city?: string; ageMin?: string; ageMax?: string; service?: string }>
}) {
  const params = await searchParams
  
  const where: any = { active: true }
  
  if (params.city) {
    where.city = params.city
  }
  
  if (params.ageMin || params.ageMax) {
    where.age = {}
    if (params.ageMin) where.age.gte = parseInt(params.ageMin)
    if (params.ageMax) where.age.lte = parseInt(params.ageMax)
  }

  const escorts = await prisma.escort.findMany({
    where,
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      alias: true,
      age: true,
      city: true,
      mainPhoto: true,
      featured: true,
    },
  })

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-amber-500 mb-2">Diamantes VIP</h1>
          <p className="text-gray-400">Acompañantes exclusivas en Chile</p>
        </div>

        <div className="mb-8 p-4 bg-zinc-900 rounded-xl border border-amber-500/20">
          <form className="flex flex-wrap gap-4">
            <select 
              name="city"
              defaultValue={params.city || ''}
              className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
            >
              <option value="">Todas las ciudades</option>
              {CITIES.map(city => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
            
            <select 
              name="ageMin"
              defaultValue={params.ageMin || ''}
              className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
            >
              <option value="">Edad mínima</option>
              <option value="18">18</option>
              <option value="21">21</option>
              <option value="25">25</option>
              <option value="30">30</option>
            </select>
            
            <select 
              name="ageMax"
              defaultValue={params.ageMax || ''}
              className="bg-zinc-800 text-white px-4 py-2 rounded-lg border border-zinc-700 focus:border-amber-500 outline-none"
            >
              <option value="">Edad máxima</option>
              <option value="25">25</option>
              <option value="30">30</option>
              <option value="35">35</option>
              <option value="40">40</option>
            </select>
            
            <button 
              type="submit"
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold px-6 py-2 rounded-lg transition-colors"
            >
              Filtrar
            </button>
          </form>
        </div>

        {escorts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-2xl text-gray-500">No hay escort disponibles</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {escorts.map((escort: { id: string; name: string; alias: string | null; age: number; city: string; mainPhoto: string | null; featured: boolean }) => (
              <EscortCard key={escort.id} escort={escort} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}