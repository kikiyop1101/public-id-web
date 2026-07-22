import { createHmac } from "node:crypto";

// 문의 실시간 릴레이 — 문의폼 제출을 헤르메스 영업봇(라온) 웹훅으로 중계(서버 전용).
// 이메일(Web3Forms)이 정본 수신 경로이고, 이 릴레이는 실시간 알림용 보조 채널이라
// 어떤 실패에도 폼 UX를 깨지 않는다(항상 200). 시크릿은 서버 env에만 둔다.

const WEBHOOK_URL =
  process.env.HERMES_WEBHOOK_URL ?? "https://kanban.public-id.co.kr/webhooks/inquiry";

// IP당 분당 제한 — assistant와 동일한 인스턴스 단위 best-effort 패턴.
const RATE_MAX = 5;
const rateHits = new Map<string, { n: number; reset: number }>();
function rateLimited(ip: string): boolean {
  const now = Date.now();
  const cur = rateHits.get(ip);
  if (!cur || now > cur.reset) {
    rateHits.set(ip, { n: 1, reset: now + 60_000 });
    return false;
  }
  cur.n += 1;
  return cur.n > RATE_MAX;
}

const clip = (v: unknown, max: number) =>
  typeof v === "string" ? v.slice(0, max).trim() : "";

export async function POST(request: Request) {
  const secret = process.env.HERMES_WEBHOOK_SECRET;
  if (!secret) return Response.json({ ok: false }); // 미설정이면 조용히 통과(사이트 무영향)

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (rateLimited(ip)) return Response.json({ ok: false }, { status: 429 });

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const b = (raw ?? {}) as Record<string, unknown>;

  const payload = JSON.stringify({
    event: "inquiry",
    name: clip(b.name, 100),
    contact: clip(b.contact, 250),
    message: clip(b.message, 4000),
    source: "public-id.co.kr 문의폼",
  });

  const sig =
    "sha256=" + createHmac("sha256", secret).update(payload, "utf8").digest("hex");

  try {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 4000);
    await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Hub-Signature-256": sig,
      },
      body: payload,
      signal: ac.signal,
    });
    clearTimeout(timer);
  } catch (err) {
    // 릴레이 실패는 이메일 경로가 있으므로 치명적이지 않다 — 기록만 남긴다.
    console.error("inquiry-relay failed:", err);
  }
  return Response.json({ ok: true });
}
