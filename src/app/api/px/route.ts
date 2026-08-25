import { createAdminClient } from "@/lib/supabase/admin";

// 아웃리치 메일 열람 픽셀(1×1 gif). 이미지 차단 환경에선 안 잡히므로 참고치(하한선)로만 쓴다.
export const dynamic = "force-dynamic";

const GIF = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");

export async function GET(req: Request) {
  const t = new URL(req.url).searchParams.get("t");
  if (t) {
    await createAdminClient()
      .from("outreach_events")
      .insert({ token: t.slice(0, 64), kind: "open", ua: (req.headers.get("user-agent") ?? "").slice(0, 300) });
  }
  return new Response(GIF, {
    headers: { "Content-Type": "image/gif", "Cache-Control": "no-store, max-age=0" },
  });
}
