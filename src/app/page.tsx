import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ShowcaseStrip from "@/components/sections/ShowcaseStrip";
import ProductGateway from "@/components/sections/ProductGateway";
import PlayStrip from "@/components/sections/PlayStrip";
import VideoStrip from "@/components/sections/VideoStrip";
import Story from "@/components/sections/Story";
import NewsStrip from "@/components/sections/NewsStrip";
import ContactCTA from "@/components/sections/ContactCTA";

// 2026-08-25 리디자인 확정판 — 섹션 다이어트 9→5(대표 지시 "4~5개"):
// ①히어로(아치+신뢰 바) ②작품 스트립 ③3갈래 게이트웨이 ④가치+퍼이 밴드 ⑤상담 CTA.
// 2026-08-26 +소식(대표 "다음 단계 다 해줘" — 최신 활동 노출·네이버 유입 보강).
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ShowcaseStrip />
      <ProductGateway />
      {/* 2026-09-08 체류시간 기획안 — 만질거리(위험 찾기·안전 점수·견적 시뮬레이터) + 영상관 파사드 */}
      <PlayStrip />
      <VideoStrip />
      <Story />
      <NewsStrip />
      <ContactCTA />
    </>
  );
}
