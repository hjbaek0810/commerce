import SignUpForm from '@app/sign-up/SignUpForm';

import type { Metadata } from 'next/types';

export const metadata: Metadata = {
  title: '회원가입 | MiniMall',
  description: 'MiniMall에 가입하고 최신 상품과 특별 할인 혜택을 확인하세요!',
  robots: 'noindex, nofollow',
  openGraph: {
    title: '회원가입 | MiniMall',
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`,
    description: 'MiniMall에 가입하고 최신 상품과 특별 할인 혜택을 확인하세요!',
  },
};

const SignUp = () => <SignUpForm />;

export default SignUp;
