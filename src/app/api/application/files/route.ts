import { NextRequest, NextResponse } from 'next/server';
import { getApplicationId } from '@/lib/application-session';
import { getSettings, applicationEditable } from '@/lib/settings';
import {
  registerUploadedFiles,
  uploadedFilesSchema,
  UploadVerificationError,
} from '@/lib/files';
import { jsonError, validationError } from '@/lib/http';
import { invalidateApplicationList } from '@/lib/admin-application-list';

// 증빙자료 추가 2단계: Storage에 직접 올린 파일을 확인하고 등록한다.
export async function POST(request: NextRequest) {
  const applicationId = await getApplicationId();
  if (!applicationId) return jsonError('로그인이 필요합니다.', 401);
  const settings = await getSettings();
  if (!applicationEditable(settings))
    return jsonError('현재 증빙자료를 변경할 수 없습니다.', 403);
  let body: { files?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonError('요청 형식이 올바르지 않습니다.');
  }
  const files = uploadedFilesSchema.safeParse(body.files);
  if (!files.success) return validationError(files.error);
  try {
    await registerUploadedFiles(applicationId, applicationId, files.data);
    invalidateApplicationList();
    return NextResponse.json({ ok: true });
  } catch (error) {
    if (error instanceof UploadVerificationError)
      return jsonError(error.message, 422);
    return jsonError('증빙자료를 저장할 수 없습니다.', 500);
  }
}
