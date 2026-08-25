'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { validateLead } from '@/lib/leads'
import { notifyLead } from '@/lib/notify'

export type LeadFormState = { error?: string; ok?: boolean }

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
  })
  if (error || !lead) return { error }

  // leads 테이블은 RLS 정책이 없어 anon이 접근할 수 없다 — service_role로만 쓴다.
  const supabase = createAdminClient()
  const { error: dbError } = await supabase.from('leads').insert(lead)
  if (dbError) {
    return { error: '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }

  // 실시간 알림(라온→대표 텔레그램) — 실패해도 접수는 이미 완료된 상태.
  await notifyLead(lead)

  revalidatePath('/admin')
  return { ok: true }
}
