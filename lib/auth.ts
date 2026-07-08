import NextAuth from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@/lib/prisma-adapter'
import { prisma } from '@/lib/db'
import { compare } from 'bcryptjs'
import { z } from 'zod'

const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  pin: z.string().optional(),
  rememberMe: z.boolean().optional(),
})

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8 hours
    updateAge: 60 * 60, // 1 hour
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        pin: { label: 'PIN', type: 'text' },
        rememberMe: { label: 'Remember me', type: 'checkbox' },
      },
      async authorize(credentials) {
        const parsed = credentialsSchema.safeParse(credentials)
        if (!parsed.success) return null

        const { email, password, pin } = parsed.data

        const user = await prisma.user.findUnique({
          where: { email },
          include: { role: true, warehouse: true, tenant: true },
        })

        if (!user || user.status !== 'ACTIVE') return null

        // Check if account is locked
        if (user.lockedAt && user.lockedAt > new Date()) return null

        // Verify password
        const isValid = await compare(password, user.passwordHash)
        if (!isValid) {
          // Increment failed attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedAttempts: { increment: 1 },
              lockedAt: user.failedAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null,
            },
          })
          return null
        }

        // Reset failed attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: { failedAttempts: 0, lockedAt: null, lastLoginAt: new Date() },
        })

        // For mobile PIN login, verify PIN if provided
        if (pin && user.pinHash) {
          const isPinValid = await compare(pin, user.pinHash)
          if (!isPinValid) return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role.name,
          roleId: user.roleId,
          warehouseId: user.warehouseId,
          tenantId: user.tenantId,
          permissions: user.role.permissions,
          mfaEnabled: user.mfaEnabled,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.roleId = user.roleId
        token.warehouseId = user.warehouseId
        token.tenantId = user.tenantId
        token.permissions = user.permissions
        token.mfaEnabled = user.mfaEnabled
      }
      if (trigger === 'update' && session) {
        token.permissions = session.permissions
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.roleId = token.roleId as string
        session.user.warehouseId = token.warehouseId as string
        session.user.tenantId = token.tenantId as string
        session.user.permissions = token.permissions as string[]
        session.user.mfaEnabled = token.mfaEnabled as boolean
      }
      return session
    },
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnLogin = nextUrl.pathname.startsWith('/login')
      const isOnApi = nextUrl.pathname.startsWith('/api')

      if (isOnLogin) {
        if (isLoggedIn) return Response.redirect(new URL('/', nextUrl))
        return true
      }

      if (isOnApi) {
        // API routes handled by middleware
        return true
      }

      return isLoggedIn
    },
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        await prisma.session.deleteMany({
          where: { userId: token.id as string },
        })
      }
    },
  },
  debug: process.env.NODE_ENV === 'development',
})