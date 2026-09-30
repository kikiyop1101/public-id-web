// 공용 in-memory 속도 제한 — 인스턴스 단위 best-effort(서버리스에선 인스턴스마다 별도 카운터).
// 더 강한 제한이 필요하면 Vercel KV / Upstash Redis 같은 공유 스토어나 WAF 로 바꾼다.
// 2026-09-30 route 3곳(assistant·os-curator·inquiry-relay)에 복붙돼 있던 함수를 한 곳으로 모으고,
// 허니팟뿐이던 서버 액션(견적·제보·게시판·관리자 로그인)에도 같은 함수를 쓴다.

type Hit = { n: number; reset: number }

const hits = new Map<string, Hit>()
const SWEEP_AT = 500 // 키가 이만큼 쌓이면 만료된 항목을 지운다(메모리 누수 방지)

function sweep(now: number) {
  if (hits.size <= SWEEP_AT) return
  for (const [key, hit] of hits) {
    if (now > hit.reset) hits.delete(key)
  }
}

/**
 * key 가 windowMs 안에 max 회를 넘겼으면 true(막는다). 호출 자체가 1회로 집계된다.
 * key 는 용도별 접두어를 붙여 쓴다 — 예: `assistant:${ip}`.
 */
export function rateLimited(key: string, max: number, windowMs: number): boolean {
  const now = Date.now()
  sweep(now)
  const cur = hits.get(key)
  if (!cur || now > cur.reset) {
    hits.set(key, { n: 1, reset: now + windowMs })
    return false
  }
  cur.n += 1
  return cur.n > max
}

/** 요청 헤더에서 방문자 IP(x-forwarded-for 첫 값)를 꺼낸다. 없으면 'unknown'. */
export function clientIp(headers: Headers): string {
  return headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

/**
 * 인스턴스별 하루 총량 상한(과금 보호). 통과한 요청만 집계하도록 호출부가 검증 뒤에 부른다.
 * 초과면 true.
 */
export function dailyCapExceeded(name: string, max: number): boolean {
  return rateLimited(`daily:${name}`, max, 86_400_000)
}
