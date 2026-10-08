import Link from 'next/link';
import { SiteFooter } from '@/components/site-footer';
import { FaqSection } from '@/components/faq-section';
import { MobileNav } from '@/components/mobile-nav';
import { getSettings } from '@/lib/settings';
import type { FaqItem } from '@/types';

export const dynamic = 'force-dynamic';

const prizePattern = /(총상금 [\d,]+만원|사업화지원금 최대 [\d억천만원]+ 이내)/;

const awards = [
  ['본선 진출작', '본선 참가경비(부산-오사카 크루즈 승선료 등) 전액 지원'],
  [
    '개인부문 우수작',
    '개인부문 총상금 1,500만원 \n 동남권 광역자치단체장상(부산광역시장, 울산광역시장, 경상남도지사) \n 시도별 테크노파크원장상 등 수여 예정',
  ],
  [
    '기업부문 우수작',
    '사업화지원금 최대 7억5천만원 이내 \n 27년 동남권 지역혁신클러스터육성(비R&D)사업 기업지원 세부 프로그램 우선지원 예정',
  ],
];

const hostInfo = [
  ['대회명', '2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤'],
  ['주최', '산업통상부, 부산광역시, 울산광역시, 경상남도'],
  ['주관', '한국산업기술진흥원, 동남권지역혁신융복합단지추진단'],
  ['공동 운영', '부산테크노파크, 울산지역산업진흥원, 경남테크노파크'],
  ['대회주제', '멀티도메인 모빌리티 기술과 AI를 접목한 문제해결형 BM 개발'],
  ['대회구성', '개인 및 기업부문'],
];

const purposes = [
  '부산·울산·경남의 지역별 특화산업과 혁신역량을 연계하여 육(Ground)·해(Naval)·공(Air) 등 멀티도메인 모빌리티 분야의 초광역 협력형 사업화 모델을 발굴',
  '모빌리티 기술과 AI·데이터를 융합한 문제해결형 신기술 및 신사업 비즈니스모델 개발을 촉진',
  '동남권 혁신기업과 대학 및 지역인재 간 교류·협력을 통한 지역산업 혁신생태계 및 미래인재 네트워크 확대',
];

const participantTypes = [
  {
    category: '개인부문',
    target: '전국 대학에 재학중인 대학생 (4인 1팀 구성)',
    notes: [
      '팀장 1명 및 팀원 3명, 소속대학 등 자율구성',
      '전공제한 없음. 대학원생 불가. 휴학생 가능',
    ],
  },
  {
    category: '기업부문',
    target:
      '동남권(부산·울산·경남) 소재 중소기업 또는 중견기업 1~2개사 내외로 구성 (본점 외 동남권 소재 지점·연구소, 공장도 사업장으로 인정)',
    notes: [
      '팀장 1명 및 팀원 3명 구성',
      '기업 재직자 및 대학(원)생 참여 가능',
      '단, 4인 중 주관기업 재직자 2인 이상 필수',
    ],
  },
];

const regionalIndustries = [
  {
    region: '부산',
    regionEn: 'BUSAN',
    domain: '해상 모빌리티',
    english: 'Naval Domain Mobility',
    description: [
      '해상 모빌리티(Naval Domain Mobility)의 거점',
      '해양 ICT, AI기반 운항·운영 기술, 센서·SW 기반 모니터링 및 운영·유지 서비스 분야',
      '선박 및 해상 이동체계의 지능화와 운영 최적화를 수행하며, 실제 운용 데이터를 축적',
    ],
    focus: ['AI기반 운영', '해양·항만실증', '선박 친환경 모듈'],
  },
  {
    region: '울산',
    regionEn: 'ULSAN',
    domain: '육상 모빌리티',
    english: 'Ground Domain Mobility',
    description: [
      '지상 모빌리티(Ground Domain Mobility)의 핵심 축',
      '전동화, 전력변환, 에너지 관리 기술을 기반으로 한 지상 이동체계의 구동·에너지 시스템 분야',
      '친환경 전동·에너지 기술을 통해 수송 시스템의 효율성과 지속가능성을 제공',
    ],
    focus: ['전력구동', '에너지'],
  },
  {
    region: '경남',
    regionEn: 'GYEONGNAM',
    domain: '항공 모빌리티',
    english: 'Air Domain Mobility',
    description: [
      '항공 모빌리티(Air Domain Mobility)의 핵심 축',
      '항공부품·소재, 경량 구조, 정밀 가공, 성능·안전성 시험 및 신뢰성 검증 분야',
      '고신뢰성 이동 체계의 물리적 기반과 안전성을 확보',
    ],
    focus: ['항공기부품', '구조', '신뢰성'],
  },
];

const preliminaryPlan = [
  ['신청방법', '소정양식에 따라 참가신청서, 컨셉기획안 온라인 접수'],
  ['예상일정', '10월 중 공고 및 접수 마감'],
  ['평가방법', '서면심사'],
  ['본선진출 선정규모', '개인 및 기업부문 각 12팀 내외'],
];

const finalPlan = [
  ['대회일정', '2026. 11. 8.(일) ~ 11. 10.(화)'],
  ['대회장소', '부산 아스티호텔, 팬스타미라클호, 일본 오사카항 일원'],
  ['평가방법', '최종심사 (발표 및 질의응답 평가)'],
];

const schedule = [
  {
    step: '사업공고 및 홍보',
    period: '동남권지역혁신융복합단지추진단 주관사별 홈페이지 및 대회 홈페이지',
  },
  { step: '신청접수', period: "'26. 10. 26.(월) 18시까지" },
  { step: '예선심사', period: "'26. 10. 27.(화) ~ 10. 29.(목)" },
  { step: '본선 참가팀 선정결과 발표', period: "'26. 10. 30.(금) 15시" },
  { step: '본선대회', period: "'26. 11. 8.(일) ~ 11. 10.(화)" },
  { step: '본선심사 및 시상식', period: "'26. 11. 10.(화)" },
];

const notices = [
  "본 안내는 참가 희망자의 팀 구성 및 아이디어 구상 등을 위한 사전 안내로, 참가신청은 추후 참가모집 공고('26년 10월 초 예정) 개시 후 진행할 수 있습니다.",
  '대회의 온라인 접수처 주소 및 모집기한 등 상세사항은 추후 별도 안내 예정입니다.',
  "본선대회는 부산~오사카 왕복 크루즈(팬스타미라클호)를 탑승하는 '선상해커톤' 방식으로 진행되므로 본선 참가는 대회기간 중 유효 여권 소지 및 대한민국과 일본의 출입국 허가가 가능한 자에 한합니다.",
  '팀원 중 출입국 불허자 발생 시 팀 전원의 대회 참여가 제한될 수 있으며, 이는 참가자 본인의 귀책으로 간주합니다.',
  '상기 일정은 대회 진행 경과에 따라 일부 변경될 수 있으며, 변경 시 추후 대회 홈페이지 등을 통해 공지합니다.',
];

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="max-w-[760px] text-[clamp(1.5rem,4.5vw,3rem)] leading-[1.12] font-semibold tracking-[0.055em]">
      {children}
    </h2>
  );
}

export default async function HomePage() {
  let faqs: FaqItem[] = [];
  try {
    faqs = (await getSettings()).faqs ?? [];
  } catch {
    faqs = [];
  }

  const panel =
    'landing-panel mt-5 rounded-2xl p-5 sm:p-10';
  const bullet = (
    <span
      aria-hidden="true"
      className="mt-[0.65em] block size-1.5 shrink-0 rounded-full bg-white/45"
    />
  );

  return (
    <div className="landing-high-contrast min-h-screen bg-[#05070f] text-white">
      <header className="sticky top-0 z-20 bg-[#010622]">
        <div className="relative flex items-center justify-between gap-4 px-5 py-[22px] sm:px-8 lg:px-[120px]">
          <Link className="flex min-h-11 items-center" href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              alt="2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤"
              className="h-auto w-[110px] sm:w-[130px]"
              height={1526}
              src="/assets/hero-logo.png"
              width={4096}
            />
          </Link>
          <MobileNav />
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden px-5 pt-0 pb-16 text-center sm:px-8 sm:pt-20 sm:pb-28 lg:pb-32">
          <div className="relative z-1 mx-auto max-w-[1280px]">
            <div className="hero-copy mx-auto flex max-w-[1280px] flex-col items-center">
              <h1 className="relative aspect-[3/4] w-screen max-w-none min-[480px]:aspect-[4/3] sm:aspect-[1440/842]">
                <span className="sr-only">
                  2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤
                </span>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="absolute bottom-[40%] left-1/2 h-auto w-[68%] -translate-x-1/2 sm:bottom-[26%] sm:w-[40%]"
                  height={1024}
                  src="/assets/hero-ship.png"
                  width={1536}
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  alt=""
                  className="absolute top-[10%] left-1/2 h-auto w-[58%] -translate-x-1/2 sm:top-[12%] sm:w-[42%]"
                  height={1526}
                  src="/assets/hero-logo.png"
                  width={4096}
                />
              </h1>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="부산↔오사카를 왕복하는 무박 3일간의 선상 크루즈 해커톤"
                className="relative -mt-[28vw] h-auto w-[80%] max-w-[560px] sm:-mt-[9vw]"
                height={683}
                src="/assets/hero-banner.png"
                width={3368}
              />
              <p className="mt-8 text-xl font-black sm:mt-10 sm:text-2xl tracking-[-0.035em] text-white sm:text-4xl">
                <span className="text-[#59c3e7]">
                  육·해·공 모빌리티 × AI·데이터
                </span>
              </p>
              <p className="mt-5 max-w-[760px] text-base leading-[1.7] text-white/70 sm:mt-6 sm:text-xl">
                동남권 혁신클러스터의 특화산업인 멀티도메인 모빌리티 기술과
                <br />
                AI·데이터를 융합한 문제해결형 비즈니스 모델을 발굴합니다
              </p>
              <div className="mt-8 flex w-full flex-col justify-center gap-3 min-[480px]:w-auto min-[480px]:flex-row sm:mt-10">
                <Link
                  className="brand-gradient inline-flex min-h-14 items-center justify-center rounded-full px-7 text-base font-bold text-white"
                  href="/apply"
                >
                  참가 신청하기
                </Link>
                <Link
                  className="inline-flex min-h-14 items-center justify-center rounded-full border border-[#59c3e7] bg-[#0D1E5E] px-7 text-base font-bold text-white hover:bg-[#59c3e7]/20"
                  href="/application/login"
                >
                  신청 확인·수정
                </Link>
              </div>
            </div>
            <div className="hero-stats mx-auto mt-12 sm:mt-20 grid max-w-[1120px] border-t border-[#59c3e7]/55 pt-8 text-center sm:grid-cols-3 sm:gap-6 lg:gap-8">
              {[
                ['접수', '10.08(목) ~ 10. 26.(월) 18:00까지'],
                ['본선 일정', '11.8.(일) ~ 11.10.(화)'],
                ['참가 단위', '4인 1팀 (개인·기업부문)'],
              ].map(([label, value]) => (
                <div
                  className="border-b border-[#59c3e7]/55 py-5 sm:border-0 sm:py-0"
                  key={label}
                >
                  <strong className="block text-sm font-semibold tracking-[-0.05em] text-white sm:text-base">
                    {label}
                  </strong>
                  <span className="mt-2 block text-xl text-white/60 sm:text-2xl">
                    {value}
                  </span>
                </div>
              ))}
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              className="mt-10 h-auto w-full max-w-[900px] sm:mt-16"
              src="/assets/organizers.png"
              width={4513}
              height={162}
              alt="주최 산업통상부, 부산광역시, 울산광역시, 경상남도 / 주관 한국산업기술진흥원, 동남권지역혁신융복합단지추진단 / 공동 운영 부산테크노파크, 울산지역산업진흥원, 경남테크노파크"
            />
          </div>
        </section>

        <div className="mx-auto max-w-[1280px] space-y-20 px-5 py-16 sm:px-8 sm:py-32 lg:space-y-40">
          <section id="contest" className="contest-brief scroll-mt-28">
            <SectionTitle>대회 개요</SectionTitle>

            <div className="contest-brief-content mt-8 grid gap-8 text-base sm:mt-12 sm:gap-10 sm:text-xl leading-[1.75] text-white/72">
              <div aria-labelledby="contest-purpose">
                <h3 id="contest-purpose" className="contest-brief-title">
                  배경 및 목적
                </h3>
                <section className={panel}>
                  <ul className="grid gap-1.5 pl-6 [list-style:disc] marker:text-white/60">
                    {purposes.map((item) => (
                      <li className="pl-1" key={item}>
                        {item}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>

              <div aria-labelledby="contest-info">
                <h3 id="contest-info" className="contest-brief-title">
                  대회개요
                </h3>
                <section className={panel}>
                  <dl className="grid gap-4">
                    {hostInfo.map(([label, value]) => (
                      <div
                        className="grid gap-1 sm:grid-cols-[140px_1fr] sm:gap-4"
                        key={label}
                      >
                        <dt className="font-semibold text-white">{label}</dt>
                        <dd>{value}</dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>

              <div aria-labelledby="contest-eligibility">
                <h3 id="contest-eligibility" className="contest-brief-title">
                  참가대상
                </h3>
                <section className={panel}>
                  <div className="overflow-x-auto">
                    <table className="contest-brief-table min-w-[620px]">
                      <thead>
                        <tr>
                          <th>구분</th>
                          <th>참가대상</th>
                          <th>비고</th>
                        </tr>
                      </thead>
                      <tbody>
                        {participantTypes.map((row) => (
                          <tr key={row.category}>
                            <td>
                              <strong>{row.category}</strong>
                            </td>
                            <td>{row.target}</td>
                            <td>
                              <ul className="grid gap-1 pl-4 [list-style:disc] marker:text-white/40">
                                {row.notes.map((note) => (
                                  <li key={note}>{note}</li>
                                ))}
                              </ul>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-base text-white/85">
                    * 동남권의 기업의 경우 동남권 기업과 컨소시엄 참여 가능
                  </p>
                </section>
              </div>

              <div aria-labelledby="contest-industries">
                <h3 id="contest-industries" className="contest-brief-title">
                  동남권 특화산업 — 멀티도메인 모빌리티
                </h3>
                <ul className="mt-5 grid gap-5 lg:grid-cols-3">
                  {regionalIndustries.map((item) => (
                    <li
                      className="interactive-card relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-[rgba(0,20,80,0.8)] p-6 backdrop-blur-md sm:p-9"
                      key={item.region}
                    >
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute -left-6 -top-2.5 select-none whitespace-nowrap text-[64px] font-bold sm:text-[96px] leading-none text-[rgba(255,255,255,0.3)]"
                      >
                        {item.regionEn}
                      </span>
                      <p className="relative text-2xl font-bold tracking-[-0.5px] text-white">
                        {item.domain}
                      </p>
                      <ul className="relative list-disc pl-[22px] text-[15px] leading-[1.7] tracking-[-0.2px] text-white">
                        {item.description.map((text) => (
                          <li key={text}>{text}</li>
                        ))}
                      </ul>
                      <p className="relative text-sm font-bold tracking-[-0.5px] text-white">
                        중점 육성 분야
                      </p>
                      <p className="relative flex flex-wrap gap-2">
                        {item.focus.map((tag) => (
                          <span
                            className="rounded-full bg-white/30 p-2 text-sm tracking-[-0.2px] text-white"
                            key={tag}
                          >
                            {tag}
                          </span>
                        ))}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>

              <div aria-labelledby="contest-operation">
                <h3 id="contest-operation" className="contest-brief-title">
                  예선 및 본선대회 운영 계획(안)
                </h3>
                <section className={panel}>
                  <div className="grid gap-8 lg:grid-cols-2">
                    <div>
                      <p className="text-lg font-semibold text-white">
                        예선대회
                      </p>
                      <dl className="mt-4 grid gap-3">
                        {preliminaryPlan.map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-sm font-semibold text-white/55">
                              {label}
                            </dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-white">
                        본선대회
                      </p>
                      <dl className="mt-4 grid gap-3">
                        {finalPlan.map(([label, value]) => (
                          <div key={label}>
                            <dt className="text-sm font-semibold text-white/55">
                              {label}
                            </dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </div>
                  </div>
                </section>
              </div>

              <div
                id="schedule"
                className="scroll-mt-28"
                aria-labelledby="contest-schedule"
              >
                <h3 id="contest-schedule" className="contest-brief-title">
                  추진일정(안)
                </h3>
                <section className={panel}>
                  <div className="overflow-x-auto">
                    <table className="contest-brief-table">
                      <thead>
                        <tr>
                          <th>단계</th>
                          <th>내용 / 시기</th>
                        </tr>
                      </thead>
                      <tbody>
                        {schedule.map((item, index) => (
                          <tr key={item.step}>
                            <td>
                              <strong>
                                {index + 1}. {item.step}
                              </strong>
                            </td>
                            <td>{item.period}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <div aria-labelledby="contest-awards">
                <h3 id="contest-awards" className="contest-brief-title">
                  우수작 특전 사항(안)
                </h3>
                <section className={panel}>
                  <div className="overflow-x-auto">
                    <table className="contest-brief-table contest-awards-table">
                      <thead>
                        <tr>
                          <th>구분</th>
                          <th>특전</th>
                        </tr>
                      </thead>
                      <tbody>
                        {awards.map(([rank, benefit]) => (
                          <tr key={rank}>
                            <td>{rank}</td>
                            <td>
                              {benefit.split('\n').map((line, index) => (
                                <div className="whitespace-normal" key={index}>
                                  {line
                                    .trim()
                                    .split(prizePattern)
                                    .map((part, i) =>
                                      i % 2 === 1 ? (
                                        <strong
                                          className="prize-highlight"
                                          key={i}
                                        >
                                          {part}
                                        </strong>
                                      ) : (
                                        part
                                      ),
                                    )}
                                </div>
                              ))}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>

              <div aria-labelledby="contest-notices">
                <h3 id="contest-notices" className="contest-brief-title">
                  유의사항
                </h3>
                <section className={panel}>
                  <ul className="grid gap-2 text-base leading-[1.7] text-white/70 sm:text-lg">
                    {notices.map((item) => (
                      <li className="flex items-start gap-2.5" key={item}>
                        {bullet}
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          </section>

          <FaqSection faqs={faqs} />

          <section id="contact" className="scroll-mt-28">
            <SectionTitle>문의하기</SectionTitle>
            <p className="mt-5 text-lg leading-[1.7] text-white/70 sm:text-xl">
              (재)부산테크노파크 정책기획단 미래전략팀
              <br />
              <a
                className="underline decoration-white/30 underline-offset-4 hover:decoration-white"
                href="tel:0518668702"
              >
                051-866-8702
              </a>
              ,{' '}
              <a
                className="underline decoration-white/30 underline-offset-4 hover:decoration-white"
                href="tel:0518668708"
              >
                8708
              </a>
              <br />
              대회 사무국: 추후 별도 안내
            </p>
            <div className="mt-8">
              <a
                className="brand-gradient inline-flex min-h-14 items-center justify-center rounded-full px-8 text-base font-bold text-white"
                href="tel:0518668702"
              >
                전화 문의하기
              </a>
            </div>
          </section>
        </div>

        <section className="bg-[#111111] bg-[url('/assets/hero-bg.png')] bg-cover bg-center px-5 py-24 text-white sm:px-8 sm:py-32">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-10 text-center lg:flex-row lg:items-end lg:text-left">
            <h2 className="w-full max-w-[520px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="2026 동남권 멀티도메인 모빌리티 비즈니스 해커톤"
                className="h-auto w-full"
                height={1526}
                src="/assets/hero-logo.png"
                width={4096}
              />
            </h2>
            <Link
              className="brand-gradient inline-flex min-h-14 shrink-0 items-center justify-center rounded-full px-8 font-bold"
              href="/apply"
            >
              참가 신청하기
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
