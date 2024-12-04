import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth/next';
import GoogleProvider from 'next-auth/providers/google';

import client from '@api/config/client';

import type { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(client),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
  ],
  session: {
    strategy: 'database',
    maxAge: 60 * 60 * 24,
  },
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...user,
        id: user.id,
      },
    }),
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
