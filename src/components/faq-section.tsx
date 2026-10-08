'use client';
import { useState } from 'react';
import type { FaqItem } from '@/types';

export function FaqSection({ faqs }: { faqs: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="scroll-mt-28">
      <h2 className="max-w-[760px] text-[clamp(1.5rem,4.5vw,3rem)] leading-[1.12] font-semibold tracking-[0.055em]">
        자주 묻는 질문
      </h2>
      {faqs.length === 0 ? (
        <p className="faq-item mt-12 p-7 text-lg leading-[1.7] text-white/60 sm:p-10 sm:text-xl">
          등록된 자주 묻는 질문이 없습니다.
        </p>
      ) : (
        <div className="mt-12 grid gap-0">
          {faqs.map((faq, index) => {
            const open = openIndex === index;
            return (
              <div key={index} className="faq-item overflow-hidden">
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={`faq-answer-${index}`}
                  id={`faq-question-${index}`}
                  className="flex min-h-16 w-full items-center justify-between gap-4 px-6 text-left sm:px-8"
                  onClick={() => setOpenIndex(open ? null : index)}
                >
                  <span className="flex items-baseline gap-3 text-lg leading-[1.5] font-bold tracking-[-0.02em] sm:text-xl">
                    <span className="shrink-0 text-[#59c3e7]">
                      Q{index + 1}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <span
                    aria-hidden="true"
                    className="shrink-0 text-xl text-[#59c3e7]"
                  >
                    {open ? '▴' : '▾'}
                  </span>
                </button>
                <div
                  id={`faq-answer-${index}`}
                  role="region"
                  aria-labelledby={`faq-question-${index}`}
                  hidden={!open}
                >
                  <div className="flex items-baseline gap-3 px-6 py-6 text-lg leading-[1.75] text-white/75 sm:px-8 sm:text-xl">
                    <span className="shrink-0 font-bold text-[#59c3e7]">A</span>
                    <p className="whitespace-pre-line">{faq.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
