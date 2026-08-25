import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ShowcaseStrip from "@/components/sections/ShowcaseStrip";
import ProductGateway from "@/components/sections/ProductGateway";
import Subscription from "@/components/sections/Subscription";
import Work from "@/components/sections/Work";
import MascotIntro from "@/components/sections/MascotIntro";
import SocialValue from "@/components/sections/SocialValue";
import ContactCTA from "@/components/sections/ContactCTA";

// 2026-08-25 리디자인 시안 — 순서: 사진 히어로 → 신뢰 바 → 작품 스트립 → 3갈래 게이트웨이 → 상세 섹션들
export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ShowcaseStrip />
      <ProductGateway />
      <Subscription moreHref="/subscribe" designHref="/subscribe#pricing" pricing />
      <Work moreHref="/work" tint />
      <MascotIntro />
      <SocialValue />
      <ContactCTA />
    </>
  );
}
