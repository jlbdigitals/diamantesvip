import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  const publicPaths = ['/age-verification', '/api/auth', '/admin/login', '/admin/register']
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

  if (isPublicPath) {
    return NextResponse.next()
  }

  if (pathname.startsWith('/admin')) {
    return NextResponse.next()
  }

  const ageVerified = request.cookies.get('age-verified')?.value

  if (ageVerified !== 'true') {
    return NextResponse.redirect(new URL('/age-verification', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}