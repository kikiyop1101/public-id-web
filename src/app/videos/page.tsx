import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Button from "@/components/Button";
import BreadcrumbLd from "@/components/BreadcrumbLd";
import VideoGrid from "./VideoGrid";
import { site } from "@/lib/site";
import { videos, longforms, isLive } from "@/lib/videos";

// 공개된 롱폼을 VideoObject 목록으로 낸다(2026-09-08 AEO 감사) — 유튜브 밖에서 "퍼블릭아이디 설명영상"이 검색·인용되게.
// 예약 공개분(publishAt 미래)은 빌드 시각 기준으로 제외(아직 없는 영상을 색인시키지 않기 위해).
const videoJsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "퍼블릭아이디 설명영상",
  itemListElement: longforms
    .filter((v) => isLive(v))
    .map((v, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "VideoObject",
        name: v.title,
        description: `${v.series ? `${v.series} 시리즈 — ` : ""}${v.category} 설명영상. 퍼블릭아이디 유튜브 채널.`,
        thumbnailUrl: `https://i.ytimg.com/vi/${v.id}/hqdefault.jpg`,
        uploadDate: v.published,
        embedUrl: `https://www.youtube.com/embed/${v.id}`,
        contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
        inLanguage: "ko-KR",
        publisher: { "@id": `${site.url}/#organization` },
      },
    })),
};

// 영상관 — 2026-09-08 신설(대표: "영상을 걸고 싶은데 무거울까봐").
// 롱폼 30편+쇼츠 48편을 한 페이지에 두지만 전부 LiteYouTube 파사드라 초기 무게는 썸네일 lazy 로드뿐이고,
// iframe·유튜브 스크립트는 사용자가 누른 카드 하나에서만 뜬다.
export const metadata: Metadata = pageMeta({
  title: "영상관",
  description:
    "노란발자국·노면표시재·직물시트·디자인 구독·우리회사OS — 시리즈별 3~7분 설명영상 30편과 1분 쇼츠. 클릭할 때만 재생기가 뜹니다.",
  path: "/videos",
});

export default function VideosPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "영상관", path: "/videos" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(videoJsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Videos"
        title={
          <>
            보고 나면 이해되는
            <br />
            3분 설명영상관
          </>
        }
        description="제품·구독마다 1편(개요)·2편(가격·사례)·3편(화이트보드 3분 정리) 시리즈 설명영상 30편, 그리고 현장에서 자주 받는 질문에 답하는 1분 쇼츠. 여기서 바로 재생됩니다."
      />
      <section className="bg-white">
        <Container className="py-16 sm:py-20">
          <VideoGrid videos={videos} />
        </Container>
      </section>
      <section className="border-t border-line bg-cloud/50">
        <Container className="py-16 sm:py-20">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="break-keep text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                새 영상은 유튜브에서 먼저 올라갑니다
              </h2>
              <p className="mt-3 max-w-xl break-keep text-ink-soft">
                영상에서 본 제품·서비스는 규격과 수량만 알려주시면 견적으로 바로 이어집니다.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button href={site.youtube} variant="navy" external>
                유튜브 채널 구독
              </Button>
              <Button href="/quote" variant="outline">
                맞춤 견적
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
