import { loadFacilities } from "@/lib/facilitiesSource";
import { tokenForClient } from "@/lib/clientLinks";

export const revalidate = 60;

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
