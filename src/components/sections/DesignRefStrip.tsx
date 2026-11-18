import Container from "@/components/Container";
import { site } from "@/lib/site";

type DesignRef = { title: string; kind?: string; date: string; url: string; thumb: string };

// 디자인 시안 레퍼런스 최근 4건 — 시안 사이트(public-greensign.com)의 레퍼런스에 올린 것이 1시간 안에 여기에도 따라온다
// (2026-11-19 대표 "홈페이지 첫 화면에 디자인 결과물을 그림으로"). 작품 줄(ShowcaseStrip) 바로 아래 같은 흰 면에 이어 붙는다.
// 불러오기 실패·0건이면 아무것도 그리지 않는다(NaverBlogFeed와 같은 방식).
export default async function DesignRefStrip() {
  let refs: DesignRef[];
  try {
    const res = await fetch(`${site.designShare}/refs.json`, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    refs = ((await res.json()) as DesignRef[]).slice(0, 4);
  } catch {
    return null;
  }
  if (!refs.length) return null;

  return (
    <section className="bg-white pb-20 sm:pb-28">
      <Container className="pt-8 sm:pt-12">
        <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-2">
          <h3 className="break-keep text-xl font-bold text-ink">디자인 시안 레퍼런스</h3>
          <a
            href={site.designShare}
            target="_blank"
            rel="noopener"
            className="text-sm font-semibold text-teal-700 hover:underline"
          >
            시안 레퍼런스 전체 보기 →
          </a>
        </div>
        <ul className="mt-6 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-4 lg:gap-x-6">
          {refs.map((r) => (
            <li key={r.url}>
              <a href={r.url} target="_blank" rel="noopener" className="group block">
                <span className="relative block aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-cloud">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={r.thumb}
                    alt=""
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-3 h-[calc(100%-1.5rem)] w-[calc(100%-1.5rem)] object-contain transition duration-500 group-hover:scale-[1.03]"
                  />
                </span>
                {r.kind ? (
                  <span className="mt-3 block text-xs font-semibold text-teal-700">{r.kind}</span>
                ) : null}
                <span className="mt-1 block break-keep text-[15px] font-bold leading-snug text-ink">
                  {r.title}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
