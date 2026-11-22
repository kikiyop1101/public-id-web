'use server'

import crypto from 'node:crypto'
import { cookies, headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { ADMIN_KEY, LINKS_COOKIE, linksSessionValue } from '@/lib/clientLinks'
import { clientIp, rateLimited } from '@/lib/rate-limit'

export type UnlockState = { error?: string }

function sameKey(a: string, b: string): boolean {
  const ha = crypto.createHash('sha256').update(a).digest()
  const hb = crypto.createHash('sha256').update(b).digest()
  return crypto.timingSafeEqual(ha, hb)
}

// 관리자 키는 POST 본문으로만 오간다 — 주소·접속 로그·방문 기록에 남지 않는다.
export async function unlockLinks(_prev: UnlockState, formData: FormData): Promise<UnlockState> {
  const ip = clientIp(await headers())
  if (rateLimited(`links-unlock:${ip}`, 5, 600_000)) {
    return { error: '시도가 많습니다. 잠시 후 다시 시도해 주세요.' }
  }
  if (!sameKey(String(formData.get('key') ?? ''), ADMIN_KEY)) {
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { error: '관리자 키가 올바르지 않습니다.' }
  }
  const store = await cookies()
  store.set(LINKS_COOKIE, linksSessionValue(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/safety-map/links',
    maxAge: 60 * 60 * 8,
  })
  redirect('/safety-map/links')
}
