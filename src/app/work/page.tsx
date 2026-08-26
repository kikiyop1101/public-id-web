import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Work from "@/components/sections/Work";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = {
  title: "사업영역",
  alternates: { canonical: "/work" },
  description:
    "노란발자국, 친환경 그래픽 노면표시재, 어린이보호구역·CPTED, 웨이파인딩, 친환경 현수막까지 — 퍼블릭아이디의 공공안전 디자인.",
};

export default function WorkPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "사업영역", path: "/work" }]} />
      <PageHero
        eyebrow="Our Work"
        title={
          <>
            공공의 안전을
            <br />
            디자인합니다
          </>
        }
        description="노면표시부터 도시 사인까지. 사람을 먼저 생각하는 공공디자인으로 더 안전한 거리를 만듭니다."
      />
      <Work />
      <section className="border-t border-line bg-cloud py-20 sm:py-28">
        <Container>
          <Reveal className="max-w-3xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Install Guide
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              노면 그래픽은 칠하지 않고 붙입니다
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              바닥 조건과 노면 온도, 위치 선정부터 고무망치 밀착까지 — 시공 절차를 영상과 함께 정리했습니다.
            </p>
            <Link
              href="/guide"
              className="link-underline mt-8 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
            >
              부착 가이드 보기 <span aria-hidden>→</span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
