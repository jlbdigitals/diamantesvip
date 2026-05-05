import { prisma } from '@/lib/prisma'
import { EscortCard } from '@/components/EscortCard'
import { SearchBar } from '@/components/SearchBar'
import { StoriesRow } from '@/components/StoriesRow'
import { ShortsRow } from '@/components/ShortsRow'

export const dynamic = 'force-dynamic'

interface HomeProps {
  searchParams: Promise<{
    q?: string
    toggles?: string
  }>
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams
  const toggleKeys = params.toggles ? params.toggles.split(',') : []

  const where: Record<string, unknown> = { active: true }
  const conditions: Record<string, unknown>[] = []

  if (params.q) {
    conditions.push({
      OR: [
        { name: { contains: params.q } },
        { alias: { contains: params.q } },
        { city: { contains: params.q } },
        { description: { contains: params.q } },
        { nationality: { contains: params.q } },
        { services: { contains: params.q } },
      ],
    })
  }

  if (toggleKeys.includes('video')) {
    conditions.push({ videos: { some: {} } })
  }
  if (toggleKeys.includes('cara')) {
    conditions.push({ mainPhoto: { not: null } })
  }
  if (toggleKeys.includes('experiencias')) {
    conditions.push({ reviews: { some: {} } })
  }
  if (toggleKeys.includes('disponible')) {
    conditions.push({ availability: { not: null } })
  }
  if (toggleKeys.includes('promocion')) {
    conditions.push({ featured: true })
  }

  if (conditions.length > 0) {
    where.AND = conditions
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
      price: true,
      nationality: true,
      verified: true,
    },
  })

  const shorts = await prisma.video.findMany({
    where: { escort: { active: true } },
    orderBy: { createdAt: 'desc' },
    include: {
      escort: {
        select: { name: true, alias: true, city: true, mainPhoto: true },
      },
    },
    take: 16,
  })

  const storyEscorts = await prisma.escort.findMany({
    where: { active: true, videos: { some: {} } },
    orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
    select: {
      id: true,
      name: true,
      alias: true,
      city: true,
      mainPhoto: true,
      videos: { select: { url: true, thumbnail: true }, orderBy: { order: 'asc' } },
    },
  })

  return (
    <div className="min-h-screen relative">
      {/* Atmospheric background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-surface" />
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-accent/3 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-rose/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-accent-light/4 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
      </div>

      <div className="relative">
        <SearchBar initialQ={params.q || ''} initialToggles={toggleKeys} />

        <StoriesRow escorts={storyEscorts} />

        <div className="max-w-7xl mx-auto px-4 py-12">
          {escorts.length === 0 ? (
            <div className="text-center py-20">
              <div className="glass-card inline-block rounded-sm p-10">
                <p className="text-2xl text-muted-light font-serif italic mb-2">Sin resultados</p>
                <p className="text-muted-light text-sm">Intenta con otros filtros</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 stagger">
              {escorts.map((escort) => (
                <EscortCard key={escort.id} escort={escort} />
              ))}
            </div>
          )}

          <ShortsRow
            shorts={shorts.map((v) => ({
              id: v.id,
              url: v.url,
              thumbnail: v.thumbnail,
              escortName: v.escort.alias || v.escort.name,
              escortCity: v.escort.city,
              escortPhoto: v.escort.mainPhoto,
            }))}
          />
        </div>
      </div>
    </div>
  )
}
