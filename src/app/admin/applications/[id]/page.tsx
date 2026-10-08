'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ContestHeader } from '@/components/contest-header';
import { useToast } from '@/components/toast';
import { formatKoreanDateTime } from '@/lib/date-format';
type Detail = Record<string, unknown> & {
  receipt_number: string;
  team_name: string;
  leader_name: string;
  leader_org: string;
  leader_email: string;
  leader_phone: string;
  applicant_type: string | null;
  company_region: string | null;
  company_industry: string | null;
  company_code: string | null;
  requests: string | null;
  created_at: string;
  updated_at: string;
  application_files: {
    id: string;
    original_name: string;
    mime_type: string;
    size_bytes: number;
  }[];
  email_logs: {
    id: string;
    status: string;
    attempt_count: number;
    sent_at: string | null;
    error_summary: string | null;
  }[];
};
const EXT_COLORS: Record<string, string> = {
  pdf: '#e5352b',
  doc: '#2b579a',
  docx: '#2b579a',
  xls: '#1d6f42',
  xlsx: '#1d6f42',
  ppt: '#d24726',
  pptx: '#d24726',
  hwp: '#2e7ff1',
};
function FileIcon({ extension }: { extension: string }) {
  const ext = extension.toLowerCase();
  const color = EXT_COLORS[ext] ?? '#8a8a8a';
  return (
    <svg width="64" height="80" viewBox="0 0 64 80" aria-hidden>
      <path
        d="M8 1h28l19 19v51a8 8 0 0 1-8 8H8a8 8 0 0 1-8-8V9a8 8 0 0 1 8-8z"
        fill="#fff"
        stroke="#ddd"
      />
      <path d="M36 1l19 19H40a4 4 0 0 1-4-4V1z" fill="#f0f0f0" />
      <rect x="0" y="50" width="64" height="20" rx="3" fill={color} />
      <text
        x="32"
        y="64"
        textAnchor="middle"
        fontSize="11"
        fontWeight="bold"
        fill="#fff"
      >
        {ext.toUpperCase()}
      </text>
    </svg>
  );
}
export default function Page() {
  const router = useRouter();
  const { showToast } = useToast();
  const { id } = useParams<{ id: string }>();
  const [app, setApp] = useState<Detail | null>(null);
  const [resending, setResending] = useState(false);
  const load = () =>
    fetch(`/api/admin/applications/${id}`)
      .then(async (r) => {
        if (r.status === 401) {
          router.push('/admin/login');
          return null;
        }
        const v = await r.json();
        if (!r.ok) {
          showToast(v.error ?? '신청 정보를 불러오지 못했습니다.');
          return null;
        }
        return v;
      })
      .then((v) => v && setApp(v.application))
      .catch(() =>
        showToast('네트워크 오류로 신청 정보를 불러오지 못했습니다.'),
      );
  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);
  const resend = async () => {
    setResending(true);
    try {
      const r = await fetch(`/api/admin/applications/${id}/resend-email`, {
        method: 'POST',
      });
      if (!r.ok) {
        const value = await r.json().catch(() => null);
        showToast(value?.error ?? '재발송 요청에 실패했습니다.');
        return;
      }
      await load();
      showToast('이메일 재발송 요청을 완료했습니다.', 'success');
    } catch {
      showToast('네트워크 오류로 재발송 요청에 실패했습니다.');
    } finally {
      setResending(false);
    }
  };
  if (!app) return <p className="p-8">불러오는 중…</p>;
  return (
    <div>
      <ContestHeader actionLabel="신청 목록" actionHref="/admin/applications" />
      <main className="mx-auto max-w-[900px] px-5 py-8">
        <h1 className="text-3xl font-bold">{app.team_name}</h1>
        <p className="mt-2">{app.receipt_number}</p>
        <dl className="mt-8 grid gap-4 rounded-xl border border-[#e5e5e5] p-5 sm:grid-cols-2">
          {[
            ['팀장', app.leader_name],
            ['소속', app.leader_org],
            ['이메일', app.leader_email],
            ['연락처', app.leader_phone],
            ['구분', app.applicant_type ?? '미입력'],
            ...(app.applicant_type === '기업'
              ? [
                  ['기업 소재지', app.company_region ?? ''],
                  ['기업 산업 분야', app.company_industry ?? ''],
                  ['기업 코드', app.company_code ?? ''],
                ]
              : []),
            ['요청사항', app.requests ?? ''],
          ].map(([k, v]) => (
            <div key={String(k)}>
              <dt className="text-xs text-[#666]">{String(k)}</dt>
              <dd className="mt-1 whitespace-pre-wrap">{String(v)}</dd>
            </div>
          ))}
        </dl>
        <h2 className="mt-8 text-xl font-bold">첨부파일</h2>
        {app.application_files.length ? (
          <ul className="mt-3 grid gap-4 sm:grid-cols-2">
            {app.application_files.map((f) => (
              <li
                className="overflow-hidden rounded-xl border border-[#e5e5e5]"
                key={f.id}
              >
                <a
                  className="flex min-h-52 items-center justify-center bg-[#f5f5f5] p-2"
                  href={`/api/admin/files/${f.id}`}
                  target="_blank"
                  rel="noreferrer"
                  title={`${f.original_name} 새 창에서 보기`}
                >
                  <FileIcon
                    extension={
                      f.original_name.match(/\.([^./\\]+)$/)?.[1] ?? '파일'
                    }
                  />
                </a>
                <div className="flex items-center justify-between gap-3 p-3 text-sm">
                  <span className="min-w-0 truncate" title={f.original_name}>
                    {f.original_name} ({Math.ceil(f.size_bytes / 1024)}KB)
                  </span>
                  <a
                    className="shrink-0 underline"
                    href={`/api/admin/files/${f.id}?download=1`}
                  >
                    다운로드
                  </a>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-[#666]">
            제출된 증빙자료가 없습니다.
          </p>
        )}
        <h2 className="mt-8 text-xl font-bold">이메일 발송 결과</h2>
        {app.email_logs.length ? (
          app.email_logs.map((e) => (
            <p
              className="mt-2 flex flex-wrap items-center gap-3 rounded-lg border border-[#e5e5e5] p-3 text-sm"
              key={e.id}
            >
              <span>
                {e.status} · 시도 {e.attempt_count}회{' '}
                {e.sent_at && `· ${formatKoreanDateTime(e.sent_at)}`}{' '}
                {e.error_summary && `· ${e.error_summary}`}
              </span>
              {e.status !== 'sent' && (
                <button
                  className="motion-control rounded-lg border border-[#e5e5e5] px-3 py-1 hover:bg-[#f5f5f5] disabled:opacity-50"
                  disabled={resending}
                  onClick={resend}
                >
                  {resending ? '재발송 중…' : '재시도'}
                </button>
              )}
            </p>
          ))
        ) : (
          <p className="mt-2 text-sm text-[#666]">이메일 기록이 없습니다.</p>
        )}
        <Link
          className="mt-8 inline-block underline"
          href="/admin/applications"
        >
          목록으로 돌아가기
        </Link>
      </main>
    </div>
  );
}
