import { createAdminClient } from "@/lib/supabase/admin";

// 아웃리치 메일 열람 픽셀(1×1 gif). 이미지 차단 환경에선 안 잡히므로 참고치(하한선)로만 쓴다.
export const dynamic = "force-dynamic";

const OUTREACH_TOKEN = /^(test-)?[0-9a-f]{8,16}$/;
const GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t");
  // 발송 토큰 형식(16진수 8~16자, 시험 발송은 test- 접두)일 때만 기록 — 임의 문자열로 쓸모없는 행이 쌓이지 않게.
  if (t && OUTREACH_TOKEN.test(t)) {
    try {
      await createAdminClient()
        .from("outreach_events")
        .insert({ token: t.slice(0, 64), kind: "open", ua: (req.headers.get("user-agent") ?? "").slice(0, 300) });
    } catch {
      // 기록 실패해도 픽셀은 항상 돌려준다(참고치)
    }
  }
  return new Response(GIF, {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store, max-age=0" },
  });
}
