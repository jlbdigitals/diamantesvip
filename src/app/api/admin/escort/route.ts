import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const escort = await prisma.escort.findUnique({
      where: { userId: decoded.id },
    })

    return NextResponse.json({ escort })
  } catch (error) {
    console.error('Error fetching escort:', error)
    return NextResponse.json({ error: 'Error al obtener datos' }, { status: 500 })
  }
}

export async function PUT(request: Request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const body = await request.json()
    const {
      name, alias, age, city, description, phone, whatsapp,
      nationality, height, weight, measurements, bodyType,
      hairColor, eyeColor, bustSize, buttSize, waxing,
      tattoos, piercings, languages, atHome, hotels,
      homeService, price, availability,
    } = body

    const escort = await prisma.escort.update({
      where: { userId: decoded.id },
      data: {
        name,
        alias: alias || null,
        age: parseInt(age),
        city,
        description: description || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        nationality: nationality || null,
        height: height ? parseInt(height) : null,
        weight: weight ? parseInt(weight) : null,
        measurements: measurements || null,
        bodyType: bodyType || null,
        hairColor: hairColor || null,
        eyeColor: eyeColor || null,
        bustSize: bustSize || null,
        buttSize: buttSize || null,
        waxing: waxing || null,
        tattoos: tattoos || false,
        piercings: piercings || false,
        languages: languages || null,
        atHome: atHome || false,
        hotels: hotels || false,
        homeService: homeService || false,
        price: price ? parseInt(price) : null,
        availability: availability || null,
      },
    })

    return NextResponse.json({ success: true, escort })
  } catch (error) {
    console.error('Error updating escort:', error)
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }
}
