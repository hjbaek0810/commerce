import { Suspense } from 'react';

import SignInForm from '@app/auth/sign-in/SignInForm';
import LoadingSpinner from '@components/Loading';

import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '로그인 페이지 | MiniMall',
  description: '로그인하여 MiniMall 서비스를 이용하세요.',
  robots: 'noindex, nofollow',
  openGraph: {
    title: '로그인 | MiniMall',
    url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/sign-in`,
    description: '로그인하여 MiniMall 서비스를 이용하세요.',
  },
};

const SignIn = () => (
  <Suspense fallback={<LoadingSpinner />}>
    <SignInForm />
  </Suspense>
);

export default SignIn;
