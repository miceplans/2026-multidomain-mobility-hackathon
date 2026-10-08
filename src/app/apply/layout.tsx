import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '참가 신청',
  description:
    '2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤 팀 단위 참가 신청 페이지',
  alternates: { canonical: '/apply' },
};

export default function ApplyLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}
