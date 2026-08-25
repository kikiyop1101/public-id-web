'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { REPORT_CATEGORIES, validateReport } from '@/lib/reports'

export type ReportFormState = { error?: string; ok?: boolean }

const MAX_PHOTOS = 3
const MAX_PHOTO_BYTES = 2 * 1024 * 1024 // 클라이언트가 압축해 오지만 서버에서도 상한

export async function createReport(
  _prev: ReportFormState,
  formData: FormData,
): Promise<ReportFormState> {
  // 허니팟 — 게시판·리드와 동일
  if (formData.get('company')) return { ok: true }

  const { error, report } = validateReport({
    category: String(formData.get('category') ?? ''),
    description: String(formData.get('description') ?? ''),
    lat: String(formData.get('lat') ?? ''),
    lng: String(formData.get('lng') ?? ''),
    addr: String(formData.get('addr') ?? ''),
    reporter_name: String(formData.get('reporter_name') ?? ''),
    reporter_contact: String(formData.get('reporter_contact') ?? ''),
  })
  if (error || !report) return { error }

  const files = formData
    .getAll('photos')
    .filter((entry): entry is File => entry instanceof File && entry.size > 0)
    .slice(0, MAX_PHOTOS)
  if (files.length === 0) {
    return { error: '현장 사진을 1장 이상 올려주세요.' }
  }
  if (files.some((file) => file.size > MAX_PHOTO_BYTES)) {
    return { error: '사진 용량이 너무 큽니다. 다시 시도해 주세요.' }
  }

  const supabase = createAdminClient()

  // 행을 먼저 만들어 id를 얻고, 사진을 그 폴더에 올린 뒤 경로를 채운다.
  const { data: row, error: insertError } = await supabase
    .from('reports')
    .insert(report)
    .select('id')
    .single()
  if (insertError || !row) {
    return { error: '접수 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.' }
  }

  const paths: string[] = []
  for (const [index, file] of files.entries()) {
    const path = `${row.id}/${index + 1}.jpg`
    const { error: uploadError } = await supabase.storage
      .from('reports')
      .upload(path, file, { contentType: 'image/jpeg', upsert: true })
    if (!uploadError) paths.push(path)
  }
  if (paths.length === 0) {
    await supabase.from('reports').delete().eq('id', row.id)
    return { error: '사진 업로드에 실패했습니다. 잠시 후 다시 시도해 주세요.' }
  }
  await supabase.from('reports').update({ photos: paths }).eq('id', row.id)

  await notifyReportTelegram(report.category, report.addr, report.description)

  revalidatePath('/admin')
  return { ok: true }
}

/** 제보 접수 텔레그램 알림 — 리드 알림과 같은 헤르메스 웹훅. 실패해도 접수 무영향. */
async function notifyReportTelegram(
  category: keyof typeof REPORT_CATEGORIES,
  addr: string | null,
  description: string,
): Promise<void> {
  const secret = process.env.HERMES_WEBHOOK_SECRET
  if (!secret) return
  const { createHmac } = await import('node:crypto')
  const url =
    process.env.HERMES_WEBHOOK_URL ?? 'https://kanban.public-id.co.kr/webhooks/inquiry'
  const payload = JSON.stringify({
    event: 'inquiry',
    name: `[안전 리포트 제보] ${REPORT_CATEGORIES[category]}`,
    contact: addr ?? '위치는 지도 핀 참조',
    message: `${description}\n\n승인·관리: https://www.public-id.co.kr/admin`,
    source: 'public-id.co.kr 우리 학교 앞 안전 리포트',
  })
  const sig = 'sha256=' + createHmac('sha256', secret).update(payload, 'utf8').digest('hex')
  try {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), 4000)
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Hub-Signature-256': sig },
      body: payload,
      signal: ac.signal,
    })
    clearTimeout(timer)
  } catch (err) {
    console.error('report notify failed:', err)
  }
}
