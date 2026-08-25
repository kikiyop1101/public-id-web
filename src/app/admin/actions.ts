'use server'

import { cookies } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createAdminClient } from '@/lib/supabase/admin'
import { ADMIN_COOKIE, checkPassword, isAuthed } from '@/lib/auth'
import { validateReport } from '@/lib/reports'
import { isRaw, textArray } from '@/lib/rows'

export type AuthState = { error?: string }

export async function signIn(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const pw = String(formData.get('password') ?? '')
  if (!checkPassword(pw)) return { error: '비밀번호가 올바르지 않습니다.' }

  const store = await cookies()
  store.set(ADMIN_COOKIE, process.env.ADMIN_SESSION_TOKEN ?? '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 8, // 8시간
  })
  redirect('/admin')
}

export async function signOut(): Promise<void> {
  const store = await cookies()
  store.delete(ADMIN_COOKIE)
  redirect('/admin/login')
}

// 아래는 관리자 전용 — server action은 미들웨어를 항상 거치지 않을 수 있으므로 재확인.
async function requireAdmin() {
  if (!(await isAuthed())) redirect('/admin/login')
}

// 게시판은 즉시 공개 체제 — 관리자는 문제 글을 사후 삭제한다.
export async function deletePostAdmin(id: string): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  await admin.from('board_posts').delete().eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/board')
}

export async function deleteBlogPost(id: string): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  await admin.from('blog_posts').delete().eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/blog')
}

// 리드(구독·견적 신청) 관리 — 연락 완료 표시와 삭제만 지원한다.
export async function updateLeadStatus(id: string, status: string): Promise<void> {
  await requireAdmin()
  if (!['new', 'contacted', 'closed'].includes(status)) return
  const admin = createAdminClient()
  await admin.from('leads').update({ status }).eq('id', id)
  revalidatePath('/admin')
}

export async function deleteLead(id: string): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  await admin.from('leads').delete().eq('id', id)
  revalidatePath('/admin')
}

// 안전 리포트(제보) 관리 — 승인 시 공개 표시명(동 단위)을 함께 기록한다.
export async function approveReport(id: string, formData: FormData): Promise<void> {
  await requireAdmin()
  const publicLabel = String(formData.get('public_label') ?? '')
    .trim()
    .slice(0, 60)
  const admin = createAdminClient()
  await admin
    .from('reports')
    .update({ status: 'approved', public_label: publicLabel || null })
    .eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/safety-report')
}

export async function rejectReport(id: string): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  await admin.from('reports').update({ status: 'rejected' }).eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/safety-report')
}

// 시공 사례(showcase) 등록 — 지도 콜드스타트를 우리 실적으로 채우는 시딩 도구.
// 제보와 같은 reports 테이블을 쓰되 kind='showcase' + 승인 상태로 바로 들어간다.
export type ShowcaseState = { error?: string; ok?: boolean }

export async function createShowcase(
  _prev: ShowcaseState,
  formData: FormData,
): Promise<ShowcaseState> {
  await requireAdmin()

  const { error, report } = validateReport({
    category: String(formData.get('category') ?? ''),
    description: String(formData.get('description') ?? ''),
    lat: String(formData.get('lat') ?? ''),
    lng: String(formData.get('lng') ?? ''),
    addr: String(formData.get('addr') ?? ''),
    reporter_name: '',
    reporter_contact: '',
  })
  if (error || !report) return { error }

  const publicLabel = String(formData.get('public_label') ?? '').trim().slice(0, 60)
  if (!publicLabel) return { error: '공개 표시명을 입력해 주세요. (예: 세종시 보람동)' }
  if (report.lat === null || report.lng === null) {
    return { error: '지도에서 시공 위치에 핀을 찍어주세요.' }
  }

  const files = formData
    .getAll('photos')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, 3)
  if (files.length === 0) return { error: '현장 사진을 1장 이상 올려주세요.' }

  const admin = createAdminClient()
  const { data: row, error: insertError } = await admin
    .from('reports')
    .insert({ ...report, kind: 'showcase', status: 'approved', public_label: publicLabel })
    .select('id')
    .single()
  if (insertError || !row) return { error: '등록 중 오류가 발생했습니다.' }

  const paths: string[] = []
  for (const [index, file] of files.entries()) {
    const path = `${row.id}/${index + 1}.jpg`
    const { error: uploadError } = await admin.storage
      .from('reports')
      .upload(path, file, { contentType: 'image/jpeg', upsert: true })
    if (!uploadError) paths.push(path)
  }
  if (paths.length === 0) {
    await admin.from('reports').delete().eq('id', row.id)
    return { error: '사진 업로드에 실패했습니다.' }
  }
  await admin.from('reports').update({ photos: paths }).eq('id', row.id)

  revalidatePath('/admin')
  revalidatePath('/safety-report')
  return { ok: true }
}

export async function deleteReport(id: string): Promise<void> {
  await requireAdmin()
  const admin = createAdminClient()
  const { data: row } = await admin.from('reports').select('photos').eq('id', id).single()
  // 스토리지 remove()에 문자열이 아닌 값이 섞이면 삭제가 통째로 실패한다.
  const photos = isRaw(row) ? textArray(row, 'photos') : []
  if (photos.length > 0) await admin.storage.from('reports').remove(photos)
  await admin.from('reports').delete().eq('id', id)
  revalidatePath('/admin')
  revalidatePath('/safety-report')
}

// postimg 등에서 복사한 Markdown·BBCode·HTML 조각을 붙여넣어도 실제 이미지 파일 주소만 골라낸다.
function extractImageUrl(raw: string): string | null {
  const urls = raw.match(/https?:\/\/[^\s"'<>\])]+/g) ?? []
  return urls.find((u) => /\.(png|jpe?g|gif|webp|avif)(\?.*)?$/i.test(u)) ?? urls[0] ?? null
}

export type BlogState = { error?: string; ok?: boolean }

export async function createBlogPost(_prev: BlogState, formData: FormData): Promise<BlogState> {
  await requireAdmin()
  const title = String(formData.get('title') ?? '').trim()
  const body = String(formData.get('body') ?? '').trim()
  const cover_image = extractImageUrl(String(formData.get('cover_image') ?? ''))
  const published = formData.get('published') === 'on'

  if (!title || !body) return { error: '제목·내용은 필수입니다.' }

  // 슬러그는 글 주소(/blog/xxx)용으로만 쓰이므로 자동 생성한다(중복 없는 짧은 값).
  const slug = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`

  const admin = createAdminClient()
  const { error } = await admin
    .from('blog_posts')
    .insert({ title, slug, body, cover_image, published })

  if (error) {
    return { error: '저장 중 오류가 발생했습니다.' }
  }

  revalidatePath('/admin')
  revalidatePath('/blog')
  return { ok: true }
}
