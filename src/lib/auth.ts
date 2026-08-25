import { cookies } from 'next/headers'

export const ADMIN_COOKIE = 'pg_admin'

// 로그인 비밀번호 확인
export function checkPassword(pw: string): boolean {
  const real = process.env.ADMIN_PASSWORD
  return !!real && pw === real
}

// 현재 요청이 관리자 세션인지(쿠키의 토큰이 서버 토큰과 일치)
export async function isAuthed(): Promise<boolean> {
  const store = await cookies()
  const token = store.get(ADMIN_COOKIE)?.value
  return !!token && token === process.env.ADMIN_SESSION_TOKEN
}
