import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Link from "next/link";
import { notFound } from "next/navigation";
import Container from "@/components/Container";
import BreadcrumbLd from "@/components/BreadcrumbLd";
import { site } from "@/lib/site";
import { news, getNews, newsKind } from "@/lib/news";

// 보도자료 개별 페이지 — 데이터는 src/content/news.json(정적)이라 빌드 시 전부 생성한다.
export const dynamicParams = false;

export function generateStaticParams() {
  return news.map((n) => ({ slug: n.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) return {};
  return pageMeta({
    title: item.title,
    description: item.summary,
    path: `/news/${item.slug}`,
    ogType: "article",
  });
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getNews(slug);
  if (!item) notFound();

  const idx = news.findIndex((n) => n.slug === item.slug);
  const prev = idx > 0 ? news[idx - 1] : undefined; // 더 최신
  const next = idx >= 0 && idx < news.length - 1 ? news[idx + 1] : undefined; // 이전 글

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.summary,
    articleBody: item.body.join("\n\n"),
    inLanguage: "ko-KR",
    image: `${site.url}/og.png`,
    mainEntityOfPage: `${site.url}/news/${item.slug}`,
    author: { "@type": "Organization", name: site.legalName },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
    },
  };

  return (
    <>
      <BreadcrumbLd
        trail={[
          { name: "소식", path: "/news" },
          { name: item.title, path: `/news/${item.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <section className="py-16 sm:py-24">
        <Container>
          <article className="mx-auto max-w-3xl">
            <Link
              href="/news"
              className="text-sm font-semibold text-teal-700 transition hover:text-teal"
            >
              ← 소식 목록
            </Link>
            <div className="mt-8 h-1.5 w-12 rounded-full bg-arch" />
            <p className="mt-5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
              {newsKind(item)}
            </p>
            <h1 className="mt-3 break-keep text-3xl font-extrabold leading-[1.22] tracking-tight text-ink sm:text-[34px]">
              {item.title}
            </h1>
            <p className="mt-4 break-keep text-lg font-medium leading-relaxed text-ink-soft">
              {item.subtitle}
            </p>

            <div className="mt-8 space-y-5 border-t border-line pt-8">
              {item.body.map((p, pi) =>
                p.startsWith("### ") ? (
                  <h2
                    key={pi}
                    className="break-keep pt-2 text-xl font-bold leading-snug text-ink"
                  >
                    {p.slice(4)}
                  </h2>
                ) : (
                  <p key={pi} className="break-keep text-[16px] leading-[1.8] text-ink">
                    {p}
                  </p>
                ),
              )}
            </div>

            <div className="mt-12 rounded-3xl border border-line bg-cloud/50 p-7 sm:p-9">
              <p className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                About
              </p>
              <p className="mt-2 text-lg font-bold text-ink">{site.legalName}</p>
              <p className="mt-3 break-keep text-sm leading-relaxed text-ink-soft">
                2017년 세종에 설립된 인증 사회적기업(제2020-227호)이자 KIDP 종합
                산업디자인전문회사입니다. 친환경 그래픽 노면표시재 기반 노면표시·안전표지의
                시공과 정기 시설 관리, 전용 마스코트·웹툰·디자인 시스템 구독을 제공합니다.
              </p>
              <p className="mt-5 text-sm text-ink-soft">
                취재·자료 요청은{" "}
                <Link href="/contact" className="font-semibold text-teal-700">
                  문의
                </Link>
                {" "}또는 {site.email} 로 부탁드립니다.
              </p>
            </div>

            <nav className="mt-10 grid gap-3 sm:grid-cols-2">
              {prev ? (
                <Link
                  href={`/news/${prev.slug}`}
                  className="rounded-2xl border border-line bg-white p-5 transition hover:border-teal-700/40"
                >
                  <span className="text-xs font-semibold text-ink-soft">다음 소식</span>
                  <span className="mt-1 block break-keep text-sm font-bold text-ink">
                    {prev.title}
                  </span>
                </Link>
              ) : (
                <span />
              )}
              {next ? (
                <Link
                  href={`/news/${next.slug}`}
                  className="rounded-2xl border border-line bg-white p-5 transition hover:border-teal-700/40 sm:text-right"
                >
                  <span className="text-xs font-semibold text-ink-soft">이전 소식</span>
                  <span className="mt-1 block break-keep text-sm font-bold text-ink">
                    {next.title}
                  </span>
                </Link>
              ) : null}
            </nav>
          </article>
        </Container>
      </section>
    </>
  );
}
