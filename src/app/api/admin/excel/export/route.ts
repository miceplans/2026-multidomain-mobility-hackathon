import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { requireAdmin } from '@/lib/admin-auth';
import { createAdminClient } from '@/lib/supabase/admin';
import { jsonError } from '@/lib/http';
import { escapeSpreadsheetFormula } from '@/lib/output-safety';
import { formatKoreanDateTime } from '@/lib/date-format';
const headers = [
  '접수번호',
  '팀명',
  '구분',
  '기업 소재지',
  '기업 산업 분야',
  '기업 코드',
  '팀장이름',
  '팀장소속',
  '팀장이메일',
  '팀장연락처',
  '팀장생년월일',
  '팀장성별',
  '거주지',
  '첨부파일수',
  '요청사항',
  '신청일시',
  '최종수정일시',
];
type ExportRow = {
  receipt_number: string;
  team_name: string;
  applicant_type: string | null;
  company_region: string | null;
  company_industry: string | null;
  company_code: string | null;
  leader_name: string;
  leader_org: string;
  leader_email: string;
  leader_phone: string;
  leader_birth_date: string;
  leader_gender: string;
  leader_residence: string;
  requests: string | null;
  created_at: string;
  updated_at: string;
  application_files: { count: number }[];
};
export async function GET(request: NextRequest) {
  if (!(await requireAdmin()))
    return jsonError('관리자 로그인이 필요합니다.', 401);
  const ids = request.nextUrl.searchParams
    .get('ids')
    ?.split(',')
    .filter(Boolean);
  let q = createAdminClient()
    .from('applications')
    .select(
      'id,receipt_number,team_name,applicant_type,company_region,company_industry,company_code,leader_name,leader_org,leader_email,leader_phone,leader_birth_date,leader_gender,leader_residence,requests,created_at,updated_at,application_files(count)',
    )
    .order('created_at', { ascending: false });
  if (ids?.length) q = q.in('id', ids);
  const { data, error } = await q;
  if (error) return jsonError('엑셀 데이터를 만들 수 없습니다.', 500);
  const rows = ((data ?? []) as ExportRow[]).map((v) => {
    return [
      v.receipt_number,
      v.team_name,
      v.applicant_type ?? '',
      v.company_region ?? '',
      v.company_industry ?? '',
      v.company_code ?? '',
      v.leader_name,
      v.leader_org,
      v.leader_email,
      v.leader_phone,
      v.leader_birth_date,
      v.leader_gender,
      v.leader_residence,
      v.application_files?.[0]?.count ?? 0,
      v.requests ?? '',
      formatKoreanDateTime(v.created_at),
      formatKoreanDateTime(v.updated_at),
    ];
  });
  const safeRows = rows.map((row) => row.map(escapeSpreadsheetFormula));
  const sheet = XLSX.utils.aoa_to_sheet([headers, ...safeRows]);
  const book = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(book, sheet, '신청목록');
  const body = XLSX.write(book, { type: 'buffer', bookType: 'xlsx' });
  return new NextResponse(body, {
    headers: {
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="applications-${new Date().toISOString().slice(0, 10)}.xlsx"`,
    },
  });
}
