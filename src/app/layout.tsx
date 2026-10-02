import type { Metadata } from 'next';

import './globals.css';
import { ToastProvider } from '@/components/toast';

export const metadata: Metadata = {
  title: '2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤',
  description:
    '동남권 혁신클러스터의 특화산업인 멀티도메인 모빌리티 기술과 AI·데이터를 융합한 문제해결형 비즈니스 모델 발굴 해커톤',
  icons: {
    icon: [
      { url: '/favicon.ico/favicon.ico', sizes: '16x16 32x32' },
      {
        url: '/favicon.ico/favicon-96x96.png',
        type: 'image/png',
        sizes: '96x96',
      },
    ],
    apple: [
      {
        url: '/favicon.ico/apple-icon-180x180.png',
        type: 'image/png',
        sizes: '180x180',
      },
    ],
  },
  manifest: '/favicon.ico/manifest.json',
  other: {
    'msapplication-config': '/favicon.ico/browserconfig.xml',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <body>
        <ToastProvider>
          <main className="min-h-screen w-full">{children}</main>
        </ToastProvider>
      </body>
    </html>
  );
}
