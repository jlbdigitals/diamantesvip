'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'

interface Photo {
  id: string
  url: string
  order: number
}

const MAX_PHOTOS = 8

export default function PhotoManager() {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [uploading, setUploading] = useState(false)
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    fetchPhotos().then(() => setLoading(false))
  }, [router])

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/admin/photos')
      const data = await res.json()
      if (data.photos) {
        setPhotos(data.photos)
      }
    } catch (error) {
      console.error('Error fetching photos:', error)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    if (photos.length >= MAX_PHOTOS) {
      setMessage(`Máximo ${MAX_PHOTOS} fotos permitidas`)
      return
    }

    setUploading(true)
    setMessage('')

    const file = files[0]
    const formData = new FormData()
    formData.append('file', file)

    try {
      const res = await fetch('/api/admin/photos', {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (res.ok) {
        setPhotos([...photos, data.photo])
        setMessage('Foto subida correctamente')
      } else {
        setMessage(data.error || 'Error al subir foto')
      }
    } catch (error) {
      setMessage('Error al subir foto')
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleDelete = async (photoId: string) => {
    try {
      const res = await fetch(`/api/admin/photos?id=${photoId}`, {
        method: 'DELETE',
      })

      if (res.ok) {
        setPhotos(photos.filter(p => p.id !== photoId))
        setMessage('Foto eliminada')
      } else {
        setMessage('Error al eliminar foto')
      }
    } catch (error) {
      setMessage('Error al eliminar foto')
    }
  }

  const handleSetMain = async (photoId: string) => {
    try {
      const res = await fetch('/api/admin/photos/main', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId }),
      })

      if (res.ok) {
        setMessage('Foto principal actualizada')
        fetchPhotos()
      } else {
        setMessage('Error al actualizar')
      }
    } catch (error) {
      setMessage('Error al actualizar')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500">Cargando...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link href="/admin" className="text-amber-500 hover:text-amber-400 mb-6 inline-block">
          ← Volver al panel
        </Link>

        <h1 className="text-3xl font-bold text-white mb-2">Gestionar Fotos</h1>
        <p className="text-gray-400 mb-6">{photos.length}/{MAX_PHOTOS} fotos</p>

        {message && (
          <div className={`mb-6 px-4 py-2 rounded-lg text-center ${message.includes('Error') ? 'bg-red-500/10 border border-red-500 text-red-500' : 'bg-green-500/10 border border-green-500 text-green-500'}`}>
            {message}
          </div>
        )}

        <div className="mb-8">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleUpload}
            disabled={uploading || photos.length >= MAX_PHOTOS}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || photos.length >= MAX_PHOTOS}
            className="w-full bg-zinc-800 hover:bg-zinc-700 border-2 border-dashed border-zinc-700 hover:border-amber-500 py-8 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Subiendo...' : photos.length >= MAX_PHOTOS 
              ? `Máximo ${MAX_PHOTOS} fotos` 
              : 'Click para subir foto'}
          </button>
        </div>

        {photos.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <div key={photo.id} className="relative aspect-square bg-zinc-900 rounded-xl overflow-hidden group">
                <Image
                  src={photo.url}
                  alt=""
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleSetMain(photo.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-black text-xs font-bold px-3 py-1 rounded"
                  >
                    Principal
                  </button>
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3 py-1 rounded"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            No hay fotos todavía
          </div>
        )}
      </div>
    </div>
  )
}