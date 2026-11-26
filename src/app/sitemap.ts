import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { parseBlogListItem } from "@/lib/blog";
import { news } from "@/lib/news";
import { answers } from "@/lib/answers";
import { KIT_PAGES } from "@/lib/os-kit-pages";
// 디자인시스템 문서(정적 HTML, /design에서 링크) — 문서 묶음의 검색 색인 목록이 곧 쪽 목록이다(빌드 때 번들, 런타임 파일 읽기 없음).
import designDocsIndex from "../../public/design-docs/assets/search-index.json";

// 발행·승인이 배포 없이 일어나므로 빌드 스냅샷에 고정하지 않는다 — 배포 없는 발행분은 최대 1시간 지연 반영(ISR).
// 관리자 글 등록·삭제는 admin/actions.ts 가 revalidatePath('/sitemap.xml')로 바로 갱신한다.
// (2026-09-30 종전 force-dynamic 은 크롤러 요청마다 함수 실행·Supabase 조회를 만들었다)
export const revalidate = 3600;

const base = "https://www.public-id.co.kr";
// 2026-11-17 다이어트 — /work(→/about#work)·/credentials(→/credibility#credentials)·/press(→/news)·/estimate(→/quote#simulator)·/board(→/contact)는
// 합치거나 없애 301로 잇는다(next.config.ts). 사이트맵에는 살아 있는 쪽만.
const routes = ["", "/subscribe", "/design", "/guide", "/about", "/credibility", "/contact", "/news", "/safety-map", "/privacy",
  // 2026-08-25 스토어 통합으로 편입된 경로
  // /scan은 2026-08-26 /os#scan으로 통합(301)
  "/products", "/quote", "/os", "/blog", "/safety-report", "/safety-report/new", "/world",
  // 2026-08-25 보관고 상품 라인
  "/products/art-fabric", "/products/map-banner",
  // 2026-08-27 축제·행사 콜라보 랜딩(store 루트가 이 페이지를 서빙)
  "/festival",
  // 2026-09-08 체류시간 기획안 — 위험 찾기 게임·안전 점수 진단·영상관·웹툰
  "/safety-game", "/safety-score", "/videos", "/webtoon",
  // 2026-09-27 AI 답변 인용용 질문 답변 목록(개별 /answers/[slug]는 아래 answerEntries)
  "/answers",
  // 2026-10-03 노란발자국 캠페인 게임
  "/campaign-game"];

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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // 고정 경로엔 lastModified를 넣지 않는다 — 전 URL 동일한 빌드 시각은
  // 검색엔진이 신뢰하지 않는 패턴(2026-08-26 감사). 실제 수정일이 있는 블로그 글만 기재.
  const staticEntries: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${base}${route}`,
    priority: route === "" ? 1 : 0.8,
  }));
  // 2026-09-08 소식 개별 페이지(/news/[slug]) — 정적 JSON이라 실패 지점 없음.
  // 2026-09-12 datePublished(기계 메타, 화면 비표시)가 있으면 lastModified로 낸다.
  const newsEntries: MetadataRoute.Sitemap = news.map((n) => ({
    url: `${base}/news/${n.slug}`,
    priority: 0.7,
    ...(n.datePublished ? { lastModified: new Date(n.datePublished) } : {}),
  }));
  // 2026-09-27 질문 답변 개별 페이지 — dateModified(기계 메타, 화면 비표시)를 lastModified로.
  const answerEntries: MetadataRoute.Sitemap = answers.map((a) => ({
    url: `${base}/answers/${a.slug}`,
    priority: 0.7,
    lastModified: new Date(a.dateModified),
  }));
  // 2026-09-27 우리회사OS 상품별 페이지(/os/[slug]) — 정적 데이터(os-kit-pages.json)라 실패 지점 없음.
  const kitEntries: MetadataRoute.Sitemap = KIT_PAGES.map((p) => ({
    url: `${base}/os/${p.slug}`,
    priority: 0.7,
  }));
  // 2026-11-04 디자인시스템 문서(public/design-docs) — 홈 + 색인 목록의 쪽들. 메타는 scripts/design-docs-meta.mjs가 넣는다.
  const designDocEntries: MetadataRoute.Sitemap = ["index.html", ...(designDocsIndex as { url: string }[]).map((d) => d.url)].map((u) => ({
    url: `${base}/design-docs/${u}`,
    priority: 0.4,
  }));
  // 2026-11-26 세이프타운 디지털 디오라마(정적 3D 페이지 — /diorama는 이 주소로 넘기는 짧은 주소)
  const dioramaEntry: MetadataRoute.Sitemap = [{ url: `${base}/diorama-3d/index.html`, priority: 0.7 }];
  return [...staticEntries, ...dioramaEntry, ...newsEntries, ...answerEntries, ...kitEntries, ...designDocEntries, ...(await blogEntries())];
}
