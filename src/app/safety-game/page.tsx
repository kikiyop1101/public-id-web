import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import BreadcrumbLd from "@/components/BreadcrumbLd";
import SafetyGameClient from "./SafetyGameClient";
import { SCENES } from "@/lib/safety-game";

export const metadata: Metadata = pageMeta({
  title: "숨은 위험 찾기 — 학교 앞·아파트·공장 안전 교육 게임",
  description:
    "그림 속 안전 위험 8곳을 60초 안에 찾아보세요. 스쿨존 횡단보도·아파트 주차장·공장 마당 3장면. 찾을 때마다 왜 위험한지와 해결 방법을 알려 드리는 무료 안전 교육 콘텐츠입니다.",
  path: "/safety-game",
  ogTitle: "숨은 위험 찾기 — 60초 안전 교육 게임 | 퍼블릭아이디",
  ogDescription: "스쿨존·아파트·공장 장면에서 위험 8곳을 찾고 해결책까지. 학교·지자체 안전 교육에 링크로 쓰세요.",
  images: [{ url: "/safety-game/scene-school.webp", width: 1920, height: 1071, alt: "학교 앞 횡단보도 장면" }],
});

export default async function SafetyGamePage({
  searchParams,
}: {
  searchParams: Promise<{ scene?: string }>;
}) {
  const { scene } = await searchParams;
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "숨은 위험 찾기",
    description: "장면 속 안전 위험을 찾고 해결 방법을 배우는 안전 교육 게임",
    learningResourceType: "Interactive game",
    educationalLevel: "초등 이상",
    inLanguage: "ko",
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "퍼블릭아이디", url: "https://www.public-id.co.kr" },
    hasPart: SCENES.map((s) => ({ "@type": "CreativeWork", name: s.name, description: s.intro })),
  };
  return (
    <>
      <BreadcrumbLd trail={[{ name: "숨은 위험 찾기", path: "/safety-game" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow="Safety Game"
        title={
          <>
            숨은 위험 찾기
            <br />
            <span className="text-teal-700">60초 안에 8곳</span>
          </>
        }
        description="아이가 매일 걷는 학교 앞, 우리 아파트 단지, 일하는 공장 마당. 그림 속 위험을 찾을 때마다 왜 위험한지, 어떻게 고치는지 바로 보여 드립니다. 학교·기관 안전 교육 자료로 자유롭게 링크하세요."
      />
      <section className="bg-paper">
        <Container className="py-12 sm:py-16">
          <SafetyGameClient initialScene={scene} />
        </Container>
      </section>
      <section className="border-t border-line bg-white">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">교육용 링크</p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">
                학교 가정통신문, 아파트 공지, 사업장 안전 교육에 이 페이지 주소를 그대로 쓰셔도 됩니다. 장면별 바로가기:{" "}
                {SCENES.map((s, i) => (
                  <span key={s.id}>
                    {i > 0 && " · "}
                    <Link href={`/safety-game?scene=${s.id}`} className="font-semibold text-teal-700 hover:text-teal">
                      {s.name}
                    </Link>
                  </span>
                ))}
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">우리 동네는 몇 점?</p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">
                게임에서 본 8가지 항목으로 실제 통학로를 2분 만에 자가진단하고 처방을 받으세요.{" "}
                <Link href="/safety-score" className="font-semibold text-teal-700 hover:text-teal">
                  우리 동네 안전 점수 →
                </Link>
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">실제 현장 점검</p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">
                위험 지점을 알려 주시면 노란발자국·노란볼라드·노면 그래픽으로 고치는 방법과 기준가를 안내해 드립니다.{" "}
                <Link href="/safety-report" className="font-semibold text-teal-700 hover:text-teal">
                  점검 요청 →
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
