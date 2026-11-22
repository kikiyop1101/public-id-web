import crypto from "node:crypto";

// 발주처 전용 링크용 토큰. 발주처 이름을 서버 비밀(SALT)로 해시 → 추측 불가한
// 고정 토큰. SALT는 서버 전용 모듈에만 있고 브라우저로 전송되지 않습니다(이 파일을
// 클라이언트 컴포넌트에서 import하지 말 것 — node:crypto 사용).
const SALT = "pid-safety-map-salt-2026-v1-7Qx9aLkPmZ";

// 발주처별 전용 링크 목록을 조회하는 관리자 키. /safety-map/links 에서 키를 POST(서버 액션)로 보내 쿠키 세션을 받는다 — 주소·로그에 키가 남지 않게 2026-11-22 GET ?key= 를 없앴다(옛 /api/facility-links는 2026-06-14에 없앰).
export const ADMIN_KEY = "pid-links-admin-2026-3Rk8vWq2Zt";

export function tokenForClient(client: string): string {
  return crypto
    .createHmac("sha256", SALT)
    .update(client.trim())
    .digest("hex")
    .slice(0, 16);
}

// 관리자 키를 맞게 입력하면 심는 쿠키 값 — 키 자체는 쿠키에 담지 않는다.
export const LINKS_COOKIE = "pid_links_session";
export function linksSessionValue(): string {
  return crypto.createHmac("sha256", SALT).update("links-session:" + ADMIN_KEY).digest("hex");
}
