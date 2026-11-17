import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";
import { newsKind, type NewsItem } from "@/lib/news";

// 소식(/news) 목록. 2026-11-17 '전체 소식 / 보도자료' 탭을 없앴다 — 게시물 43건이 전부 보도자료라 두 탭이 같은 목록이었다
// (/press → /news 301). 종류가 다른 글이 생기면 newsKind 라벨(카드 맨 위)이 구분한다. 게시물엔 날짜가 없다(대표 확정 09-08), 순서 = 최신순.
export default function NewsListSection({ items }: { items: NewsItem[] }) {
  return (
    <section className="py-14 sm:py-20">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="flex flex-col gap-6">
            {items.length === 0 ? (
              <p className="rounded-3xl border border-line bg-white p-8 text-sm text-ink-soft">
                아직 올라온 글이 없습니다.
              </p>
            ) : null}
            {items.map((n, i) => (
              <Reveal key={n.slug} delay={Math.min(i, 6) * 60}>
                <article
                  id={n.slug}
                  className="cv-defer group scroll-mt-24 rounded-3xl [--cv:420px] border border-line bg-white p-7 shadow-sm transition hover:border-teal-700/40 sm:p-9"
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
                    className="-mb-3 mt-2 inline-flex items-center gap-1 py-3 text-sm font-semibold text-teal-700 transition hover:text-teal"
                  >
                    전문 읽기 →
                  </Link>
                </article>
              </Reveal>
            ))}
          </div>
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
  );
}
