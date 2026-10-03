import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import BreadcrumbLd from "@/components/BreadcrumbLd";

// 게임 본체 = public/games/yellow-footprint/ (정본 소스: 시스템-외부보관\1-웹앱\노란발자국-캠페인-게임\, tools/publish_to_web.py로 복사)
const GAME = "/games/yellow-footprint/index.html";

export const metadata: Metadata = pageMeta({
  title: "노란발자국 캠페인 게임 — 함께 붙이는 통학로",
  description:
    "횡단보도 앞 인도를 쓸고, 이형지를 떼고, 고무망치로 두드려 노란발자국을 붙여 보세요. 가로등과 볼라드는 친환경그래픽직물시트로 감싸고, 퍼이와 친구들·조용민 대표와 기념사진까지 찍는 무료 3D 캠페인 게임입니다.",
  path: "/campaign-game",
  ogTitle: "노란발자국 캠페인 게임 | 퍼블릭아이디",
  ogDescription: "바닥 쓸기→이형지 떼기→고무망치→노란볼라드→아이들 횡단→기념사진. 학교·기업 캠페인을 미리 해 보세요.",
});

export default function CampaignGamePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: "노란발자국 캠페인 게임",
    description: "횡단보도 앞 인도에 노란발자국을 붙이고 가로등·볼라드를 직물시트로 꾸미는 과정을 직접 해 보는 3D 캠페인 게임",
    learningResourceType: "Interactive game",
    educationalLevel: "초등 이상",
    inLanguage: "ko",
    isAccessibleForFree: true,
    provider: { "@type": "Organization", name: "퍼블릭아이디", url: "https://www.public-id.co.kr" },
  };
  return (
    <>
      <BreadcrumbLd trail={[{ name: "노란발자국 캠페인 게임", path: "/campaign-game" }]} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <PageHero
        eyebrow="Campaign Game"
        title={
          <>
            노란발자국 캠페인
            <br />
            <span className="text-teal-700">우리가 함께 붙여요</span>
          </>
        }
        description="학생·선생님·기업 봉사자·동네 주민이 되어 횡단보도 앞 인도를 쓸고, 이형지를 떼고, 고무망치로 탁탁 두드려 노란발자국을 붙여 보세요. 일을 할수록 퍼이와 친구들이 하나씩 함께해요."
      />
      <section className="bg-paper">
        <Container className="py-10 sm:py-14">
          <a
            href={GAME}
            className="mb-4 flex h-12 items-center justify-center rounded-full bg-navy text-base font-bold text-white sm:hidden"
          >
            전체 화면으로 시작하기
          </a>
          <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
            <iframe
              src={GAME}
              title="노란발자국 캠페인 게임"
              className="block h-[78vh] min-h-[560px] w-full"
              allow="autoplay; fullscreen"
            />
          </div>
          <p className="mt-3 break-keep text-sm text-ink-soft">
            화면이 작으면{" "}
            <a href={GAME} className="font-semibold text-teal-700 hover:text-teal">
              전체 화면으로 하기 →
            </a>
          </p>
        </Container>
      </section>
      <section className="border-t border-line bg-white">
        <Container className="py-16 sm:py-20">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">실제 캠페인</p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">
                게임 속 순서는 실제 현장 그대로예요. 학교·기관·기업과 함께 바닥에 둘러앉아 노란발자국을 두드려 붙입니다.{" "}
                <Link href="/contact" className="font-semibold text-teal-700 hover:text-teal">
                  캠페인 문의 →
                </Link>
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">시공 뒤 1년 관리</p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">
                붙인 노란발자국·노란볼라드는 안전시설관리 구독으로 1년 동안 정기 점검·보수합니다.{" "}
                <Link href="/subscribe" className="font-semibold text-teal-700 hover:text-teal">
                  구독 보기 →
                </Link>
              </p>
            </div>
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">함께 해 볼 게임</p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">
                그림 속 위험 8곳을 60초 안에 찾는 안전 교육 게임도 있어요.{" "}
                <Link href="/safety-game" className="font-semibold text-teal-700 hover:text-teal">
                  숨은 위험 찾기 →
                </Link>
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
