import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth?.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const token = auth.replace('Bearer ', '')
    const payload = verifyToken(token)
    if (!payload) {
      return NextResponse.json({ error: 'Token inválido' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    if (!file) {
      return NextResponse.json({ error: 'Archivo requerido' }, { status: 400 })
    }

    // In a real app, upload to S3/Cloudinary and store URL
    // For now, store as local placeholder
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = buffer.toString('base64')
    const mime = file.type
    const dataUrl = `data:${mime};base64,${base64}`

    // Store as a video entry (stories are just short-lived videos/photos)
    const video = await prisma.video.create({
      data: {
        url: dataUrl,
        escortId: payload.id,
        order: 0,
      },
    })

    return NextResponse.json({ success: true, video })
  } catch (error: any) {
    console.error('Historias upload error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
