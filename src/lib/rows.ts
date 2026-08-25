// Supabase에서 돌아온 행에 대한 런타임 검사.
//
// 왜 필요한가: `.select(...)` 결과는 컴파일러가 검사할 수 없는 런타임 값이다.
// 지금까지처럼 `(data ?? []) as XRow[]` 로 캐스팅하면 타입은 통과하지만 실제 값이
// 다를 때(컬럼 이름·타입 변경, nullable 전환, RLS 변경) 화면이 죽거나 조용히 빈
// 목록이 나온다. 읽는 자리에서 한 번 검사해 그 드리프트를 눈에 보이게 만든다.
//
// 두 가지 원칙:
//  1) 쿼리 실패를 삼키지 않는다 — `data ?? []` 는 오류를 "글이 없음"으로 둔갑시킨다.
//  2) 깨진 행은 버리되 페이지는 연다 — 한 행 때문에 전체가 500이 되지 않게.
//
// 검사는 "타입이 맞는가"까지만 한다. 빈 문자열 같은 값 판단은 각 화면의 몫이다.

export type Raw = Record<string, unknown>

/** .single()이 행을 못 찾았을 때의 코드 — 404는 정상이라 오류로 남기지 않는다. */
const NO_ROWS = 'PGRST116'

export type QueryResult = {
  data: unknown
  error: { message: string; code?: string } | null
}

export function isRaw(value: unknown): value is Raw {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

/** 필수 문자열. 타입이 다르면 undefined — 행을 버릴지는 각 파서가 정한다. */
export function text(row: Raw, key: string): string | undefined {
  const value = row[key]
  return typeof value === 'string' ? value : undefined
}

/** 널 허용 문자열. 없거나 타입이 달라도 null로 흡수한다(표시만 비는 필드). */
export function textOrNull(row: Raw, key: string): string | null {
  const value = row[key]
  return typeof value === 'string' ? value : null
}

/** 널 허용 수. 문자열로 온 숫자·NaN·Infinity는 좌표 계산을 망치므로 통과시키지 않는다. */
export function numOrNull(row: Raw, key: string): number | null {
  const value = row[key]
  return typeof value === 'number' && Number.isFinite(value) ? value : null
}

export function boolOr(row: Raw, key: string, fallback: boolean): boolean {
  const value = row[key]
  return typeof value === 'boolean' ? value : fallback
}

/** 문자열 배열. 배열이 아니면 빈 배열 — `.length`·`[0]` 접근이 죽지 않게. */
export function textArray(row: Raw, key: string): string[] {
  const value = row[key]
  if (!Array.isArray(value)) return []
  return value.filter((item): item is string => typeof item === 'string')
}

/** 목록 조회 결과를 검사해 살아있는 행만 남긴다. */
export function parseRows<T>(
  label: string,
  result: QueryResult,
  parse: (row: unknown) => T | null,
): T[] {
  if (result.error) {
    console.error(`[rows] ${label} 조회 실패: ${result.error.message}`)
    return []
  }
  if (!Array.isArray(result.data)) {
    if (result.data != null) console.error(`[rows] ${label}: 배열이 아닌 응답을 받았습니다`)
    return []
  }

  const rows: T[] = []
  let dropped = 0
  for (const raw of result.data) {
    const row = parse(raw)
    if (row === null) dropped++
    else rows.push(row)
  }
  if (dropped > 0) {
    console.error(`[rows] ${label}: 모양이 맞지 않는 행 ${dropped}건을 건너뛰었습니다`)
  }
  return rows
}

/** .single() 조회 결과 한 건. 행이 없으면(정상) 조용히 null. */
export function parseRow<T>(
  label: string,
  result: QueryResult,
  parse: (row: unknown) => T | null,
): T | null {
  if (result.error) {
    if (result.error.code !== NO_ROWS) {
      console.error(`[rows] ${label} 조회 실패: ${result.error.message}`)
    }
    return null
  }
  if (result.data == null) return null

  const row = parse(result.data)
  if (row === null) console.error(`[rows] ${label}: 모양이 맞지 않는 행을 건너뛰었습니다`)
  return row
}
