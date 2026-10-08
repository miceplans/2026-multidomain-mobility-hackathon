import Link from 'next/link';

export function ContestHeader({
  helper,
  actionLabel,
  actionHref = '/apply',
  links,
  singleLineMobile = false,
}: {
  helper?: string;
  actionLabel?: string;
  actionHref?: string;
  links?: { label: string; href: string }[];
  singleLineMobile?: boolean;
}) {
  return (
    <header
      className={`motion-section sticky top-0 z-20 flex min-h-[72px] justify-between bg-[#010622] px-5 py-3 sm:flex-row sm:items-center sm:px-8 lg:px-10 ${
        singleLineMobile
          ? 'flex-row items-center gap-2'
          : 'flex-col items-stretch gap-3'
      }`}
    >
      <Link href="/" className="flex min-h-11 min-w-0 items-center sm:shrink-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤"
          className="h-auto w-[110px] sm:w-[130px]"
          height={1526}
          src="/assets/hero-logo.png"
          width={4096}
        />
      </Link>
      {(helper || actionLabel || links?.length) && (
        <div
          className={`flex min-w-0 items-center sm:justify-end ${
            singleLineMobile ? 'flex-nowrap gap-2' : 'flex-wrap gap-3'
          }`}
        >
          {helper && (
            <span className="hidden text-sm text-white/70 md:block">
              {helper}
            </span>
          )}
          {links?.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="motion-control inline-flex min-h-11 min-w-0 items-center justify-center rounded-[8px] border border-white/20 px-4 py-2 text-sm font-bold text-white hover:bg-white/10 sm:px-[18px]"
            >
              {link.label}
            </Link>
          ))}
          {actionLabel && (
            <Link
              href={actionHref}
              className={`motion-control inline-flex min-h-11 min-w-0 items-center justify-center rounded-[8px] bg-white/10 py-2 text-sm font-bold text-white hover:bg-white/20 sm:px-[18px] ${
                singleLineMobile ? 'px-3' : 'px-4'
              }`}
            >
              {actionLabel}
            </Link>
          )}
        </div>
      )}
    </header>
  );
}

export const fieldClass =
  'h-[52px] w-full min-w-0 rounded-[6px] border border-[#dfe3e8] bg-white px-4 text-base text-[#191f28] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[#b0b8c1] hover:border-[#c9d0d8] focus:border-[#59c3e7] focus:ring-3 focus:ring-[#59c3e7]/10 disabled:bg-[#f2f4f6] disabled:text-[#8b95a1] sm:text-sm';
