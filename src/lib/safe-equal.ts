import { createHash, timingSafeEqual } from 'node:crypto'

// 비밀 값(관리자 비밀번호·세션 토큰) 비교용 — 걸리는 시간이 일치한 글자 수에 따라 달라지지 않게 한다.
// 양쪽을 sha256 으로 같은 길이로 만든 뒤 비교하므로 길이 차이도 새지 않는다. 빈 값·미설정은 항상 false.
// auth.ts(서버 액션)와 proxy.ts(/admin 보호)가 같이 쓴다 — proxy 는 Next 16 에서 Node 런타임이라 node:crypto 가능.
export function safeEqual(a: string | undefined | null, b: string | undefined | null): boolean {
  if (!a || !b) return false
  const ha = createHash('sha256').update(a, 'utf8').digest()
  const hb = createHash('sha256').update(b, 'utf8').digest()
  return timingSafeEqual(ha, hb)
}
