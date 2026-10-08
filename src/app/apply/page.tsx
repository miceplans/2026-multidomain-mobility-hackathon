'use client';
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from 'react';
import { ContestHeader, fieldClass } from '@/components/contest-header';
import { APPLICANT_TYPES, COMPANY_REGIONS, GENDERS } from '@/types';
import { COMPANY_INDUSTRIES, ksicOptions } from '@/lib/ksic';
import { useToast } from '@/components/toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { formatPhoneNumber } from '@/validations';
import {
  DirectUploadError,
  describeFiles,
  uploadToTargets,
} from '@/lib/direct-upload';
import type { UploadTarget } from '@/lib/direct-upload';
import { apiErrorMessage, readJson, type ApiBody } from '@/lib/api-error';
const FORM_DOWNLOADS = [
  {
    href: '/forms/form-1-individual.hwp',
    file: '첨부1_(신청양식)참가신청서_개인부문.hwp',
    label: '첨부1. 참가신청서 (개인부문)',
    types: ['일반'],
  },
  {
    href: '/forms/form-2-company.hwp',
    file: '첨부2_(신청양식)참가신청서_기업부문.hwp',
    label: '첨부2. 참가신청서 (기업부문)',
    types: ['기업'],
  },
  {
    href: '/forms/form-3-consent-pledge.hwp',
    file: '첨부3_(양식)해커톤_개인정보동의+참가서약서+보안서약서.hwp',
    label: '첨부3. 개인정보 동의 + 참가서약서 + 보안서약서',
    types: ['일반', '기업'],
  },
];
export default function ApplyPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const [idempotencyKey] = useState(() => crypto.randomUUID());
  const [applicantType, setApplicantType] = useState('');
  const [companyIndustry, setCompanyIndustry] = useState('');
  const [busy, setBusy] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  function onFilesSelected(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files ?? []);
    event.target.value = '';
    if (!selected.length) return;
    setFiles((v) => [...v, ...selected]);
  }
  function removeFile(index: number) {
    setFiles((v) => v.filter((_, i) => i !== index));
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    const form = event.currentTarget;
    const fd = new FormData(form);
    const isCompany = applicantType === '기업';
    const data = {
      idempotencyKey,
      applicantType,
      companyRegion: isCompany ? fd.get('companyRegion') || null : null,
      companyIndustry: isCompany ? companyIndustry || null : null,
      companyCode: isCompany ? fd.get('companyCode') || null : null,
      teamName: fd.get('teamName'),
      leaderName: fd.get('leaderName'),
      leaderOrg: fd.get('leaderOrg'),
      leaderEmail: fd.get('leaderEmail'),
      leaderPhone: fd.get('leaderPhone'),
      leaderBirthDate: fd.get('leaderBirthDate'),
      leaderGender: fd.get('leaderGender'),
      leaderResidence: fd.get('leaderResidence'),
      privacyAgreed: fd.get('privacyAgreed') === 'on',
      requests: '',
    };
    if (!applicantType) {
      showToast('기업/일반 구분을 선택해주세요.');
      setBusy(false);
      return;
    }
    if (isCompany && !data.companyRegion) {
      showToast('기업 소재지를 선택해주세요.');
      setBusy(false);
      return;
    }
    if (isCompany && (!data.companyIndustry || !data.companyCode)) {
      showToast('기업 산업 분야와 기업 코드를 선택해주세요.');
      setBusy(false);
      return;
    }
    if (!files.length) {
      showToast('신청 서류를 첨부해주세요.');
      setBusy(false);
      return;
    }
    try {
      const prepareResponse = await fetch('/api/applications/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data, files: describeFiles(files) }),
      });
      const prepared = await readJson<ApiBody & { uploads: UploadTarget[] }>(
        prepareResponse,
      );
      if (!prepareResponse.ok || prepared.duplicate) {
        handleSubmitResult(prepareResponse, prepared);
        return;
      }
      const uploaded = await uploadToTargets(files, prepared.uploads);
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          data,
          ticket: prepared.ticket,
          files: uploaded,
        }),
      });
      handleSubmitResult(response, await readJson(response));
    } catch (error) {
      showToast(
        error instanceof DirectUploadError
          ? error.message
          : '네트워크 오류로 제출하지 못했습니다. 다시 시도해주세요.',
      );
    } finally {
      setBusy(false);
    }
  }
  function handleSubmitResult(
    response: Response,
    result: {
      error?: string;
      details?: { reason?: string };
      receiptNumber?: string;
    },
  ) {
    if (!response.ok) {
      if (result.details?.reason === 'application_closed') {
        router.replace('/apply/closed');
        return;
      }
      showToast(
        apiErrorMessage(response.status, result, '제출하지 못했습니다.'),
      );
      return;
    }
    router.push(
      `/apply/complete?receipt=${encodeURIComponent(result.receiptNumber ?? '')}`,
    );
  }
  return (
    <div className="apply-page service-page">
      <ContestHeader
        helper="참가 신청"
        actionLabel="신청 확인·수정"
        actionHref="/application/login"
        singleLineMobile
      />
      <form
        onSubmit={submit}
        autoComplete="on"
        className="motion-page mx-auto flex max-w-[800px] flex-col gap-5 px-5 py-10 sm:py-14"
      >
        <div className="mb-2">
          <h1 className="mt-2 text-3xl font-extrabold tracking-[-0.04em] sm:text-4xl">
            참가신청서
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-[#6b7684]">
            필수 정보를 정확하게 입력해 주세요.
          </p>
        </div>
        <Section title="참가 구분">
          <fieldset>
            <legend className="sr-only">기업/일반 구분 (필수)</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              {APPLICANT_TYPES.map((type) => (
                <label
                  key={type}
                  className={`flex cursor-pointer items-center gap-3 rounded-xl border p-4 text-sm font-bold ${
                    applicantType === type
                      ? 'border-[#176f9f] bg-[#effbfe] text-[#176f9f]'
                      : 'border-[#dfe3e8] text-[#333d4b]'
                  }`}
                >
                  <input
                    required
                    type="radio"
                    name="applicantType"
                    value={type}
                    checked={applicantType === type}
                    onChange={(e) => setApplicantType(e.target.value)}
                    className="size-4"
                  />
                  {type === '기업' ? '기업 참가' : '일반(개인) 참가'}
                </label>
              ))}
            </div>
          </fieldset>
          {applicantType === '기업' && (
            <Grid>
              <Dropdown
                name="companyRegion"
                label="기업 소재지"
                values={COMPANY_REGIONS}
                columns={1}
              />
              <Dropdown
                name="companyIndustry"
                label="기업 산업 분야"
                values={COMPANY_INDUSTRIES}
                columns={1}
                onSelect={setCompanyIndustry}
              />
              <div className="sm:col-span-2">
                <Dropdown
                  key={companyIndustry}
                  name="companyCode"
                  label="기업 코드 (KSIC)"
                  values={ksicOptions(companyIndustry)}
                  columns={1}
                  disabled={!companyIndustry}
                />
              </div>
            </Grid>
          )}
        </Section>
        <Section title="신청 서식 다운로드">
          <p className="text-sm text-[#666]">
            서식을 내려받아 작성한 뒤, 아래 첨부파일 항목에 제출해 주세요.
          </p>
          <ul className="flex flex-col gap-2">
            {FORM_DOWNLOADS.filter(
              (form) => !applicantType || form.types.includes(applicantType),
            ).map((form) => (
              <li key={form.href}>
                <a
                  href={form.href}
                  download={form.file}
                  className="motion-control flex items-center justify-between gap-3 rounded-[10px] border border-[#dfe3e8] px-4 py-3 text-sm font-bold text-[#176f9f] hover:bg-[#f5f5f5]"
                >
                  <span className="min-w-0">{form.label}</span>
                  <span className="shrink-0 text-[13px]">다운로드 ↓</span>
                </a>
              </li>
            ))}
          </ul>
        </Section>
        <Section title="팀 정보">
          <Grid>
            <Field name="teamName" label="팀명" autoComplete="username" />
          </Grid>
          <p className="text-xs text-[#666]">
            신청 확인 비밀번호는 아래에 입력하는 팀장 연락처의 뒤 4자리로 자동
            설정됩니다.
          </p>
        </Section>
        <Section title="신청인(팀장 정보)">
          <Grid>
            <Field name="leaderName" label="이름" autoComplete="name" />
            <Field name="leaderOrg" label="소속" autoComplete="organization" />
            <Field
              name="leaderEmail"
              label="이메일"
              type="email"
              autoComplete="email"
            />
            <Field
              name="leaderPhone"
              label="연락처"
              placeholder="010-0000-0000"
              autoComplete="tel"
              inputMode="numeric"
              maxLength={13}
              onChange={(e) => {
                e.currentTarget.value = formatPhoneNumber(
                  e.currentTarget.value,
                );
              }}
            />
            <Field
              name="leaderBirthDate"
              label="생년월일"
              placeholder="예: 260101"
              inputMode="numeric"
              maxLength={6}
              onChange={(e) => {
                e.currentTarget.value = e.currentTarget.value
                  .replace(/\D/g, '')
                  .slice(0, 6);
              }}
            />
            <Field
              name="leaderResidence"
              label="거주지"
              placeholder="예: 부산"
              autoComplete="address-level1"
            />
          </Grid>
          <GenderField name="leaderGender" legend="성별" />
        </Section>
        {
          <Section title="신청 서류 첨부">
            <div className="flex flex-col gap-2 rounded-[10px] border border-[#e5e5e5] px-4 py-2">
              {files.map((file, i) => (
                <div
                  key={i}
                  className={`motion-list-item flex items-center justify-between gap-3 py-2.5 ${
                    i > 0 ? 'border-t border-[#e5e5e5]' : ''
                  }`}
                >
                  <p className="truncate text-sm text-[#111]">{file.name}</p>
                  <button
                    type="button"
                    className="motion-control shrink-0 text-[13px] font-semibold text-[#176f9f] hover:underline"
                    onClick={() => removeFile(i)}
                  >
                    삭제
                  </button>
                </div>
              ))}

              <div
                className={`flex items-center justify-between py-2 ${
                  files.length > 0 ? 'border-t border-[#e5e5e5]' : ''
                }`}
              >
                <p className="text-xs font-semibold text-[#111]">
                  {files.length}개 파일 첨부됨
                </p>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="brand-gradient motion-control rounded-[10px] px-3 py-2 text-sm font-bold text-white"
                >
                  파일 추가
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={onFilesSelected}
            />
          </Section>
        }
        <Section title="개인정보 동의">
          <Check name="privacyAgreed">
            <Link
              className="font-bold text-[#176f9f] underline underline-offset-4"
              href="/privacy"
              target="_blank"
            >
              개인정보처리방침
            </Link>
            을 확인했으며 개인정보 수집·이용에 동의합니다.
          </Check>
        </Section>
        <button
          disabled={busy}
          aria-busy={busy}
          className="brand-gradient motion-control mt-2 min-h-14 rounded-[8px] px-5 py-4 font-bold text-white disabled:bg-[#b0b8c1] disabled:hover:bg-[#b0b8c1]"
        >
          {busy ? '제출 중…' : '참가 신청 제출'}
        </button>
      </form>
    </div>
  );
}
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="service-card motion-section flex flex-col gap-5 rounded-2xl p-5 sm:p-7">
      <h2 className="text-xl font-extrabold tracking-[-0.025em] text-[#191f28]">
        {title}
      </h2>
      {children}
    </section>
  );
}
function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}
function Label({
  text,
  children,
}: {
  text: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-bold text-[#333d4b]">{text}</span>
      {children}
    </label>
  );
}
function Field({
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  autoComplete,
  inputMode,
  maxLength,
}: {
  name: string;
  label: string;
  type?: string;
  placeholder?: string;
  value?: string;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  autoComplete?: React.HTMLInputAutoCompleteAttribute;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
}) {
  return (
    <Label text={label}>
      <input
        required
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        inputMode={inputMode}
        maxLength={maxLength}
        className={fieldClass}
      />
    </Label>
  );
}
function Dropdown({
  name,
  label,
  values,
  columns = 2,
  onSelect,
  disabled = false,
}: {
  name: string;
  label: string;
  values: readonly string[];
  columns?: 1 | 2;
  onSelect?: (value: string) => void;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('');
  const rootRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    function onDocClick(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('click', onDocClick);
    return () => document.removeEventListener('click', onDocClick);
  }, [open]);
  return (
    <Label text={label}>
      <div ref={rootRef} className="relative">
        <button
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className={`${fieldClass} flex items-center justify-between text-left hover:bg-[#f5f5f5]`}
        >
          <span className={value ? '' : 'text-[#b9b9b9]'}>
            {value || '선택하세요'}
          </span>
          <span
            aria-hidden
            className={`ml-2 text-[#176f9f] transition-transform ${open ? 'rotate-180' : ''}`}
          >
            ▼
          </span>
        </button>
        <input type="hidden" name={name} value={value} />
        {open && (
          <div
            role="listbox"
            aria-label={label}
            className={`absolute top-full right-0 left-0 z-10 mt-1 grid gap-1 rounded-[6px] border border-[#e5e8eb] bg-white p-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)] ${columns === 2 ? 'grid-cols-2' : 'grid-cols-1'}`}
          >
            {values.map((v) => {
              const selected = value === v;
              return (
                <button
                  key={v}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    setValue(v);
                    onSelect?.(v);
                    setOpen(false);
                  }}
                  className={`min-h-10 rounded-[8px] px-3 py-2 text-left text-sm ${
                    selected
                      ? 'bg-[#176f9f]/10 font-medium text-[#176f9f]'
                      : 'text-[#111] hover:bg-[#f5f5f5]'
                  }`}
                >
                  {v}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </Label>
  );
}
function GenderField({ name, legend }: { name: string; legend: string }) {
  return (
    <fieldset className="flex flex-col gap-2">
      <legend className="text-sm font-bold text-[#333d4b]">{legend}</legend>
      <div className="flex gap-4">
        {GENDERS.map((g, index) => (
          <label className="flex items-center gap-2 text-sm" key={g}>
            <input
              required={index === 0}
              type="radio"
              name={name}
              value={g}
              className="size-4"
            />
            {g}
          </label>
        ))}
      </div>
    </fieldset>
  );
}
function Check({
  name,
  text,
  children,
}: {
  name: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <label className="flex gap-3 text-sm">
      <input required name={name} type="checkbox" className="size-5" />
      <span>{children ?? text}</span>
    </label>
  );
}
