import { cookies } from 'next/headers'
import { safeEqual } from '@/lib/safe-equal'

export const ADMIN_COOKIE = 'pg_admin'

// 로그인 비밀번호 확인(상수시간 비교 — 미설정·빈 값이면 false)
export function checkPassword(pw: string): boolean {
  return safeEqual(pw, process.env.ADMIN_PASSWORD)
}

// 현재 요청이 관리자 세션인지(쿠키의 토큰이 서버 토큰과 일치)
export async function isAuthed(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  return safeEqual(token, process.env.ADMIN_SESSION_TOKEN)
}
