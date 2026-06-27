import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { news } from "@/lib/news";

export const metadata: Metadata = {
  title: "소식",
  alternates: { canonical: "/news" },
  description:
    "퍼블릭아이디의 보도자료와 소식. 친환경 그래픽 노면표시재, 어린이보호구역 노란발자국, 배리어프리 안내표지, 사회적기업 우선구매 등 안전 디자인 활동을 전합니다.",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": news.map((n) => ({
    "@type": "NewsArticle",
    headline: n.title,
    description: n.summary,
    articleBody: n.body.join("\n\n"),
    datePublished: n.year,
    inLanguage: "ko-KR",
    image: `${site.url}/og.png`,
    mainEntityOfPage: `${site.url}/news`,
    author: { "@type": "Organization", name: site.legalName },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
    },
  })),
};

export default function NewsPage() {
  return (
    <>
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
          <div className="mx-auto flex max-w-3xl flex-col gap-10">
            {news.map((n, i) => (
              <Reveal key={n.slug} delay={i * 80}>
                <article
                  id={n.slug}
                  className="scroll-mt-24 rounded-3xl border border-line bg-white p-7 shadow-sm sm:p-10"
                >
                  <div className="h-1.5 w-12 rounded-full bg-arch" />
                  <p className="mt-5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                    {n.year} · 보도자료
                  </p>
                  <h2 className="mt-3 text-2xl font-extrabold leading-snug tracking-tight text-ink sm:text-[28px]">
                    {n.title}
                  </h2>
                  <p className="mt-3 text-base font-medium leading-relaxed text-ink-soft">
                    {n.subtitle}
                  </p>
                  <div className="mt-6 space-y-4 border-t border-line pt-6">
                    {n.body.map((p, pi) => (
                      <p
                        key={pi}
                        className="break-keep text-[15px] leading-[1.75] text-ink"
                      >
                        {p}
                      </p>
                    ))}
                  </div>
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
                2017년 세종에 설립된 인증 사회적기업(제2020-227호)이자 KIDP 5부문
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
