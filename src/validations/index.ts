import { z } from 'zod';
import { COMPANY_INDUSTRIES, ksicOptions } from '@/lib/ksic';
import { APPLICANT_TYPES, COMPANY_REGIONS, GENDERS } from '@/types';

const requiredText = (label: string, max: number) =>
  z.string().trim().min(1, `${label}을(를) 입력해 주세요.`).max(max);
const birthDateField = (label: string) =>
  z
    .string()
    .regex(
      /^\d{6}$/,
      `${label}을(를) 생년월일 6자리(예: 260101)로 입력해 주세요.`,
    );
const genderField = (label: string) =>
  z.enum(GENDERS, { error: `${label}을(를) 선택해 주세요.` });
export function normalizeTeamName(value: string) {
  return value
    .normalize('NFKC')
    .trim()
    .replace(/\s+/g, ' ')
    .toLocaleLowerCase('ko-KR');
}
export function phoneDigits(value: string) {
  return value.replace(/\D/g, '');
}
export function formatPhoneNumber(value: string) {
  const digits = phoneDigits(value).slice(0, 11);
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, digits.length - 4)}-${digits.slice(-4)}`;
}
export function phoneLastFour(value: string) {
  return phoneDigits(value).slice(-4);
}
const applicationBaseSchema = z.object({
  idempotencyKey: z.uuid(),
  applicantType: z.enum(APPLICANT_TYPES, {
    error: '기업/일반 구분을 선택해 주세요.',
  }),
  companyRegion: z.enum(COMPANY_REGIONS).nullish(),
  companyIndustry: z.enum(COMPANY_INDUSTRIES).nullish(),
  companyCode: z.string().trim().max(100).nullish(),
  teamName: requiredText('팀명', 100),
  leaderName: requiredText('팀장 이름', 50),
  leaderOrg: requiredText('팀장 소속', 100),
  leaderEmail: z.email('올바른 이메일 주소를 입력해 주세요.').max(254),
  leaderPhone: z
    .string()
    .regex(/^01[016789]-?\d{3,4}-?\d{4}$/, '올바른 연락처를 입력해 주세요.'),
  leaderBirthDate: birthDateField('팀장 생년월일'),
  leaderGender: genderField('팀장 성별'),
  leaderResidence: requiredText('거주지', 100),
  privacyAgreed: z.literal(true),
  requests: z.string().trim().max(2000).optional().default(''),
});
function validateCompany(
  data: {
    applicantType: string;
    companyRegion?: string | null;
    companyIndustry?: string | null;
    companyCode?: string | null;
  },
  context: z.RefinementCtx,
) {
  if (data.applicantType !== '기업') return;
  if (!data.companyRegion)
    context.addIssue({
      code: 'custom',
      path: ['companyRegion'],
      message: '기업 소재지(부산/울산/경남)를 선택해 주세요.',
    });
  if (!data.companyIndustry)
    context.addIssue({
      code: 'custom',
      path: ['companyIndustry'],
      message: '기업 산업 분야를 선택해 주세요.',
    });
  if (
    !data.companyCode ||
    !data.companyIndustry ||
    !ksicOptions(data.companyIndustry).includes(data.companyCode)
  )
    context.addIssue({
      code: 'custom',
      path: ['companyCode'],
      message: '기업 코드를 선택해 주세요.',
    });
}
export const applicationSchema =
  applicationBaseSchema.superRefine(validateCompany);
export const applicationUpdateSchema = applicationBaseSchema
  .omit({ idempotencyKey: true, privacyAgreed: true })
  .superRefine(validateCompany);
export const applicationLoginSchema = z.object({
  teamName: requiredText('팀명', 100),
  password: z.string().regex(/^\d{4}$/, '연락처 뒤 4자리를 입력해 주세요.'),
});
export const adminLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1).max(200),
});
export const adminSignupSchema = z
  .object({
    email: z.email('올바른 이메일 주소를 입력해 주세요.'),
    password: z
      .string()
      .min(8, '비밀번호는 8자 이상이어야 합니다.')
      .max(200, '비밀번호는 200자 이하여야 합니다.')
      .regex(/[A-Za-z]/, '비밀번호에 영문자를 포함해 주세요.')
      .regex(/[0-9]/, '비밀번호에 숫자를 포함해 주세요.'),
    passwordConfirm: z.string(),
  })
  .refine((value) => value.password === value.passwordConfirm, {
    path: ['passwordConfirm'],
    message: '비밀번호가 일치하지 않습니다.',
  });
export const bulkDownloadSchema = z.object({
  keys: z.array(z.string().min(1).max(512)).max(1000).optional(),
});
export type ApplicationInput = z.infer<typeof applicationSchema>;
