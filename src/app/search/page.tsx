import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import OpenAssistantButton from "@/components/OpenAssistantButton";
import { searchSite } from "@/lib/site-search";
import { site } from "@/lib/site";

// 검색 주소 /search?q= (2026-10-08 엑사 구조 대조) — 홈 질문창이 자바스크립트 없이도 닿는 곳이자,
// AI 에이전트·WebSite SearchAction이 쓰는 주소. Accept: text/markdown이면 proxy.ts가 /md/search로 넘긴다.
// 검색 결과 쪽이라 색인하지 않는다(엑사도 robots에서 /search를 막는다).
export const metadata: Metadata = pageMeta({
  title: "사이트 검색",
  description: "퍼블릭아이디 홈페이지의 제품·우리회사OS·구독·소식·질문 답변을 한 번에 찾습니다.",
  path: "/search",
  robots: { index: false, follow: true },
});

const SUGGEST = ["스쿨존 노면표시", "노란발자국 가격", "AI 업무 자동화", "홈페이지 제작", "수의계약"];

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string | string[] }> }) {
  const raw = (await searchParams).q;
  const q = (Array.isArray(raw) ? raw[0] : raw ?? "").trim().slice(0, 60);
  const hits = q ? searchSite(q, 20) : [];

  return (
    <>
      <PageHero eyebrow="Search" title={q ? <>‘{q}’ 검색 결과</> : "무엇을 찾으세요?"} />
      <section className="py-16 sm:py-20">
        <Container>
          <form action="/search" role="search" className="mx-auto flex max-w-3xl gap-2">
            <label htmlFor="site-q" className="sr-only">
              검색어
            </label>
            <input
              id="site-q"
              name="q"
              defaultValue={q}
              maxLength={60}
              placeholder="예: 스쿨존 노면표시 견적"
              className="h-12 min-w-0 flex-1 rounded-full border border-line-input bg-white px-5 text-base text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20"
            />
            <button type="submit" className="h-12 shrink-0 rounded-full bg-navy px-6 text-sm font-semibold text-white transition hover:bg-teal">
              찾기
            </button>
          </form>

          <div className="mx-auto mt-10 max-w-3xl">
            {q && hits.length > 0 && (
              <ul className="grid gap-3">
                {hits.map((h) => (
                  <li key={h.href}>
                    <Link
                      href={h.href}
                      {...(h.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      className="group block rounded-2xl border border-line bg-white p-5 shadow-sm transition hover:border-teal sm:p-6"
                    >
                      <span className="text-xs font-semibold text-teal-700">{h.group}</span>
                      <span className="mt-1 block break-keep text-lg font-bold leading-snug text-ink group-hover:text-teal-700">
                        {h.label}
                      </span>
                      <span className="mt-1.5 line-clamp-2 block break-keep text-[15px] leading-relaxed text-ink-soft">{h.desc}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            {(!q || hits.length === 0) && (
              <div className="rounded-2xl border border-line bg-white/70 p-6 sm:p-7">
                <p className="break-keep text-ink-soft">
                  {q ? "맞는 페이지를 찾지 못했습니다. 이렇게 찾아보시거나, 도우미에게 바로 물어보세요." : "자주 찾는 말로 시작해 보세요."}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {SUGGEST.map((s) => (
                    <Link
                      key={s}
                      href={`/search?q=${encodeURIComponent(s)}`}
                      className="rounded-full border border-line bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft transition hover:border-teal hover:text-teal-700"
                    >
                      {s}
                    </Link>
                  ))}
                </div>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <OpenAssistantButton />
                  <span className="text-sm text-ink-soft">
                    또는 전화 <a href={`tel:${site.tel}`} className="font-semibold text-ink">{site.tel}</a>
                  </span>
                </div>
              </div>
            )}
          </div>
        </Container>
      </section>
    </>
  );
}
