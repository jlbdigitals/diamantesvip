import { NextResponse } from 'next/server'
import { authenticateUser, createToken } from '@/lib/auth'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json({ error: 'Email y contraseña requeridos' }, { status: 400 })
    }

    const user = await authenticateUser(email, password)
    
    if (!user) {
      return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })
    }

    const token = createToken({ id: user.id, email: user.email, role: user.role })

    return NextResponse.json({ 
      success: true, 
      token, 
      user: { id: user.id, email: user.email, role: user.role, name: user.name } 
    })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json({ error: 'Error al iniciar sesión' }, { status: 500 })
  }
}