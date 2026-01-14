/**
 * Authentication utilities
 * 
 * This file is a placeholder for NextAuth.js configuration.
 * Uncomment and configure when you're ready to add authentication.
 */

// import { NextAuthOptions } from 'next-auth';
// import { PrismaAdapter } from '@auth/prisma-adapter';
// import GithubProvider from 'next-auth/providers/github';
// import GoogleProvider from 'next-auth/providers/google';
// import { prisma } from './db';

/**
 * NextAuth configuration
 * 
 * Learn more: https://next-auth.js.org/configuration/options
 */
// export const authOptions: NextAuthOptions = {
//   adapter: PrismaAdapter(prisma),
//   providers: [
//     GithubProvider({
//       clientId: process.env.GITHUB_ID!,
//       clientSecret: process.env.GITHUB_SECRET!,
//     }),
//     GoogleProvider({
//       clientId: process.env.GOOGLE_CLIENT_ID!,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
//     }),
//   ],
//   pages: {
//     signIn: '/auth/signin',
//     error: '/auth/error',
//   },
//   session: {
//     strategy: 'jwt',
//   },
//   callbacks: {
//     async session({ session, token }) {
//       if (session.user) {
//         session.user.id = token.sub!;
//       }
//       return session;
//     },
//   },
// };

/**
 * Helper function to get current session
 * 
 * Usage in Server Components:
 * import { getServerSession } from 'next-auth';
 * import { authOptions } from '@/lib/auth';
 * 
 * const session = await getServerSession(authOptions);
 */

/**
 * Helper function to protect API routes
 * 
 * Usage:
 * const session = await requireAuth(request);
 */
// export async function requireAuth(request: Request) {
//   const session = await getServerSession(authOptions);
//   
//   if (!session) {
//     throw new Error('Unauthorized');
//   }
//   
//   return session;
// }

export {};

