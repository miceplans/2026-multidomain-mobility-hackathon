import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { ImageResponse } from 'next/og';

export const alt = '2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function asset(name: string) {
  const buf = await readFile(path.join(process.cwd(), 'public/assets', name));
  return `data:image/png;base64,${buf.toString('base64')}`;
}

export default async function Image() {
  const [bg, ship, logo] = await Promise.all([
    asset('hero-bg.png'),
    asset('hero-ship.png'),
    asset('hero-logo.png'),
  ]);
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundImage: `url(${bg})`,
          backgroundSize: '100% 100%',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={logo} width={760} height={283} />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="" src={ship} width={420} height={280} />
      </div>
    ),
    size,
  );
}
