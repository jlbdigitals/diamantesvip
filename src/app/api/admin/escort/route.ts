import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const escort = await prisma.escort.findFirst()
  return NextResponse.json({ escort })
}

export async function PUT(request: Request) {
  const body = await request.json()
  const { name, alias, age, city, description, phone, whatsapp } = body

  try {
    const escort = await prisma.escort.update({
      where: { id: body.id },
      data: {
        name, alias: alias || null, age: parseInt(age), city, description: description || null,
        phone: phone || null, whatsapp: whatsapp || null,
      },
    })
    return NextResponse.json({ success: true, escort })
  } catch (error) {
    console.error('Error updating escort:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}