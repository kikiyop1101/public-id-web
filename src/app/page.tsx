import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ShowcaseStrip from "@/components/sections/ShowcaseStrip";
import ProductGateway from "@/components/sections/ProductGateway";
import PlayStrip from "@/components/sections/PlayStrip";
import VideoStrip from "@/components/sections/VideoStrip";
import Story from "@/components/sections/Story";
import NewsStrip from "@/components/sections/NewsStrip";
import ContactCTA from "@/components/sections/ContactCTA";
import FaqBlock, { type FaqItem } from "@/components/FaqBlock";

// 2026-08-25 리디자인 확정판 — 섹션 다이어트 9→5(대표 지시 "4~5개"):
// ①히어로(아치+신뢰 바) ②작품 스트립 ③3갈래 게이트웨이 ④가치+퍼이 밴드 ⑤상담 CTA.
// 2026-08-26 +소식(대표 "다음 단계 다 해줘" — 최신 활동 노출·네이버 유입 보강).
export const metadata: Metadata = pageMeta({
  title: { absolute: "퍼블릭아이디 | 디자인 구독 · 안전 시설 관리" },
  description:
    "퍼블릭아이디는 마스코트·웹툰·홈페이지를 만드는 디자인 구독과 친환경 노면표시재 안전시설 시공·관리를 하는 인증 사회적기업입니다. 디자인 팀이 없어도 KIDP 종합산업디자인전문회사가 브랜드와 현장을 함께 맡습니다.",
  path: "/",
  ogDescription: "전용 마스코트부터 매월 웹툰, 디자인 시스템, 홈페이지까지 — 구독으로 완성하는 우리 브랜드.",
});

// 홈 FAQ (2026-09-27 검색 노출 다듬기) — 회사·구독 가격·스쿨존·수의계약·견적. 사실 정본 = assistant-knowledge.ts·llms.txt.
const HOME_FAQ: FaqItem[] = [
  {
    q: "퍼블릭아이디는 어떤 회사인가요?",
    a: "디자인 구독과 친환경 그래픽 노면표시재 기반 안전시설의 디자인·제작·시공·정기 관리를 한 회사에서 하는 KIDP 종합산업디자인전문회사이자 인증 사회적기업(제2020-227호)입니다. 2017년 세종특별자치시에서 설립했고, 전국에 시공합니다.",
  },
  {
    q: "디자인 구독 가격은 얼마인가요?",
    a: "Basic은 연 1,100,000원, Standard는 연 4,000,000원이며 모두 기준가입니다. Basic에는 홈페이지 제작·전용 마스코트·월 1편 웹툰이 포함되고, Premium은 전담 디자이너와 안전시설 정기 관리를 더한 맞춤 견적입니다.",
  },
  {
    q: "어린이보호구역(스쿨존) 안전시설도 하나요?",
    a: "네. 노란발자국·아이타존·친환경 그래픽 노면표시재·어린이보호구역 안전표지를 디자인부터 부착 시공까지 진행합니다. 노란발자국은 차도가 아니라 인도(보도)의 횡단 대기 공간에 붙이는 표시이고, 노면표시재는 페인트 도색이 아니라 인쇄된 점착식 표시재입니다. 안전시설관리 구독을 이용하면 시공 후 1년 동안 책임지고 관리합니다.",
  },
  {
    q: "공공기관이 수의계약으로 구매할 수 있나요?",
    a: "추정가격 2천만 원 이하는 1인 견적 수의계약으로 진행할 수 있습니다. 퍼블릭아이디는 인증 사회적기업이어서 구매하시면 공공기관 우선구매 실적에 반영됩니다. 계약 절차는 문의로 안내해 드립니다.",
  },
  {
    q: "견적은 어떻게 받나요?",
    a: "견적 시뮬레이터에서 기준가 합계를 바로 확인하고 그대로 견적을 신청하실 수 있습니다. 금액은 수량·규격·현장 조건에 따라 달라지므로, 정확한 견적은 맞춤 견적 페이지나 전화(070-4150-1172)·이메일(public-id@naver.com)로 문의해 주세요.",
  },
];

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
      <FaqBlock title="자주 묻는 질문" intro="퍼블릭아이디에 처음 문의하실 때 가장 많이 확인하시는 내용입니다." items={HOME_FAQ} />
      <ContactCTA />
    </>
  );
}
