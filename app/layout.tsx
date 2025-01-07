import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import Layout from '@components/Layout';
import '@styles/error.css';
import '@styles/global.css';
import '@styles/loading.css';
import AuthProvider from '@utils/auth/provider';
import ModalsProvider from '@utils/modals/provider';
import QueryProvider from '@utils/query/provider';

import type { Metadata } from 'next';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'MiniMall',
  description:
    'MiniMall is a simple platform to manage products, categories, and more with an intuitive interface.',
  keywords: [
    'MiniMall',
    'Product Management',
    'Admin Dashboard',
    'E-commerce Management',
  ],
  applicationName: 'MiniMall',
  authors: [
    {
      name: 'hjbaek',
      url: 'https://www.notion.so/doolgi/a327d11f549a49ad9099248ac97cfcf5',
    },
  ],
  generator: 'Next.js',
  robots: 'index, follow',
  icons: {
    icon: '/favicon.ico',
  },
  openGraph: {
    type: 'website',
    url: process.env.NEXT_PUBLIC_VERCEL_URL,
    title: 'MiniMall - Simplify Product Management',
    description:
      'Manage your products and categories effortlessly with MiniMall. A powerful, yet simple admin dashboard.',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_VERCEL_URL}/assets/banner3.png`,
        width: 1920,
        height: 960,
        alt: 'Minimal Yet Powerful',
      },
    ],
  },
  other: {
    'http-equiv': 'Cross-Origin-Opener-Policy',
    content: 'same-origin-allow-popups',
  },
};

export const viewport = 'width=device-width, initial-scale=1.0';

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <QueryProvider>
            <ModalsProvider>
              <Layout>{children}</Layout>

              <ToastContainer
                position="bottom-right"
                autoClose={5000} // 자동 off 시간
                hideProgressBar={false} // 진행시간바 숨김
                closeOnClick // 클릭으로 알람 닫기
                rtl={false} // 알림 좌우 반전
                pauseOnFocusLoss // 화면을 벗어나면 알람 정지
                draggable // 드래그 가능
                pauseOnHover // 마우스를 올리면 알람 정지
                theme="light"
              />
            </ModalsProvider>
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
};

export default RootLayout;
