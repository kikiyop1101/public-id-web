import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Reveal from "@/components/Reveal";
import BreadcrumbLd from "@/components/BreadcrumbLd";

// 웹툰 뷰어 — 2026-09-08 신설. 1호 「우산 도둑」(자유 창작 단편 10컷, 볼트 콘텐츠본부\웹툰 산출물).
// 컷은 /public/webtoon/umbrella/NN.webp(900px, 35~78KB) — 첫 컷만 즉시, 나머지는 lazy.
export const metadata: Metadata = {
  title: "웹툰 — 우산 도둑",
  alternates: { canonical: "/webtoon" },
  description:
    "편의점 앞에서 자꾸 사라지는 우산 — 범인을 잡으러 잠복한 고등학생이 발견한 것은. 퍼블릭아이디 웹툰 1호 「우산 도둑」 10컷 전편.",
};

const CUTS = Array.from({ length: 10 }, (_, i) => String(i + 1).padStart(2, "0"));

export default function WebtoonPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "웹툰 — 우산 도둑", path: "/webtoon" }]} />
      <PageHero
        eyebrow="Webtoon · 1화"
        title={
          <>
            우산 도둑
          </>
        }
        description="편의점 앞에서 자꾸 사라지는 우산 — 범인을 잡으러 잠복한 고등학생이 발견한 것은. 10컷 단편, 아래로 내리면서 읽습니다."
      />
      <section className="bg-white">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-[720px]">
            <ol className="overflow-hidden rounded-3xl border border-line bg-white shadow-sm">
              {CUTS.map((n, i) => (
                <li key={n} className="border-b border-line last:border-b-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`/webtoon/umbrella/${n}.webp`}
                    alt={`우산 도둑 ${i + 1}컷`}
                    width={900}
                    height={1125}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                    className="block h-auto w-full"
                  />
                </li>
              ))}
            </ol>
            <p className="mt-4 text-center text-xs text-ink-soft">
              1화 끝 · 다음 화는 소식 탭과 인스타그램(pui&amp;friends)에서 이어집니다.
            </p>
          </div>
        </Container>
      </section>
      <section className="border-t border-line bg-cloud/50">
        <Container className="py-16 sm:py-20">
          <Reveal>
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Design Subscription
                </p>
                <h2 className="mt-3 break-keep text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                  디자인 구독에 매월 웹툰이 포함됩니다
                </h2>
                <p className="mt-3 max-w-xl break-keep text-ink-soft">
                  우리 기관·회사 이야기를 이런 웹툰으로 매달 한 편씩. 마스코트 퍼이처럼 전용 캐릭터부터 만들어 드립니다.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button href="/subscribe" variant="navy">
                  디자인 구독 알아보기
                </Button>
                <Button href="/design" variant="outline">
                  디자인 시스템
                </Button>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
