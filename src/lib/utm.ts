// 유입 꼬리표(UTM) — 방문자가 처음 들어온 주소의 utm_*를 30일 동안 기억했다가 문의·견적 접수에 싣는다(2026-09-27).
// 볼트 자동 발행물이 링크에 꼬리표를 붙인다(관리본부 tools/utm.py) — 여기서 받아 leads.utm에 남겨야
// "어느 글·영상이 문의로 이어졌나"를 셀 수 있다. 쿠키 없음, 저장소가 막힌 브라우저면 조용히 빈 값.

const KEY = "pi_utm";
const TTL_MS = 30 * 24 * 60 * 60 * 1000;

/** 첫 방문(first-touch) 꼬리표 저장 — 이미 기억한 게 있으면 덮지 않는다. */
export function captureUtm(): void {
  try {
    const q = new URLSearchParams(window.location.search);
    const src = q.get("utm_source");
    if (!src) return;
    const prev = localStorage.getItem(KEY);
    if (prev && Date.now() - (JSON.parse(prev).at ?? 0) < TTL_MS) return;
    const v = [src, q.get("utm_medium") ?? "", q.get("utm_campaign") ?? ""].join("/");
    localStorage.setItem(KEY, JSON.stringify({ v: v.slice(0, 200), at: Date.now() }));
  } catch {
    // 저장소 차단·JSON 손상 — 측정만 빠지고 사이트는 그대로
  }
}

/** 접수 때 실을 값("source/medium/campaign") — 없거나 30일 지났으면 빈 문자열. */
export function readUtm(): string {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return "";
    const { v, at } = JSON.parse(raw);
    return typeof v === "string" && Date.now() - (at ?? 0) < TTL_MS ? v : "";
  } catch {
    return "";
  }
}
