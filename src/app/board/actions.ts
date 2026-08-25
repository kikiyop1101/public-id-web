'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { hashPassword } from '@/lib/hash'

export type BoardFormState = { error?: string; ok?: boolean }

export async function createBoardPost(
  _prev: BoardFormState,
  formData: FormData,
): Promise<BoardFormState> {
  // 허니팟: 봇이 채우는 숨김 필드. 값이 있으면 조용히 무시(성공한 척).
  if (formData.get('company')) return { ok: true }

  const nickname = String(formData.get('nickname') ?? '').trim()
  const password = String(formData.get('password') ?? '')
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()

  if (!nickname || !password || !title || !body) {
    return { error: '모든 항목을 입력해 주세요.' }
  }
  if (password.length < 4) {
    return { error: '비밀번호는 4자 이상이어야 합니다.' }
  }

  // 작성 즉시 공개. DB에 구버전 트리거(강제 pending)가 남아 있어도 공개되도록
  // service_role로 insert 후 status를 명시적으로 approved로 확정한다.
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('board_posts')
    .insert({
      nickname,
      password_hash: hashPassword(password),
      title,
      body,
    })
    .select('id')
    .single()

  if (error || !data) {
    return { error: '등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }

  await supabase.from('board_posts').update({ status: 'approved' }).eq('id', data.id)

  revalidatePath('/board')
  return { ok: true }
}
