// 리드(구독 신청·맞춤 견적) 공통 타입·검증 — 서버 액션과 테스트가 함께 쓴다.

import { isRaw, text, textOrNull } from '@/lib/rows'

export const LEAD_KINDS = {
  design_sub: '디자인구독',
  safety_sub: '안전시설관리 구독',
  quote: '맞춤 견적',
  festival: '축제·행사 견적',
} as const

export type LeadKind = keyof typeof LEAD_KINDS

export type LeadInput = {
  kind: string
  name: string
  org: string
  email: string
  phone: string
  product: string
  message: string
}

export type LeadRecord = {
  kind: LeadKind
  name: string
  org: string | null
  email: string
  phone: string | null
  product: string | null
  message: string | null
}

/** 관리자 목록용 행(DB에서 읽은 값). kind는 화면에서 라벨로 풀 때 다시 확인한다. */
export type LeadRow = {
  id: string
  kind: string
  name: string
  org: string | null
  email: string
  phone: string | null
  product: string | null
  message: string | null
  status: string
  created_at: string
}

export function parseLeadRow(raw: unknown): LeadRow | null {
  if (!isRaw(raw)) return null
  const id = text(raw, 'id')
  const kind = text(raw, 'kind')
  const name = text(raw, 'name')
  const email = text(raw, 'email')
  const status = text(raw, 'status')
  const created_at = text(raw, 'created_at')
  if (
    id === undefined ||
    kind === undefined ||
    name === undefined ||
    email === undefined ||
    status === undefined ||
    created_at === undefined
  ) {
    return null
  }
  return {
    id,
    kind,
    name,
    email,
    status,
    created_at,
    org: textOrNull(raw, 'org'),
    phone: textOrNull(raw, 'phone'),
    product: textOrNull(raw, 'product'),
    message: textOrNull(raw, 'message'),
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/** 입력을 검증해 저장 가능한 레코드로 만든다. 실패하면 error만 돌려준다. */
export function validateLead(input: LeadInput): { error?: string; lead?: LeadRecord } {
  const kind = input.kind.trim()
  const name = input.name.trim()
  const email = input.email.trim()

  if (!(kind in LEAD_KINDS)) return { error: '신청 종류를 선택해 주세요.' }
  if (!name) return { error: '성함(담당자명)을 입력해 주세요.' }
  if (!email || !EMAIL_RE.test(email)) return { error: '회신받을 이메일 주소를 확인해 주세요.' }
  if (kind === 'quote' && !input.message.trim()) {
    return { error: '필요한 규격·수량 등 요청 내용을 입력해 주세요.' }
  }

  return {
    lead: {
      kind: kind as LeadKind,
      name: name.slice(0, 50),
      org: input.org.trim().slice(0, 100) || null,
      email: email.slice(0, 100),
      phone: input.phone.trim().slice(0, 30) || null,
      product: input.product.trim().slice(0, 100) || null,
      message: input.message.trim().slice(0, 2000) || null,
    },
  }
}
