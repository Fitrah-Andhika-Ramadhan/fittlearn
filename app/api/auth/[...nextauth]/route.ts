import NextAuth, { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { checkRateLimit } from "@/lib/rate-limit"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        // Anti Brute-Force Rate Limiting (Max 5 login attempts per minute per IP)
        const ip = req?.headers?.['x-forwarded-for'] || '127.0.0.1'
        const rateLimitResult = checkRateLimit(ip as string, 5, 60000)
        
        if (!rateLimitResult.success) {
          throw new Error("Too many login attempts. Please try again later.")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email }
        })
        
        if (!user) {
          return null
        }
        
        const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)
        
        if (!isPasswordValid) {
          return null
        }
        
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.sub as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
