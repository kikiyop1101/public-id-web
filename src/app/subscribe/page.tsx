import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import Subscription from "@/components/sections/Subscription";
import HowItWorks from "@/components/sections/HowItWorks";
import DesignTokenDemo from "@/components/sections/DesignTokenDemo";
import Pricing from "@/components/sections/Pricing";
import FaqBlock, { type FaqItem } from "@/components/FaqBlock";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = pageMeta({
  title: "디자인 구독·안전시설관리 구독",
  description:
    "마스코트·매월 웹툰·디자인 시스템·홈페이지 제작을 담은 디자인 구독과, 시공 후 1년 동안 책임지고 관리하는 안전시설관리 구독. 소상공인부터 지자체까지 필요한 구독만 고르세요.",
  path: "/subscribe",
});

// 구독 FAQ — 2026-09-27 FaqBlock으로 통합(종전 sections/Faq). 사실 정본 = assistant-knowledge.ts·Pricing.tsx.
const SUBSCRIBE_FAQ: FaqItem[] = [
  {
    q: "디자인 구독 가격은 얼마인가요?",
    a: "Basic은 연 1,100,000원, Standard는 연 4,000,000원이며 모두 기준가입니다. Premium은 Standard 전체에 전담 디자이너와 노면표시·안전시설 정기 관리를 더한 맞춤 견적입니다. 정확한 구성과 금액은 문의로 안내해 드립니다.",
  },
  {
    q: "디자인 구독 Basic과 Standard는 무엇이 다른가요?",
    a: "Standard는 Basic에 디자인 시스템, 마스코트 변형, 월 1회 디자인 요청, 원본 제공을 더한 플랜입니다. Basic은 홈페이지 제작·전용 마스코트·월 1편 웹툰·기본 로고/컬러 가이드·SNS 프로필 키트와 AI 자동화 기본 키트 7종을, Standard는 디자인 시스템 기반 홈페이지와 AI 자동화 심화 키트 11종을 담습니다.",
  },
  {
    q: "1년 구독이 끝나면 어떻게 되나요?",
    a: "월 요금으로 연장할 수 있습니다. 최초 1년 구독이 끝난 다음 달부터 Basic은 월 88,000원, Standard는 월 99,000원(기준가)이 적용되고, Premium은 맞춤 견적입니다.",
  },
  {
    q: "안전시설관리 구독은 얼마 동안 관리해 주나요?",
    a: "시공 후 1년 동안 책임지고 관리합니다. 노란발자국·노란볼라드·안내표지·웨이파인딩 등 자사 시공물을 정기 점검·보수하고, 설치 위치와 관리 이력은 안전관리 지도에서 공개합니다.",
  },
  {
    q: "디자인 구독을 시작하면 무엇을 받나요?",
    a: "홈페이지 제작, 전용 마스코트, 매월 웹툰, 로고·컬러·템플릿이 담긴 디자인 시스템(BrandDNA), AI 자동화 키트, 그리고 월 정기 디자인(요청 시 1회 기준)과 SNS 홍보물 템플릿까지. 디자인 팀이 없어도 매달 완성된 브랜드 콘텐츠를 받아 보실 수 있습니다.",
  },
  {
    q: "AI 자동화 키트에는 무엇이 들어 있나요?",
    a: "저희가 실제로 쓰고 판매하는 우리회사OS 키트를 구독에 담아 드립니다. Basic은 기본 키트 7종(①진단·②업무시트 + 미니 5종: 한장소개·안내문·고객문자·가격표·마진계산)이고, Standard·Premium은 심화 키트 11종으로 여기에 ④AI 직원 5명·③콘텐츠 자동발행·⑤상세페이지·⑩사장브리핑이 더해집니다. 키트 파일과 설치 절차서를 구독 시작할 때 함께 드리며, 별도 결제가 필요 없습니다.",
  },
  {
    q: "디자인 구독을 하면 홈페이지도 만들어 주나요?",
    a: "네. 구독으로 만든 디자인 시스템과 제공해 드리는 자료(마스코트·로고·컬러·템플릿)를 그대로 사용해 홈페이지까지 제작해 드립니다. 브랜드 정본에서 출발하기 때문에 명함부터 홈페이지까지 한눈에 같은 회사로 보입니다.",
  },
  {
    q: "디자인 인력이 없는 작은 회사도 이용할 수 있나요?",
    a: "네. 구독형 디자인 서비스는 디자인 담당자가 없는 소상공인과 작은 회사를 위해 설계되었습니다. 복잡한 과정 없이 상담 한 번으로 시작하고, 매달 바로 쓸 수 있는 콘텐츠를 정기적으로 전달해 드립니다.",
  },
  {
    q: "전용 마스코트는 어떻게 제작되나요?",
    a: "브랜드 진단을 통해 업종과 가치를 파악한 뒤, 귀사만의 전용 캐릭터를 설계합니다. 완성된 마스코트는 웹툰·SNS·광고 등 다양한 콘텐츠로 확장되어 고객과 브랜드의 이야기를 전합니다. 퍼블릭아이디의 마스코트 '퍼이'가 좋은 예시입니다.",
  },
  {
    q: "안전·시설 관리 구독은 어디까지 포함되나요?",
    a: "노란발자국·노란볼라드·안전표지·웨이파인딩 등 자사 시공물의 제작·시공부터 주기적인 점검·보수, CPTED(범죄 예방) 기반 안전 디자인 제안까지 포함합니다. 시공 후 1년 동안 책임지고 관리합니다.",
  },
  {
    q: "디자인 구독과 안전·시설 관리, 하나만 이용할 수도 있나요?",
    a: "네. 두 가지 구독은 따로 또 같이 이용하실 수 있습니다. 필요한 구독만 선택하셔도 되고, 디자인과 안전 관리를 함께 구독하시면 브랜드와 현장을 한 번에 관리할 수 있습니다.",
  },
  {
    q: "구독 없이 노면표시·안전표지 시공만 단건으로 의뢰할 수 있나요?",
    a: "가능합니다. 정기 구독 외에 단건 제작·시공도 진행하고 있으니, 필요하신 내용을 문의해 주시면 맞춤 견적을 안내해 드립니다.",
  },
];

export default function SubscribePage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "디자인 구독", path: "/subscribe" }]} />
      <PageHero
        eyebrow="Subscription"
        title={
          <>
            구독으로 완성하는
            <br />
            디자인과 안전
          </>
        }
        description="디자인 팀이 없어도 매달 새로운 브랜드 콘텐츠를, 홈페이지는 디자인 시스템으로 제작까지, 노면표시·안전표지는 시공부터 정기 관리까지. 필요한 만큼만 합리적으로 이용하세요."
      />
      <Subscription pricing />
      <HowItWorks />
      {/* 디자인 시스템 — 구독에 포함되는 정본 요약. 전체는 /design 전용 페이지(2026-08-26 복원, 대표 지시) */}
      <section id="design-system" className="bg-cloud py-20 sm:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Design System
            </p>
            <h2 className="mt-4 break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
              구독하면, 디자인이
              <br />
              흔들리지 않는 정본이 생깁니다.
            </h2>
            <p className="mt-5 break-keep text-lg leading-relaxed text-ink-soft">
              명함, 현수막, 안내판, 홈페이지 — 어디에 있어도 한눈에 같은 회사로
              보이도록. 색·글꼴·간격의 정본(디자인 시스템)을 먼저 만들고, 매달
              도착하는 모든 콘텐츠를 거기서 꺼내 만듭니다. 홈페이지도 이 정본과
              구독으로 받는 자료로 저희가 직접 제작해 드립니다. 아래에서 색을
              직접 바꿔보세요 — 귀사의 색으로도 이렇게 정리됩니다.
            </p>
          </Reveal>
          <div className="mt-12">
            <DesignTokenDemo />
          </div>
          <div className="mt-10">
            <Link
              href="/design"
              className="inline-flex h-12 items-center justify-center rounded-full bg-navy px-6 text-[15px] font-semibold text-white transition hover:bg-teal"
            >
              디자인시스템 전체 보기 →
            </Link>
          </div>
        </Container>
      </section>
      <Pricing />
      <FaqBlock
        title="자주 묻는 질문"
        intro="구독 서비스에 대해 자주 궁금해하시는 점을 모았습니다."
        items={SUBSCRIBE_FAQ}
      />
      {/* 다음 행동 — 구독 상담 + 같은 구독 메뉴의 우리회사OS(2026-09-27 동선 점검) */}
      <section className="border-t border-line bg-cloud py-20 text-center sm:py-24">
        <Container>
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">어떤 구독이 맞을지 함께 정해요</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            필요한 업무를 알려주시면 맞는 구독을 안내해 드립니다. AI 업무 자동화가 필요하시면 우리회사OS도 살펴보세요.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/contact">상담 신청</Button>
            <Button href="/os" variant="navy">우리회사OS 보기</Button>
          </div>
        </Container>
      </section>
    </>
  );
}
