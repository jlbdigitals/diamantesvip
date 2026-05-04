import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import EscortProfilePage from '@/components/EscortProfile'

export const dynamic = 'force-dynamic'

async function getEscort(id: string) {
  const escort = await prisma.escort.findUnique({
    where: { id, active: true },
    include: {
      photos: { orderBy: { order: 'asc' } },
      videos: { orderBy: { order: 'asc' } },
      reviews: { orderBy: { createdAt: 'desc' } },
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

  return <EscortProfilePage escort={escort} />
}
