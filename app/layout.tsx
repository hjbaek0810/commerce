import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

import '@styles/global.css';
import ModalsProvider from '@utils/modals/provider';
import QueryProvider from '@utils/query/provider';

import type { Metadata } from 'next';
import AuthProvider from '@utils/auth/provider';
import Layout from '@components/Layout';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'hj Commerce',
  description: 'manage product',
  other: {
    'http-equiv': 'Cross-Origin-Opener-Policy',
    content: 'same-origin-allow-popups',
  },
};

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
