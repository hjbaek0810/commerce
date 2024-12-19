import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth from 'next-auth/next';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import client from '@api/config/client';
import { fetchData } from '@services/utils/fetch';
import { API } from '@services/utils/path';
import { UserRoleType } from '@utils/constants/user';

import type { SignInUser } from '@api/auth/sign-in/types/dto';
import type { NextAuthOptions, User } from 'next-auth';
import type { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(client) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_OAUTH_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_OAUTH_CLIENT_SECRET || '',
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        loginId: {
          label: 'loginId',
          type: 'text',
        },
        password: {
          label: 'password',
          type: 'password',
        },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const user = await fetchData<User, SignInUser>(
          API.AUTH.SIGN_IN,
          'POST',
          {
            data: {
              loginId: credentials?.loginId || '',
              password: credentials?.password || '',
            },
          },
        );

        if (user) {
          return user;
        }

        return null;
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 24, // 1day
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // TODO: 소셜 로그인이 아닌 경우 token 관리 & id가 아닌 token을 이용한 api 호출
      if (account) {
        token.accessToken = account.access_token;
        token.accessTokenExpires = account.expires_at;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
      }

      if (user) {
        return {
          ...token,
          user: {
            id: user?.id || user?._id,
            name: user.name,
            loginId: user?.loginId,
            email: user?.email || user?.contactEmail,
            role: user?.role || UserRoleType.USER,
            image: user.image || '',
          },
        };
      }

      return token;
    },
    async session({ session, token }) {
      session.user = token.user;
      session.accessToken = token.accessToken;
      session.accessTokenExpires = token.accessTokenExpires;
      session.provider = token.provider;
      // session.refreshToken = token.refreshToken;

      return session;
    },
  },
  pages: {
    signIn: '/auth/sign-in',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
