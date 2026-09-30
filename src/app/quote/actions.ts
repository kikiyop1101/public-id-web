'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateLead } from '@/lib/leads'
import { clientIp, rateLimited } from '@/lib/rate-limit'
import { notifyLead } from '@/lib/notify'
import { site } from '@/lib/site'

export type LeadFormState = { error?: string; ok?: boolean }

const SAVE_FAILED =
  `접수하지 못했습니다. 잠시 후 다시 신청해 주시거나 ${site.email}으로 보내 주세요.`

export async function createLead(
  _prev: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  // 허니팟: 봇이 채우는 숨김 필드. 값이 있으면 조용히 무시(성공한 척). 게시판과 동일.
  if (formData.get('company')) return { ok: true }

  const { error, lead } = validateLead({
    kind: String(formData.get('kind') ?? ''),
    name: String(formData.get('name') ?? ''),
    org: String(formData.get('org') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    product: String(formData.get('product') ?? ''),
    message: String(formData.get('message') ?? ''),
    utm: String(formData.get('utm') ?? ''),
  })
  if (error || !lead) return { error }

  // 속도 제한 — IP당 10분 5회(저장·알림까지 가는 신청만 센다). 허니팟만으로는 스크립트 반복을 못 막는다.
  if (rateLimited(`lead:${clientIp(await headers())}`, 5, 600_000)) {
    return { error: `신청이 연달아 접수되어 잠시 막았습니다. 10분 뒤 다시 시도하시거나 ${site.email}으로 보내 주세요.` }
  }

  // leads 테이블은 RLS 정책이 없어 anon이 접근할 수 없다 — service_role로만 쓴다.
  // 클라이언트 생성(env 누락)까지 try 안에 둔다 — 던지면 폼 대신 오류 화면이 떠서 입력이 사라진다.
  try {
    const { error: dbError } = await createAdminClient().from('leads').insert(lead)
    if (dbError) throw new Error(dbError.message)
  } catch (err) {
    console.error('lead save failed:', err)
    return { error: SAVE_FAILED }
  }

  // 실시간 알림(라온→대표 텔레그램) — 실패해도 접수는 이미 완료된 상태.
  await notifyLead(lead)

  revalidatePath('/admin')
  return { ok: true }
}
