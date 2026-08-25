import { createHmac } from 'node:crypto'
import { LEAD_KINDS, type LeadRecord } from '@/lib/leads'

// 리드 접수 실시간 릴레이 — 헤르메스 영업봇(라온) 웹훅으로 중계해 대표 텔레그램까지 간다.
// 본사이트 public-id-web /api/inquiry-relay와 동일 규격(HMAC sha256, X-Hub-Signature-256).
// 정본 수신 경로는 /admin 리드 목록이고 이것은 보조 알림 — 어떤 실패에도 접수 UX를 깨지 않는다.

const WEBHOOK_URL =
  process.env.HERMES_WEBHOOK_URL ?? 'https://kanban.public-id.co.kr/webhooks/inquiry'

// 이메일 알림은 서버에서 못 보낸다 — Web3Forms 무료 플랜이 서버측 호출을 거부(실측 2026-08-05
// "This method is not allowed. Use our API in client side"). 본사이트 문의폼처럼
// 브라우저(LeadForm)에서 접수 성공 후 발사한다.

/** 텔레그램 알림(헤르메스 웹훅 → 라온 → 대표). 실패해도 접수에 영향 없음. */
async function notifyLeadTelegram(lead: LeadRecord): Promise<void> {
  const secret = process.env.HERMES_WEBHOOK_SECRET
  if (!secret) return // 미설정이면 조용히 건너뛴다(스토어 무영향)

  const payload = JSON.stringify({
    event: 'inquiry',
    name: `[${LEAD_KINDS[lead.kind]}] ${lead.name}${lead.org ? ` · ${lead.org}` : ''}`,
    contact: [lead.email, lead.phone].filter(Boolean).join(' · '),
    message: [lead.product ? `관심 제품: ${lead.product}` : '', lead.message ?? '']
      .filter(Boolean)
      .join('\n'),
    source: 'public-id.co.kr 구독·견적 신청',
  })

  const sig = 'sha256=' + createHmac('sha256', secret).update(payload, 'utf8').digest('hex')

  try {
    const ac = new AbortController()
    const timer = setTimeout(() => ac.abort(), 4000)
    await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Hub-Signature-256': sig,
      },
      body: payload,
      signal: ac.signal,
    })
    clearTimeout(timer)
  } catch (err) {
    // 릴레이 실패는 /admin 목록이 있으므로 치명적이지 않다 — 기록만 남긴다.
    console.error('lead notify failed:', err)
  }
}

/** 접수 알림 발송(서버 측 = 텔레그램). 이메일은 클라이언트(LeadForm)가 맡는다. */
export async function notifyLead(lead: LeadRecord): Promise<void> {
  await notifyLeadTelegram(lead)
}
