import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Subscription from "@/components/sections/Subscription";
import HowItWorks from "@/components/sections/HowItWorks";
import DesignTokenDemo from "@/components/sections/DesignTokenDemo";
import Pricing from "@/components/sections/Pricing";
import Faq from "@/components/sections/Faq";

export const metadata: Metadata = {
  title: "구독 서비스",
  alternates: { canonical: "/subscribe" },
  description:
    "전용 마스코트·매월 웹툰·디자인 시스템 구독과 노면표시·안전표지 정기 시설 관리. 소상공인부터 지자체까지 맞춤 구독으로.",
};

export default function SubscribePage() {
  return (
    <>
      <PageHero
        eyebrow="Subscription"
        title={
          <>
            구독으로 완성하는
            <br />
            디자인과 안전
          </>
        }
        description="디자인 팀이 없어도 매달 새로운 브랜드 콘텐츠를, 노면표시·안전표지는 시공부터 정기 관리까지. 필요한 만큼만 합리적으로 이용하세요."
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
              도착하는 모든 콘텐츠를 거기서 꺼내 만듭니다. 아래에서 색을 직접
              바꿔보세요 — 귀사의 색으로도 이렇게 정리됩니다.
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
      <Faq />
    </>
  );
}
