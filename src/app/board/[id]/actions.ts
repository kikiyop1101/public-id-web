'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'
import { verifyOwner } from '@/lib/hash'

export type DeleteState = { error?: string }

// 본인 비밀번호 확인 후 삭제. 삭제는 RLS 정책이 없으므로 service_role(admin)로 수행.
export async function deleteBoardPost(
  id: string,
  _prev: DeleteState,
  formData: FormData,
): Promise<DeleteState> {
  const password = String(formData.get('password') ?? '')
  const admin = createAdminClient()

  const { data } = await admin
    .from('board_posts')
    .select('password_hash')
    .eq('id', id)
    .single()

  if (!data || !verifyOwner(data.password_hash, password)) {
    return { error: '비밀번호가 일치하지 않습니다.' }
  }

  await admin.from('board_posts').delete().eq('id', id)
  revalidatePath('/board')
  redirect('/board')
}

export type CommentFormState = { error?: string; ok?: boolean }

// 답글·대댓글 등록. parent_id가 있으면 대댓글.
export async function createBoardComment(
  postId: string,
  _prev: CommentFormState,
  formData: FormData,
): Promise<CommentFormState> {
  // 허니팟: 봇이 채우는 숨김 필드. 값이 있으면 조용히 무시(성공한 척).
  if (formData.get('company')) return { ok: true }

  const nickname = String(formData.get('nickname') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()
  const parentId = String(formData.get('parent_id') ?? '').trim() || null

  if (!nickname || !body) {
    return { error: '닉네임과 내용을 입력해 주세요.' }
  }

  const supabase = await createClient()
  const { error } = await supabase.from('board_comments').insert({
    post_id: postId,
    parent_id: parentId,
    nickname,
    body,
  })

  if (error) return { error: '등록 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }

  revalidatePath(`/board/${postId}`)
  return { ok: true }
}
