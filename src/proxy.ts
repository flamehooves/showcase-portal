import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Static export does not run middleware — auth is enforced client-side in that mode.

const PROTECTED_PATHS = [
  '/projects/new',
  '/my-projects',
  '/admin',
]

function isProtectedPath(pathname: string): boolean {
  // /projects/new
  if (PROTECTED_PATHS.includes(pathname)) return true

  // /admin and sub-paths
  if (pathname.startsWith('/admin')) return true

  // /my-projects and sub-paths
  if (pathname.startsWith('/my-projects')) return true

  // /projects/*/edit
  const editPattern = /^\/projects\/[^/]+\/edit(\/.*)?$/
  if (editPattern.test(pathname)) return true

  return false
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (!isProtectedPath(pathname)) {
    return NextResponse.next()
  }

  // Zustand persist stores auth state in the cookie named 'showcase-auth'
  const authCookie = request.cookies.get('showcase-auth')

  if (!authCookie?.value) {
    const signinUrl = new URL('/signin', request.url)
    signinUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(signinUrl)
  }

  try {
    const decoded = decodeURIComponent(authCookie.value)
    const state = JSON.parse(decoded) as {
      state?: { isAuthenticated?: boolean }
    }
    if (!state?.state?.isAuthenticated) {
      const signinUrl = new URL('/signin', request.url)
      signinUrl.searchParams.set('from', pathname)
      return NextResponse.redirect(signinUrl)
    }
  } catch {
    const signinUrl = new URL('/signin', request.url)
    signinUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(signinUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api/).*)',
  ],
}
