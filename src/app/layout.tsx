import type { Metadata } from 'next';

import './globals.css';
import { ToastProvider } from '@/components/toast';

const siteName = '2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤';
const siteDescription =
  '동남권 혁신클러스터의 특화산업인 멀티도메인 모빌리티 기술과 AI·데이터를 융합한 문제해결형 비즈니스 모델 발굴 해커톤';

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
  ),
  title: { default: siteName, template: `%s | ${siteName}` },
  description: siteDescription,
  applicationName: siteName,
  keywords: [
    '멀티도메인 모빌리티',
    '모빌리티 해커톤',
    '동남권 해커톤',
    '비즈니스 해커톤',
    '대학생 해커톤',
    '부산 해커톤',
    '울산 해커톤',
    '경남 해커톤',
    '동남권지역혁신융복합단지',
    '부산테크노파크',
    '울산지역산업진흥원',
    '경남테크노파크',
  ],
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    type: 'website',
    locale: 'ko_KR',
    siteName,
    title: siteName,
    description: siteDescription,
    url: '/',
  },
  twitter: {
    card: 'summary',
    title: siteName,
    description: siteDescription,
  },
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
