import { Adapter } from 'next-auth/adapters'
import { prisma } from '@/lib/db'

export function PrismaAdapter(prismaClient: typeof prisma): Adapter {
  return {
    async createUser(user) {
      return prismaClient.user.create({
        data: {
          email: user.email!,
          name: user.name,
          passwordHash: user.passwordHash || '',
          roleId: user.roleId || 'default',
          tenantId: user.tenantId || 'default',
          emailVerified: user.emailVerified,
        },
      })
    },

    async getUser(id) {
      return prismaClient.user.findUnique({
        where: { id },
        include: { role: true, warehouse: true, tenant: true },
      })
    },

    async getUserByEmail(email) {
      return prismaClient.user.findUnique({
        where: { email },
        include: { role: true, warehouse: true, tenant: true },
      })
    },

    async getUserByAccount({ providerAccountId, provider }) {
      // For credentials provider, we don't use accounts table
      return null
    },

    async updateUser(user) {
      return prismaClient.user.update({
        where: { id: user.id },
        data: {
          name: user.name,
          email: user.email,
          emailVerified: user.emailVerified,
        },
      })
    },

    async deleteUser(id) {
      return prismaClient.user.delete({ where: { id } })
    },

    async linkAccount(account) {
      // Not used for credentials
      return account as any
    },

    async unlinkAccount({ providerAccountId, provider }) {
      // Not used for credentials
      return undefined
    },

    async createSession({ sessionToken, userId, expires }) {
      return prismaClient.session.create({
        data: {
          userId,
          token: sessionToken,
          expiresAt: expires,
        },
      })
    },

    async getSessionAndUser(sessionToken) {
      const session = await prismaClient.session.findUnique({
        where: { token: sessionToken },
        include: {
          user: {
            include: { role: true, warehouse: true, tenant: true },
          },
        },
      })
      if (!session) return null
      if (session.expiresAt < new Date()) {
        await prismaClient.session.delete({ where: { id: session.id } })
        return null
      }
      return { session, user: session.user }
    },

    async updateSession({ sessionToken, ...data }) {
      return prismaClient.session.update({
        where: { token: sessionToken },
        data,
      })
    },

    async deleteSession(sessionToken) {
      await prismaClient.session.delete({ where: { token: sessionToken } })
    },

    async createVerificationToken({ identifier, token, expires }) {
      // Store in user record or separate table
      return { identifier, token, expires }
    },

    async useVerificationToken({ identifier, token }) {
      // Verify and consume token
      return null
    },
  }
}