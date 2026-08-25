// 안전 리포트(제보) 공통 타입·검증 — 서버 액션·화면·테스트가 함께 쓴다.

import { isRaw, numOrNull, text, textArray, textOrNull } from '@/lib/rows'

export const REPORT_CATEGORIES = {
  crosswalk: '횡단보도 앞 대기 공간',
  bollard: '볼라드·차단 시설',
  road: '노면 표시·바닥',
  other: '기타 위험 요인',
} as const

export type ReportCategory = keyof typeof REPORT_CATEGORIES

export type ReportRow = {
  id: string
  kind: 'report' | 'showcase'
  category: string
  description: string
  lat: number | null
  lng: number | null
  addr: string | null
  public_label: string | null
  photos: string[]
  status: string
  created_at: string
}

/** 관리자 목록용 행 — 지도에 안 쓰는 좌표 대신 제보자 정보를 본다. */
export type ReportAdminRow = {
  id: string
  kind: string
  category: string
  description: string
  addr: string | null
  public_label: string | null
  photos: string[]
  reporter_name: string | null
  reporter_contact: string | null
  status: string
  created_at: string
}

/** 두 행이 공유하는 부분 — 없으면 행을 버린다. */
function parseReportBase(raw: unknown) {
  if (!isRaw(raw)) return null
  const id = text(raw, 'id')
  const kind = text(raw, 'kind')
  const category = text(raw, 'category')
  const description = text(raw, 'description')
  const status = text(raw, 'status')
  const created_at = text(raw, 'created_at')
  if (
    id === undefined ||
    kind === undefined ||
    category === undefined ||
    description === undefined ||
    status === undefined ||
    created_at === undefined
  ) {
    return null
  }
  return {
    raw,
    row: {
      id,
      kind,
      category,
      description,
      status,
      created_at,
      addr: textOrNull(raw, 'addr'),
      public_label: textOrNull(raw, 'public_label'),
      // photos가 null로 바뀌어도 .length·[0] 접근이 죽지 않도록 항상 배열이다.
      photos: textArray(raw, 'photos'),
    },
  }
}

export function parseReportRow(raw: unknown): ReportRow | null {
  const base = parseReportBase(raw)
  if (base === null) return null
  const kind = base.row.kind === 'showcase' ? 'showcase' : 'report'
  return {
    ...base.row,
    kind,
    lat: numOrNull(base.raw, 'lat'),
    lng: numOrNull(base.raw, 'lng'),
  }
}

export function parseReportAdminRow(raw: unknown): ReportAdminRow | null {
  const base = parseReportBase(raw)
  if (base === null) return null
  return {
    ...base.row,
    reporter_name: textOrNull(base.raw, 'reporter_name'),
    reporter_contact: textOrNull(base.raw, 'reporter_contact'),
  }
}

export type ReportInput = {
  category: string
  description: string
  lat: string
  lng: string
  addr: string
  reporter_name: string
  reporter_contact: string
}

export type ReportRecord = {
  category: ReportCategory
  description: string
  lat: number | null
  lng: number | null
  addr: string | null
  reporter_name: string | null
  reporter_contact: string | null
}

/** 공개 지도용 좌표 뭉개기 — 소수 3자리(약 110m)로 반올림해 정확 위치를 숨긴다. */
export function blurCoord(value: number): number {
  return Math.round(value * 1000) / 1000
}

export function validateReport(input: ReportInput): { error?: string; report?: ReportRecord } {
  const category = input.category.trim()
  const description = input.description.trim()
  const addr = input.addr.trim()
  const lat = Number.parseFloat(input.lat)
  const lng = Number.parseFloat(input.lng)
  const hasPin = Number.isFinite(lat) && Number.isFinite(lng)

  if (!(category in REPORT_CATEGORIES)) return { error: '위험 유형을 선택해 주세요.' }
  if (!description) return { error: '어떤 점이 위험한지 설명을 입력해 주세요.' }
  if (!hasPin && !addr) return { error: '지도에 핀을 찍거나 위치 설명을 입력해 주세요.' }
  // 대한민국 대략 범위 밖 핀은 거절(전국 오픈, 해외·바다 한가운데 방지)
  if (hasPin && (lat < 33 || lat > 39 || lng < 124 || lng > 132)) {
    return { error: '지도 핀 위치를 다시 확인해 주세요.' }
  }

  return {
    report: {
      category: category as ReportCategory,
      description: description.slice(0, 2000),
      lat: hasPin ? lat : null,
      lng: hasPin ? lng : null,
      addr: addr.slice(0, 200) || null,
      reporter_name: input.reporter_name.trim().slice(0, 50) || null,
      reporter_contact: input.reporter_contact.trim().slice(0, 100) || null,
    },
  }
}
