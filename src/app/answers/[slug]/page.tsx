import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { pageMeta } from "@/lib/seo";
import Container from "@/components/Container";
import Button from "@/components/Button";
import BreadcrumbLd from "@/components/BreadcrumbLd";
import FaqBlock from "@/components/FaqBlock";
import { site } from "@/lib/site";
import { answers, getAnswer } from "@/lib/answers";

// 질문 답변 개별 페이지 — 데이터는 src/content/answers.json(정적)이라 빌드 시 전부 생성한다.
// 구조: 직답 → 확인 기준표 → 퍼블릭아이디의 방식 → FAQ(FAQPage JSON-LD) → 다음 행동.
export const dynamicParams = false;

export function generateStaticParams() {
  return answers.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getAnswer(slug);
  if (!item) return {};
  return pageMeta({
    title: item.question,
    description: item.description,
    path: `/answers/${item.slug}`,
    markdown: true,
    ogType: "article",
  });
}

export default async function AnswerDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = getAnswer(slug);
  if (!item) notFound();

  const others = answers.filter((a) => a.slug !== item.slug);
  const [primary, ...secondary] = item.actions;

  // 날짜는 화면에 내지 않고 dateModified만 기계용으로 낸다.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: item.question,
    description: item.description,
    inLanguage: "ko-KR",
    dateModified: item.dateModified,
    image: `${site.url}/og.png`,
    mainEntityOfPage: `${site.url}/answers/${item.slug}`,
    author: { "@type": "Organization", name: site.legalName, url: site.url },
    publisher: {
      "@type": "Organization",
      name: site.legalName,
      logo: { "@type": "ImageObject", url: `${site.url}/logo.png` },
    },
  };

  const List = item.ours.ordered ? "ol" : "ul";

  return (
    <>
      <BreadcrumbLd
        trail={[
          { name: "질문 답변", path: "/answers" },
          { name: item.question, path: `/answers/${item.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      <article>
        <section className="py-16 sm:py-24">
          <Container>
            <div className="mx-auto max-w-3xl">
              <Link href="/answers" className="text-sm font-semibold text-teal-700 transition hover:text-teal">
                ← 질문 답변 목록
              </Link>
              <div className="mt-8 h-1.5 w-12 rounded-full bg-arch" />
              <p className="mt-5 font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Answer
              </p>
              <h1 className="mt-3 break-keep text-3xl font-extrabold leading-[1.22] tracking-tight text-ink sm:text-[34px]">
                {item.question}
              </h1>
              <p className="mt-6 break-keep border-l-4 border-teal pl-5 text-lg leading-relaxed text-ink">
                {item.answer}
              </p>

              <h2 className="mt-14 break-keep text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">
                {item.table.title}
              </h2>
              <p className="mt-3 text-xs text-ink-soft sm:hidden">표는 옆으로 밀어서 볼 수 있습니다.</p>
              {/* 좁은 화면에서 가로 스크롤되는 표 — 키보드로도 스크롤하도록 포커스 가능 영역 */}
              <div
                tabIndex={0}
                role="region"
                aria-label={item.table.title}
                className="mt-4 overflow-x-auto rounded-2xl border border-line sm:mt-6"
              >
                <table className="w-full min-w-[560px] border-collapse text-left text-sm">
                  <thead className="bg-cloud">
                    <tr>
                      {item.table.columns.map((c) => (
                        <th key={c} scope="col" className="break-keep px-4 py-3 font-semibold text-ink">
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-line bg-white">
                    {item.table.rows.map((row) => (
                      <tr key={row[0]}>
                        {row.map((cell, ci) =>
                          ci === 0 ? (
                            <th key={ci} scope="row" className="break-keep px-4 py-3 align-top font-semibold text-ink">
                              {cell}
                            </th>
                          ) : (
                            <td key={ci} className="break-keep px-4 py-3 align-top leading-relaxed text-ink-soft">
                              {cell}
                            </td>
                          ),
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h2 className="mt-14 break-keep text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">
                {item.ours.title}
              </h2>
              <List className="mt-6 space-y-5">
                {item.ours.items.map((o, i) => (
                  <li key={o.title} className="flex gap-4">
                    <span
                      aria-hidden
                      className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-teal-100 text-sm font-bold text-teal-700"
                    >
                      {item.ours.ordered ? i + 1 : <span className="h-2 w-2 rounded-full bg-teal-700" />}
                    </span>
                    <div>
                      <h3 className="break-keep text-lg font-bold text-ink">{o.title}</h3>
                      <p className="mt-1.5 break-keep leading-relaxed text-ink-soft">{o.text}</p>
                    </div>
                  </li>
                ))}
              </List>
            </div>
          </Container>
        </section>

        <FaqBlock title="자주 묻는 질문" items={item.faq} />

        <section className="py-20 sm:py-28">
          <Container>
            <div className="mx-auto max-w-3xl">
              <div className="rounded-3xl border border-line bg-cloud/50 p-7 sm:p-9">
                <h2 className="break-keep text-2xl font-bold text-ink sm:text-3xl">다음 단계</h2>
                <p className="mt-3 break-keep leading-relaxed text-ink-soft">
                  가격은 모두 기준가이며, 정확한 금액과 일정은 현장 조건을 확인한 뒤 안내해 드립니다. 전화{" "}
                  {site.tel} · {site.email}
                </p>
                <div className="mt-6 flex flex-wrap gap-3">
                  {primary ? <Button href={primary.href}>{primary.label}</Button> : null}
                  {secondary.map((a) => (
                    <Button key={a.href} href={a.href} variant="outline">
                      {a.label}
                    </Button>
                  ))}
                </div>
              </div>

              <h2 className="mt-14 text-xl font-bold text-ink">다른 질문</h2>
              <ul className="mt-4 divide-y divide-line border-y border-line">
                {others.map((a) => (
                  <li key={a.slug}>
                    <Link
                      href={`/answers/${a.slug}`}
                      className="block break-keep py-4 text-[15px] font-semibold text-ink transition hover:text-teal-700"
                    >
                      {a.question}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </Container>
        </section>
      </article>
    </>
  );
}
