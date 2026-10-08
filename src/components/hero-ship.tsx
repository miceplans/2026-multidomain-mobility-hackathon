'use client';

import { useEffect, useRef } from 'react';

const START_SCALE = 0.55;
// 시작 시 배의 중심이 화면 가운데에 오도록 왼쪽으로 당겨 둔 거리(배 너비 대비 %)
const START_SHIFT_X = -16;
const SCROLL_RANGE = 500;

export function HeroShip() {
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.transform = 'none';
      return;
    }
    let frame = 0;
    const update = () => {
      frame = 0;
      const progress = Math.min(window.scrollY / SCROLL_RANGE, 1);
      const scale = START_SCALE + (1 - START_SCALE) * progress;
      const shift = START_SHIFT_X * (1 - progress);
      el.style.transform = `translateX(${shift}%) scale(${scale})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      ref={ref}
      alt=""
      className="absolute top-[16.5%] left-[25.1%] h-auto w-[73.3%] will-change-transform"
      height={1024}
      src="/assets/hero-ship.png"
      style={{
        transform: `translateX(${START_SHIFT_X}%) scale(${START_SCALE})`,
      }}
      width={1536}
    />
  );
}
