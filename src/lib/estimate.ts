// 견적 시뮬레이터(/estimate) 계산 정본 — 순수 함수만. UI는 EstimateClient.tsx.
// 단가는 공개 "기준가"(VAT 포함) 그대로이며 출처는 assistant-knowledge.ts·products.ts 한 곳이다.
// 시공·출장비·디자인비는 현장 견적이라 여기서 계산하지 않는다(결과 화면에 반드시 명시).
// 자동 견적 규칙(대표 확정): 1장 총액 1,000만 원 미만 + 전 항목이 단가표 안 → 자동 발행 대상.

export const AUTO_QUOTE_LIMIT = 10_000_000

export const UNIT = {
  /** 친환경 그래픽 노면표시재 — 원/㎡ */
  roadmark: 132_000,
  /** 친환경 그래픽 직물시트 — 원/㎡ */
  fabric: 88_000,
  /** 노란발자국 전면형 — 원/세트(기준가 "~") */
  footprintFront: 600_000,
  /** 노란발자국 우측면형 — 원/세트(기준가 "~") */
  footprintSide: 400_000,
  /** 아이타존 전체형 — 원/세트(기준가 "~") */
  aitazone: 1_500_000,
  /** 안전표지(낱개) — 원/㎡ 기준, 규격 면적으로 환산 */
  signPerSqm: 132_000,
} as const

export type FootprintType = 'front' | 'side'
export type SignSpecId = 's300x450' | 's450x600' | 's600x900'

export const SIGN_SPECS: { id: SignSpecId; label: string; w: number; h: number }[] = [
  { id: 's300x450', label: '300×450mm', w: 300, h: 450 },
  { id: 's450x600', label: '450×600mm', w: 450, h: 600 },
  { id: 's600x900', label: '600×900mm', w: 600, h: 900 },
]

/** 안전표지 1장 기준가 — 규격 면적(㎡) × ㎡ 단가, 원 단위 반올림 */
export function signUnitPrice(spec: SignSpecId): number {
  const s = SIGN_SPECS.find((x) => x.id === spec) ?? SIGN_SPECS[0]
  return Math.round(((s.w * s.h) / 1_000_000) * UNIT.signPerSqm)
}

export type EstimateInput = {
  roadmark?: { on: boolean; sqm: number }
  fabric?: { on: boolean; sqm: number }
  footprint?: { on: boolean; type: FootprintType; sets: number }
  aitazone?: { on: boolean; sets: number }
  sign?: { on: boolean; spec: SignSpecId; qty: number }
}

export type LineItem = {
  id: keyof EstimateInput
  label: string
  detail: string
  qty: number
  unit: string
  unitPrice: number
  /** 기준가가 "~"(이상)인 품목 */
  from: boolean
  subtotal: number
}

export type Band = 'under1m' | '1to5m' | '5to10m' | 'over10m'

export type EstimateResult = {
  lines: LineItem[]
  total: number
  /** 자동 견적 발행 대상(총액 1,000만 원 미만 + 전 항목 단가표 내) */
  autoQuote: boolean
  band: Band
}

const clamp = (n: number, min: number, max: number) =>
  Math.min(max, Math.max(min, Math.round(Number.isFinite(n) ? n : min)))

export const LIMITS = {
  roadmarkSqm: [1, 500],
  fabricSqm: [1, 500],
  footprintSets: [1, 50],
  aitazoneSets: [1, 20],
  signQty: [1, 200],
} as const

export function band(total: number): Band {
  if (total < 1_000_000) return 'under1m'
  if (total < 5_000_000) return '1to5m'
  if (total < AUTO_QUOTE_LIMIT) return '5to10m'
  return 'over10m'
}

export function calc(input: EstimateInput): EstimateResult {
  const lines: LineItem[] = []

  if (input.roadmark?.on) {
    const sqm = clamp(input.roadmark.sqm, ...LIMITS.roadmarkSqm)
    lines.push({
      id: 'roadmark',
      label: '친환경 그래픽 노면표시재',
      detail: '부착식 알루미늄 박판 스티커',
      qty: sqm,
      unit: '㎡',
      unitPrice: UNIT.roadmark,
      from: false,
      subtotal: sqm * UNIT.roadmark,
    })
  }
  if (input.fabric?.on) {
    const sqm = clamp(input.fabric.sqm, ...LIMITS.fabricSqm)
    lines.push({
      id: 'fabric',
      label: '친환경 그래픽 직물시트',
      detail: '벽면·기둥·천장 부착',
      qty: sqm,
      unit: '㎡',
      unitPrice: UNIT.fabric,
      from: false,
      subtotal: sqm * UNIT.fabric,
    })
  }
  if (input.footprint?.on) {
    const sets = clamp(input.footprint.sets, ...LIMITS.footprintSets)
    const front = input.footprint.type === 'front'
    const unitPrice = front ? UNIT.footprintFront : UNIT.footprintSide
    lines.push({
      id: 'footprint',
      label: '노란발자국',
      detail: front ? '전면형' : '우측면형',
      qty: sets,
      unit: '세트',
      unitPrice,
      from: true,
      subtotal: sets * unitPrice,
    })
  }
  if (input.aitazone?.on) {
    const sets = clamp(input.aitazone.sets, ...LIMITS.aitazoneSets)
    lines.push({
      id: 'aitazone',
      label: '아이타존',
      detail: '전체형 · 승하차 안전구역',
      qty: sets,
      unit: '세트',
      unitPrice: UNIT.aitazone,
      from: true,
      subtotal: sets * UNIT.aitazone,
    })
  }
  if (input.sign?.on) {
    const qty = clamp(input.sign.qty, ...LIMITS.signQty)
    const spec = SIGN_SPECS.find((s) => s.id === input.sign?.spec) ?? SIGN_SPECS[0]
    const unitPrice = signUnitPrice(spec.id)
    lines.push({
      id: 'sign',
      label: '안전표지(낱개)',
      detail: spec.label,
      qty,
      unit: '장',
      unitPrice,
      from: false,
      subtotal: qty * unitPrice,
    })
  }

  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  return {
    lines,
    total,
    // 여기 담기는 품목은 전부 공개 단가표 안이므로 판정은 총액 하나로 결정된다.
    autoQuote: lines.length > 0 && total < AUTO_QUOTE_LIMIT,
    band: band(total),
  }
}

/** 예산 역산 — 예산 전액을 한 품목에 쓸 때 가능한 물량(기준가 기준, 시공비 제외) */
export type BudgetRow = { id: string; label: string; detail: string; amount: number; unit: string; unitPrice: number }

export function budgetPlan(budget: number): BudgetRow[] {
  const b = Math.max(0, Math.floor(Number.isFinite(budget) ? budget : 0))
  const row = (id: string, label: string, detail: string, unitPrice: number, unit: string): BudgetRow => ({
    id,
    label,
    detail,
    amount: Math.floor(b / unitPrice),
    unit,
    unitPrice,
  })
  return [
    row('roadmark', '친환경 그래픽 노면표시재', '부착식 알루미늄 박판 스티커', UNIT.roadmark, '㎡'),
    row('fabric', '친환경 그래픽 직물시트', '벽면·기둥·천장 부착', UNIT.fabric, '㎡'),
    row('footprintFront', '노란발자국', '전면형', UNIT.footprintFront, '세트'),
    row('footprintSide', '노란발자국', '우측면형', UNIT.footprintSide, '세트'),
    row('aitazone', '아이타존', '전체형', UNIT.aitazone, '세트'),
    row('sign600', '안전표지(낱개)', '600×900mm', signUnitPrice('s600x900'), '장'),
    row('sign450', '안전표지(낱개)', '450×600mm', signUnitPrice('s450x600'), '장'),
  ]
}

export function won(n: number): string {
  return `${Math.round(n).toLocaleString('ko-KR')}원`
}

/** 견적 신청 폼 message 기본값·복사용 요약(사람이 읽는 텍스트) */
/** 시공 방식 — 셀프 부착(자재만) / 전문 시공 요청(시공·출장비는 현장 실측 후 별도 산정, 공개 단가 없음) */
export type InstallMode = 'self' | 'pro'

export function summaryText(r: EstimateResult, install: InstallMode = 'self'): string {
  if (r.lines.length === 0) return ''
  const rows = r.lines.map(
    (l) =>
      `· ${l.label}${l.detail ? `(${l.detail})` : ''} ${l.qty.toLocaleString('ko-KR')}${l.unit} — ${won(l.subtotal)}${l.from ? '~' : ''}`,
  )
  return [
    '[견적 시뮬레이터 구성]',
    ...rows,
    `자재 기준가 합계(VAT 포함): ${won(r.total)}`,
    install === 'pro'
      ? '■ 시공 요청: 퍼블릭아이디 전문 시공팀 — 시공비·출장비는 현장 실측 후 별도 산정(위 합계에 미포함)'
      : '■ 셀프 부착(자재만): 시공비 없음, 부착 가이드 제공',
    '※ 디자인비 별도, 정확한 금액은 검토 후 회신',
  ].join('\n')
}
