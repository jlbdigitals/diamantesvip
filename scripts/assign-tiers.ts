import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const escorts = await prisma.escort.findMany({ where: { active: true } })

  // VIP: featured + price >= 200000 or alias contains "VIP" or "Luxe"
  const vip = escorts.filter(e =>
    e.alias?.includes('VIP') || e.alias?.includes('Luxe') ||
    (e.featured && (e.price ?? 0) >= 200000)
  )

  // Gold: featured or price >= 150000, not already VIP
  const gold = escorts.filter(e =>
    !vip.includes(e) &&
    (e.featured || (e.price ?? 0) >= 150000)
  )

  // Silver: the rest
  const silver = escorts.filter(e => !vip.includes(e) && !gold.includes(e))

  for (const e of vip) await prisma.escort.update({ where: { id: e.id }, data: { tier: 'VIP' } })
  for (const e of gold) await prisma.escort.update({ where: { id: e.id }, data: { tier: 'Gold' } })
  for (const e of silver) await prisma.escort.update({ where: { id: e.id }, data: { tier: 'Silver' } })

  console.log(`VIP: ${vip.length}, Gold: ${gold.length}, Silver: ${silver.length}`)
  console.log('Tiers asignados!')
}

main().catch(console.error).finally(() => prisma.$disconnect())
