// 접수 마감: 현재 마감일 없음(상시 접수). 마감을 다시 설정하려면
// 예: new Date('2026-10-31T18:00:00+09:00') (Asia/Seoul)
export const APPLICATION_DEADLINE: Date | null = null;

// 마감 직전에 제출 버튼을 눌렀지만 업로드가 끝나지 않아 마감 이후 도착한
// 요청을 받아 주기 위한 유예 시간. 이 시간 안에 도착한 신청은 접수하되
// 지각으로 표시한다.
export const LATE_SUBMISSION_GRACE_MS = 10 * 60 * 1000;

export const APPLICATION_CLOSED_PATH = '/apply/closed';

export function isApplicationClosed(now: Date = new Date()) {
  if (!APPLICATION_DEADLINE) return false;
  return now.getTime() >= APPLICATION_DEADLINE.getTime();
}

export function isPastLateSubmissionGrace(now: Date = new Date()) {
  if (!APPLICATION_DEADLINE) return false;
  return (
    now.getTime() >= APPLICATION_DEADLINE.getTime() + LATE_SUBMISSION_GRACE_MS
  );
}

export function isLateApplication(createdAt: string | Date) {
  if (!APPLICATION_DEADLINE) return false;
  const date = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  return date.getTime() > APPLICATION_DEADLINE.getTime();
}
