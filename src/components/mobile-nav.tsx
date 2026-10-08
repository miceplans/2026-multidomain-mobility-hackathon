'use client';

import Link from 'next/link';
import { useEffect, useState, useSyncExternalStore } from 'react';
import { createPortal } from 'react-dom';

const navLinks = [
  { href: '#contest', label: '대회 개요' },
  { href: '#schedule', label: '추진일정' },
  { href: '#contact', label: '문의하기' },
];

const subscribeToClient = () => () => {};

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const mounted = useSyncExternalStore(
    subscribeToClient,
    () => true,
    () => false,
  );

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <nav
      aria-label="주요 메뉴"
      className="flex items-center text-[15px]"
    >
      {navLinks.map((link) => (
        <a
          key={link.href}
          className="hidden min-h-11 items-center px-[18px] font-normal text-[#767676] hover:text-white sm:flex"
          href={link.href}
        >
          {link.label}
        </a>
      ))}
      <Link
        className="flex min-h-11 items-center rounded-[10px] bg-[#59c3e7] px-[22px] font-semibold text-white sm:ml-[18px]"
        href="/apply"
      >
        참가 신청
      </Link>
      <button
        aria-controls="mobile-nav-panel"
        aria-expanded={open}
        aria-label="메뉴 열기"
        className="ml-1 flex min-h-11 min-w-11 items-center justify-center rounded-full hover:bg-[#45C4DE]/15 sm:hidden"
        onClick={() => setOpen(true)}
        type="button"
      >
        <svg
          aria-hidden="true"
          fill="none"
          height="22"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          width="22"
        >
          <path d="M3 6h18M3 12h18M3 18h18" />
        </svg>
      </button>

      {mounted &&
        createPortal(
          <>
            <div
              aria-hidden={!open}
              className={`fixed inset-0 z-40 bg-black/50 transition-opacity sm:hidden ${
                open ? 'opacity-100' : 'pointer-events-none opacity-0'
              }`}
              onClick={() => setOpen(false)}
            />
            <div
              className={`fixed top-0 right-0 z-50 flex h-dvh w-[78%] max-w-[320px] flex-col gap-1 overflow-y-auto bg-[#0D1E5E] px-5 py-4 shadow-xl transition-transform duration-300 sm:hidden ${
                open ? 'translate-x-0' : 'translate-x-full'
              }`}
              id="mobile-nav-panel"
            >
              <button
                aria-label="메뉴 닫기"
                className="mb-2 flex min-h-11 min-w-11 items-center justify-center self-end rounded-full hover:bg-[#45C4DE]/15"
                onClick={() => setOpen(false)}
                type="button"
              >
                <svg
                  aria-hidden="true"
                  fill="none"
                  height="22"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  width="22"
                >
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  className="flex min-h-11 items-center rounded-lg px-3 text-base text-white hover:bg-[#45C4DE]/15"
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              ))}
              <div className="my-2" />
              <Link
                className="flex min-h-11 items-center rounded-lg px-3 text-base text-white hover:bg-[#45C4DE]/15"
                href="/application/login"
                onClick={() => setOpen(false)}
              >
                신청 확인·수정
              </Link>
              <Link
                className="brand-gradient mt-2 flex min-h-11 items-center justify-center rounded-full px-5 text-white"
                href="/apply"
                onClick={() => setOpen(false)}
              >
                참가 신청
              </Link>
            </div>
          </>,
          document.body,
        )}
    </nav>
  );
}
