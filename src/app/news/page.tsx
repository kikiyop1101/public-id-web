import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { news, newsKind } from "@/lib/news";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = {
  title: "소식",
  alternates: { canonical: "/news" },
  description:
    "퍼블릭아이디의 보도자료와 소식. 친환경 그래픽 노면표시재, 어린이보호구역 노란발자국, 배리어프리 안내표지, 사회적기업 우선구매 등 안전 디자인 활동을 전합니다.",
};

// 목록 페이지는 ItemList — 개별 NewsArticle 스키마는 /news/[slug]에서 낸다(중복 마크업 방지).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "퍼블릭아이디 소식 · 보도자료",
  itemListElement: news.map((n, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: n.title,
    url: `${site.url}/news/${n.slug}`,
  })),
};

export default function NewsPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "소식", path: "/news" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        eyebrow="News"
        title={
          <>
            퍼블릭아이디
            <br />
            소식 · 보도자료
          </>
        }
        description="안전이 되는 디자인을 현장에서 만들어 온 이야기. 보도자료와 활동 소식을 전합니다."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {news.map((n, i) => (
              <Reveal key={n.slug} delay={Math.min(i, 6) * 60}>
                <article
                  id={n.slug}
                  className="group scroll-mt-24 rounded-3xl border border-line bg-white p-7 shadow-sm transition hover:border-teal-700/40 sm:p-9"
                >
                  <div className="h-1.5 w-12 rounded-full bg-arch" />
                  <p className="mt-5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                    {newsKind(n)}
                  </p>
                  <h2 className="mt-3 break-keep text-2xl font-extrabold leading-[1.25] tracking-tight text-ink sm:text-[26px]">
                    <Link
                      href={`/news/${n.slug}`}
                      className="transition group-hover:text-teal-700"
                    >
                      {n.title}
                    </Link>
                  </h2>
                  <p className="mt-3 break-keep text-base font-medium leading-relaxed text-ink-soft">
                    {n.subtitle}
                  </p>
                  <p className="mt-4 break-keep text-[15px] leading-[1.75] text-ink">
                    {n.summary}
                  </p>
                  <Link
                    href={`/news/${n.slug}`}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:text-teal"
                  >
                    전문 읽기 →
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>

          <Reveal className="mx-auto mt-12 max-w-3xl">
            <div className="rounded-3xl border border-line bg-cloud/50 p-8 sm:p-10">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                About
              </h3>
              <p className="mt-2 text-lg font-bold text-ink">{site.legalName}</p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">
                2017년 세종에 설립된 인증 사회적기업(제2020-227호)이자 KIDP 종합
                산업디자인전문회사입니다. 친환경 그래픽 노면표시재 기반 노면표시·안전표지의
                시공과 정기 시설 관리, 전용 마스코트·웹툰·디자인 시스템 구독을 제공합니다.
              </p>
              <p className="mt-6 text-sm text-ink-soft">
                취재·자료 요청은{" "}
                <Link href="/contact" className="font-semibold text-teal-700">
                  문의
                </Link>
                {" "}또는 {site.email} 로 부탁드립니다.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
