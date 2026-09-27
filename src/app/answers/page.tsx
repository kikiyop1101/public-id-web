import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import BreadcrumbLd from "@/components/BreadcrumbLd";
import { site } from "@/lib/site";
import { answers } from "@/lib/answers";

export const metadata: Metadata = pageMeta({
  title: "질문 답변",
  description:
    "사회적기업 우선구매, 안전시설관리 구독, 스쿨존 친환경 노면표시, 시공 견적, 디자인 구독 연장까지 — 발주 담당자가 자주 묻는 질문에 기준표와 퍼블릭아이디의 사실로 답합니다.",
  path: "/answers",
});

// 목록은 ItemList — 개별 Article·FAQPage는 /answers/[slug]에서 낸다(중복 마크업 방지).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "퍼블릭아이디 질문 답변",
  itemListElement: answers.map((a, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: a.question,
    url: `${site.url}/answers/${a.slug}`,
  })),
};

export default function AnswersPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "질문 답변", path: "/answers" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <PageHero
        eyebrow="Answers"
        title={
          <>
            발주 전에
            <br />
            자주 묻는 질문
          </>
        }
        description="업체 선정, 우선구매, 시공 견적, 사후 관리까지. 확인할 기준을 표로 정리하고 퍼블릭아이디가 실제로 하는 방식을 함께 적었습니다."
      />
      <section className="py-20 sm:py-28">
        <Container>
          <ul className="mx-auto grid max-w-4xl gap-4">
            {answers.map((a) => (
              <li key={a.slug}>
                <Link
                  href={`/answers/${a.slug}`}
                  className="group block rounded-2xl border border-line bg-white p-6 shadow-sm transition hover:border-teal sm:p-7"
                >
                  <h2 className="break-keep text-lg font-bold leading-snug text-ink group-hover:text-teal-700 sm:text-xl">
                    {a.question}
                  </h2>
                  <p className="mt-3 line-clamp-2 break-keep text-[15px] leading-relaxed text-ink-soft">
                    {a.answer}
                  </p>
                  <span className="mt-4 inline-block text-sm font-semibold text-teal-700">
                    답변 보기 <span aria-hidden>→</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
