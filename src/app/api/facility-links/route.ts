import { loadFacilities } from "@/lib/facilitiesSource";
import { tokenForClient, ADMIN_KEY } from "@/lib/clientLinks";
import { site } from "@/lib/site";

export const revalidate = 60;

// 관리자 전용: 각 발주처의 전용 링크 목록.
//   /api/facility-links?key=<ADMIN_KEY>
// 키가 없으면 403. 이 링크 하나하나를 해당 발주처에 전달하면, 그 발주처는
// 자기 시설만 보이는 지도를 로그인 없이 열람할 수 있습니다.
export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("key");
  if (key !== ADMIN_KEY) {
    return new Response("Forbidden", { status: 403 });
  }
  const facilities = await loadFacilities();
  const clients = [...new Set(facilities.map((f) => f.client).filter(Boolean))].sort();
  const links = clients.map((client) => {
    const token = tokenForClient(client);
    return {
      client,
      count: facilities.filter((f) => f.client === client).length,
      url: `${site.url}/safety-map/c/${token}`,
    };
  });
  return Response.json({ count: links.length, links });
}
