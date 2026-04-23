import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'

export async function GET() {
  const photos = await prisma.photo.findMany({ orderBy: { order: 'asc' } })
  return NextResponse.json({ photos })
}

export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File

  if (!file) {
    return NextResponse.json({ error: 'No se encontró archivo' }, { status: 400 })
  }

  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadDir = join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${file.name.replace(/\s/g, '-')}`
    const filepath = join(uploadDir, filename)
    await writeFile(filepath, buffer)

    const photo = await prisma.photo.create({
      data: { url: `/uploads/${filename}`, order: 0, escortId: '' }
    })

    return NextResponse.json({ success: true, photo })
  } catch (error) {
    console.error('Error uploading photo:', error)
    return NextResponse.json({ error: 'Error al subir foto' }, { status: 500 })
  }
}