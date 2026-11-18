import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Hero from "@/components/sections/Hero";
import TrustBar from "@/components/sections/TrustBar";
import ShowcaseStrip from "@/components/sections/ShowcaseStrip";
import DesignRefStrip from "@/components/sections/DesignRefStrip";
import ProductGateway from "@/components/sections/ProductGateway";
import ProofSection from "@/components/sections/ProofSection";
import PlayStrip from "@/components/sections/PlayStrip";
import Story from "@/components/sections/Story";
import NewsStrip from "@/components/sections/NewsStrip";
import ContactCTA from "@/components/sections/ContactCTA";
import FaqBlock, { type FaqItem } from "@/components/FaqBlock";
import { KITS } from "@/lib/os-kits";

// 2026-08-25 리디자인 확정판 — 섹션 다이어트 9→5(대표 지시 "4~5개"):
// ①히어로(아치+신뢰 바) ②작품 스트립 ③3갈래 게이트웨이 ④가치+퍼이 밴드 ⑤상담 CTA.
// 2026-08-26 +소식(대표 "다음 단계 다 해줘" — 최신 활동 노출·네이버 유입 보강).
// 2026-11-17 다이어트·순서(대표 "페이지가 너무 많은 느낌"): 섹션 11 → 10.
//  · 순서 = 무엇을 하는 회사인가(세 갈래) → 실제로 한 일(사진) → 근거(수치). 종전엔 사진이 먼저 나와 주종목 우리회사OS가 세 번째 화면에야 보였다.
//  · 체험(PlayStrip)과 영상(VideoStrip)을 한 섹션으로 합쳤다.
export const metadata: Metadata = pageMeta({
  title: { absolute: "퍼블릭아이디 | 우리회사OS · 디자인 구독 · 안전시설 관리" },
  description:
    "퍼블릭아이디는 우리회사OS(기업 맞춤형 AI 업무 자동화), 마스코트·웹툰·홈페이지를 만드는 디자인 구독, 친환경 노면표시재 안전시설 시공·관리를 하는 인증 사회적기업입니다. 디자인 팀이 없어도 KIDP 종합산업디자인전문회사가 브랜드와 현장을 함께 맡습니다.",
  path: "/",
  markdown: true,
  ogDescription: "기업 맞춤 AI 업무 자동화 우리회사OS, 디자인 구독, 친환경 노면표시·안전표지의 시공과 정기 관리 — 인증 사회적기업 퍼블릭아이디.",
});

// 홈 FAQ (2026-09-27 검색 노출 다듬기) — 회사·구독 가격·스쿨존·수의계약·견적. 사실 정본 = assistant-knowledge.ts·llms.txt.
const HOME_FAQ: FaqItem[] = [
  {
    q: "퍼블릭아이디는 어떤 회사인가요?",
    a: "소상공인용 AI 업무 자동화 키트 우리회사OS와 디자인 구독, 친환경 그래픽 노면표시재 기반 안전시설의 디자인·제작·시공·정기 관리를 한 회사에서 하는 KIDP 종합산업디자인전문회사이자 인증 사회적기업(제2020-227호)입니다. 2017년 세종특별자치시에서 설립했고, 전국에 시공합니다.",
  },
  {
    // 종수는 KITS.length — 킷이 늘어도 낡지 않게. 가격 정본 = os-kits.ts(llms.txt 17행과 같은 값).
    q: "우리회사OS는 무엇인가요?",
    a: `견적서·홍보 글·문의 답변·월말 마감 같은 반복 업무를 AI에 맡기는 소상공인용 실행 키트 ${KITS.length}종입니다. ①진단 킷은 0원(무료)이고, 미니 키트는 9,900원, 실행 킷은 49,000원부터입니다(부가세 포함). 설치 없이 내려받아 더블클릭으로 쓰고, 결과물에는 구매한 회사 이름이 들어갑니다. 어떤 키트가 맞는지는 우리회사OS 페이지의 3분 무료 진단과 AI 큐레이터로 확인하실 수 있습니다.`,
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
    a: "맞춤 견적 페이지의 시뮬레이터에서 기준가 합계를 바로 확인하고 그대로 견적을 신청하실 수 있습니다. 금액은 수량·규격·현장 조건에 따라 달라지므로, 정확한 견적은 견적 신청이나 전화(070-4150-1172)·이메일(public-id@naver.com)로 문의해 주세요.",
  },
];

export default function Home() {
  return (
    <>
      <Hero />
      <TrustBar />
      <ProductGateway />
      <ShowcaseStrip />
      {/* 2026-11-19 디자인 시안 레퍼런스 최근 4건(시안 사이트에서 읽어 옴) — 작품 줄과 같은 흰 면에 이어 붙는다 */}
      <DesignRefStrip />
      {/* 2026-10-08 엑사 구조 대조 — 근거(미끄럼저항·시험·실적·인증) 탭. 고객사 이름 줄은 TrustBar */}
      <ProofSection />
      {/* 2026-09-08 체류시간 기획안 — 만질거리(위험 찾기·캠페인 게임·안전 점수) + 영상 3칸(2026-11-17 한 섹션) */}
      <PlayStrip />
      <Story />
      <NewsStrip />
      <FaqBlock title="자주 묻는 질문" intro="퍼블릭아이디에 처음 문의하실 때 가장 많이 확인하시는 내용입니다." items={HOME_FAQ} />
      <ContactCTA />
    </>
  );
}
