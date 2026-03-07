import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import { compare, hash } from "bcryptjs";
import { loginSchema } from "@/lib/validations";
import { createLogger } from "@/lib/logger";

const logger = createLogger('nextauth')

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        try {
          const validated = loginSchema.parse({
            email: credentials?.email,
            password: credentials?.password
          })

          const user = await prisma.user.findUnique({
            where: { email: validated.email }
          })

          if (!user || !user.password) {
            logger.warn({ email: validated.email }, 'User not found or no password')
            return null
          }

          const isValid = await compare(validated.password, user.password)
          if (!isValid) {
            logger.warn({ email: validated.email }, 'Invalid password')
            return null
          }

          logger.info({ userId: user.id }, 'User authenticated')
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role
          }
        } catch (error) {
          logger.error(error, 'Auth error')
          return null
        }
      }
    })
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role;
        token.id = user.id;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as any).role = token.role;
      }
      return session;
    }
  },

  pages: {
    signIn: '/login',
    error: '/login',
  }
});

export async function getCurrentSession() {
  const session = await auth();

  if (!session || !session.user) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name ?? null,
      role: (session.user as any).role ?? "user"
    }
  };
}

export async function hashPassword(password: string): Promise<string> {
  return hash(password, 10)
}
