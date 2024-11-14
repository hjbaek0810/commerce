import { ToastContainer } from 'react-toastify';

import { config } from '@fortawesome/fontawesome-svg-core';

import { sprinkles } from '@styles/sprinkles.css';

import type { Metadata } from 'next';

import 'react-toastify/dist/ReactToastify.css';

import '@styles/global.css';

import '@fortawesome/fontawesome-svg-core/styles.css';

import ModalsProvider from '@utils/modals/provider';

config.autoAddCss = false;

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="en">
      <body>
        <ModalsProvider>
          <div
            className={sprinkles({
              paddingX: 'spacing-024',
              paddingY: 'spacing-032',
              minHeight: 'sizing-full-screen',
            })}
          >
            {children}
          </div>
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
      </body>
    </html>
  );
};

export default RootLayout;
