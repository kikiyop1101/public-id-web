import Link from "next/link";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import { news } from "@/lib/news";

// 2026-08-26 신설 — 홈에 최신 소식 노출(리서치 권고: 최신 활동은 "살아있는 회사" 신호이자
// 네이버 유입 보강). 정적 news 데이터만 사용해 실패 지점이 없다. 슬림 리스트 1개 섹션.
export default function NewsStrip() {
  const latest = news.slice(0, 3);
  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              News
            </p>
            <h2 className="mt-3 break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
              현장에서 온 최신 소식
            </h2>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            <Link href="/news" className="text-teal-700 transition hover:text-teal">
              소식 전체 보기 →
            </Link>
            <Link href="/blog" className="text-teal-700 transition hover:text-teal">
              블로그 →
            </Link>
            <a
              href={site.blog}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 transition hover:text-teal"
            >
              네이버 블로그 ↗
            </a>
          </div>
        </div>
        <ul className="mt-8 divide-y divide-line border-y border-line">
          {latest.map((n) => (
            <li key={n.slug}>
              <Link
                href="/news"
                className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-baseline sm:gap-6"
              >
                <span className="shrink-0 font-display text-sm font-semibold text-ink-soft">
                  {n.year}
                </span>
                <span className="min-w-0">
                  <span className="block break-keep font-bold text-ink transition group-hover:text-teal-700">
                    {n.title}
                  </span>
                  <span className="mt-1 block break-keep text-sm leading-relaxed text-ink-soft sm:line-clamp-1">
                    {n.summary}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
