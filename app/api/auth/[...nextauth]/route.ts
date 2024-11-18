import GoogleProvider from 'next-auth/providers/google';
import NextAuth from 'next-auth/next';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import client from '@api/config/client';

const handler = NextAuth({
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
  // pages: {
  //   signIn: '/auth/sign-in',
  // },
});

export { handler as GET, handler as POST };
