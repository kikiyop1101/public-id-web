import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Button from "@/components/Button";
import BreadcrumbLd from "@/components/BreadcrumbLd";
import VideoGrid from "./VideoGrid";
import { site } from "@/lib/site";
import { videos } from "@/lib/videos";

// 영상관 — 2026-09-08 신설(대표: "영상을 걸고 싶은데 무거울까봐").
// 47편을 한 페이지에 두지만 전부 LiteYouTube 파사드라 초기 무게는 썸네일 lazy 로드뿐이고,
// iframe·유튜브 스크립트는 사용자가 누른 카드 하나에서만 뜬다.
export const metadata: Metadata = {
  title: "영상관",
  alternates: { canonical: "/videos" },
  description:
    "스쿨존 안전점검부터 노면표시재 소재, 디자인 구독과 홍보판촉물까지 — 퍼블릭아이디가 1분 안팎으로 설명하는 영상 모음.",
};

export default function VideosPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "영상관", path: "/videos" }]} />
      <PageHero
        eyebrow="Videos"
        title={
          <>
            보고 나면 이해되는
            <br />
            1분 영상관
          </>
        }
        description="학교 앞 안전점검, 노면표시재가 페인트가 아닌 이유, 디자인 구독이 남는 계산 — 현장에서 자주 받는 질문을 짧은 영상으로 답합니다."
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
