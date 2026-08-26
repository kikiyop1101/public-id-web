import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { parseBlogListItem } from "@/lib/blog";

// 발행·승인이 배포 없이 일어나므로 사이트맵도 요청 시점 생성(2차 감사 지적 — 빌드 스냅샷 드리프트 방지)
export const dynamic = "force-dynamic";

const base = "https://www.public-id.co.kr";
const routes = ["", "/subscribe", "/design", "/work", "/guide", "/about", "/credentials", "/credibility", "/contact", "/news", "/safety-map", "/privacy",
  // 2026-08-25 스토어 통합으로 편입된 경로
  // /scan은 2026-08-26 /os#scan으로 통합(301)
  "/products", "/quote", "/os", "/blog", "/board", "/safety-report", "/safety-report/new", "/world",
  // 2026-08-25 보관고 상품 라인
  "/products/art-fabric", "/products/map-banner"];

// 쿠키 없는 anon 클라이언트 — RLS가 공개분만 반환.
function anonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } },
  );
}

// 게시된 자체 블로그 글. DB 장애가 사이트맵 전체를 죽이지 않게 실패 시 빈 배열.
async function blogEntries(): Promise<MetadataRoute.Sitemap> {
  try {
    const result = await anonClient()
      .from("blog_posts")
      .select("slug, title, cover_image, created_at")
      .eq("published", true)
      .order("created_at", { ascending: false });
    if (result.error || !Array.isArray(result.data)) return [];
    return result.data
      .map(parseBlogListItem)
      .filter((p): p is NonNullable<ReturnType<typeof parseBlogListItem>> => p !== null)
      .map((p) => ({
        url: `${base}/blog/${p.slug}`,
        lastModified: new Date(p.created_at),
        priority: 0.6,
      }));
  } catch {
    return [];
  }
}

// 게시판 개별 글은 sitemap에 넣지 않는다 — 무검수 즉시공개 UGC라 noindex 처리했음
// (2026-08-26 대표 위임 판단: 스팸 색인 리스크 > 색인 이득. 목록 /board만 색인·sitemap 유지)

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 고정 경로엔 lastModified를 넣지 않는다 — 전 URL 동일한 빌드 시각은
  // 검색엔진이 신뢰하지 않는 패턴(2026-08-26 감사). 실제 수정일이 있는 블로그 글만 기재.
  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    priority: route === "" ? 1 : 0.8,
  }));
  return [...staticEntries, ...(await blogEntries())];
}
