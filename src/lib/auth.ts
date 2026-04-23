import { sign, verify } from 'jsonwebtoken'
import { compare } from 'bcryptjs'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.AUTH_SECRET || 'fallback-secret'

export async function hashPassword(password: string): Promise<string> {
  return compare(password, password) as unknown as Promise<string>
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return compare(password, hash)
}

export function createToken(payload: object): string {
  return sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): any {
  try {
    return verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { escort: true }
  })

  if (!user) return null

  const isValid = await verifyPassword(password, user.password)
  if (!isValid) return null

  return {
    id: user.id,
    email: user.email,
    role: user.role,
    name: user.escort?.name
  }
}

export function auth() {
  return null
}