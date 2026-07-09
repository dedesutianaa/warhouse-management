import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const publicPaths = ['/login', '/api/auth', '/api/v1/health', '/_next', '/favicon.ico', '/icon']
const apiPaths = ['/api/v1']

export default auth((req) => {
  const { nextUrl, auth: session } = req
  const isLoggedIn = !!session?.user
  const isApiRoute = nextUrl.pathname.startsWith('/api')
  const isPublicPath = publicPaths.some((path) => nextUrl.pathname.startsWith(path))

  // Allow public paths
  if (isPublicPath) {
    return NextResponse.next()
  }

  // Redirect to login if not authenticated
  if (!isLoggedIn) {
    const loginUrl = new URL('/login', nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', nextUrl.pathname + nextUrl.search)
    return NextResponse.redirect(loginUrl)
  }

  // Check API authorization
  if (isApiRoute) {
    const user = session.user
    const requiredPermissions = getRequiredPermissions(nextUrl.pathname, req.method)

    if (requiredPermissions.length > 0) {
      const hasPermission = requiredPermissions.some((perm) =>
        user.permissions?.includes(perm)
      )

      if (!hasPermission) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        )
      }
    }

    // Add tenant isolation header
    const response = NextResponse.next()
    response.headers.set('x-tenant-id', user.tenantId)
    response.headers.set('x-user-id', user.id)
    response.headers.set('x-role', user.role)
    return response
  }

  // Add security headers for all responses
  const response = NextResponse.next()
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')

  // CSP for non-API routes
  if (!isApiRoute) {
    response.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; frame-ancestors 'none';"
    )
  }

  return response
})

function getRequiredPermissions(pathname: string, method: string): string[] {
  const permissionMap: Record<string, Record<string, string[]>> = {
    '/api/v1/items': {
      GET: ['items:read'],
      POST: ['items:write'],
      PUT: ['items:write'],
      DELETE: ['items:delete'],
    },
    '/api/v1/inventory': {
      GET: ['inventory:read'],
      POST: ['inventory:write'],
      PUT: ['inventory:write'],
    },
    '/api/v1/inventory/move': {
      POST: ['inventory:move'],
    },
    '/api/v1/allocation': {
      POST: ['outbound:allocate'],
    },
    '/api/v1/inbound': {
      GET: ['inbound:read'],
      POST: ['inbound:write'],
    },
    '/api/v1/outbound': {
      GET: ['outbound:read'],
      POST: ['outbound:write'],
    },
    '/api/v1/returns': {
      GET: ['returns:read'],
      POST: ['returns:write'],
    },
    '/api/v1/tasks': {
      GET: ['tasks:read'],
      POST: ['tasks:write'],
    },
    '/api/v1/users': {
      GET: ['users:read'],
      POST: ['users:write'],
    },
    '/api/v1/audit': {
      GET: ['audit:read'],
    },
    '/api/v1/integrations': {
      GET: ['integrations:read'],
      POST: ['integrations:write'],
    },
    '/api/v1/reports': {
      GET: ['reports:read'],
    },
  }

  for (const [path, methods] of Object.entries(permissionMap)) {
    if (pathname.startsWith(path)) {
      return methods[method] || []
    }
  }

  return []
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon|public).*)',
  ],
}