import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ShowcaseStrip from "@/components/sections/ShowcaseStrip";
import ProductGateway from "@/components/sections/ProductGateway";
import Story from "@/components/sections/Story";
import ContactCTA from "@/components/sections/ContactCTA";

// 2026-08-25 리디자인 확정판 — 섹션 다이어트 9→5(대표 지시 "4~5개"):
// ①히어로(아치+신뢰 바) ②작품 스트립 ③3갈래 게이트웨이 ④가치+퍼이 밴드 ⑤상담 CTA.
// 구독 상세·사업영역 상세는 /subscribe·/work 페이지가 맡는다.
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ShowcaseStrip />
      <ProductGateway />
      <Story />
      <ContactCTA />
    </>
  );
}
