import Link from 'next/link';

export function SiteFooter() {
  return (
    <footer className="bg-[#0a0a0b] px-5 py-12 text-white sm:px-8 sm:py-16">
      <div className="mx-auto max-w-[1280px]">
        <div className="grid gap-8 border-b border-white/12 pb-10 lg:grid-cols-[1fr_1.35fr] lg:items-end">
          <div>
            <div className="flex items-baseline gap-2 text-base">
              <p className="font-bold text-white/55">문의처</p>
              <span className="text-white/30" aria-hidden="true">
                /
              </span>
              <p className="text-white/70">
                (재)부산테크노파크 정책기획단 미래전략팀
              </p>
            </div>
            <div className="mt-2 flex flex-col gap-1">
              <a
                className="w-fit text-lg font-bold underline decoration-white/30 underline-offset-4 hover:decoration-white"
                href="tel:0518668702"
              >
                051-866-8702, 8708
              </a>
              <p className="text-sm text-white/60">대회 사무국: 추후 별도 안내</p>
            </div>
          </div>

          <div className="text-sm leading-6 text-white/60">
            <p>주최 산업통상부 · 부산광역시 · 울산광역시 · 경상남도</p>
            <p>주관 한국산업기술진흥원 · 동남권지역혁신융복합단지추진단</p>
            <p>공동 운영 부산테크노파크 · 울산지역산업진흥원 · 경남테크노파크</p>
          </div>
        </div>

        <div className="flex flex-col gap-4 pt-8 text-xs leading-6 text-white/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 동남권지역혁신융복합단지추진단. All rights reserved.</p>
          <Link
            className="w-fit font-bold text-white/80 underline decoration-white/30 underline-offset-4 hover:text-white"
            href="/privacy"
          >
            개인정보처리방침
          </Link>
        </div>
      </div>
    </footer>
  );
}
