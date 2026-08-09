import { loadFacilities } from "@/lib/facilitiesSource";
import { tokenForClient } from "@/lib/clientLinks";

export const revalidate = 60;
// 이 라우트는 요청의 token 쿼리로 응답이 갈리므로 본래 동적이다. 명시하지 않으면
// Next가 빌드 때 미리 실행하려 들고, Vercel 빌더에서 구글 시트 fetch가 60초를
// 넘겨 배포 자체가 실패한다(2026-08-09). 시트 응답 캐시(60초)는 그대로 유지된다.
export const dynamic = "force-dynamic";

// 공개: /api/facilities → 전체 시설
// 발주처 전용: /api/facilities?token=<토큰> → 해당 발주처 시설만 + 발주처명
export async function GET(request: Request) {
  const facilities = await loadFacilities();
  const token = new URL(request.url).searchParams.get("token");

  if (token) {
    const clients = [...new Set(facilities.map((f) => f.client).filter(Boolean))];
    const match = clients.find((c) => tokenForClient(c) === token);
    if (!match) return Response.json({ facilities: [], client: null });
    return Response.json({
      facilities: facilities.filter((f) => f.client === match),
      client: match,
    });
  }

  return Response.json({ facilities });
}
