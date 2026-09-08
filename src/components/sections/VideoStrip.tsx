import Link from "next/link";
import Container from "@/components/Container";
import LiteYouTube from "@/components/LiteYouTube";
import { site } from "@/lib/site";
import { homeVideos } from "@/lib/videos";

// 2026-09-08 신설 — 홈에 우리 영상 3편(파사드). 클릭 전엔 썸네일뿐이라 홈 무게는 거의 늘지 않는다.
// 삽입 위치: app/page.tsx의 <ShowcaseStrip /> 아래. 구조·타이포는 NewsStrip과 동일.
export default function VideoStrip() {
  const latest = homeVideos.slice(0, 3);
  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Videos
            </p>
            <h2 className="mt-3 break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
              1분이면 이해되는 퍼블릭아이디
            </h2>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm font-semibold">
            <Link href="/videos" className="text-teal-700 transition hover:text-teal">
              영상관 전체 보기 →
            </Link>
            <a
              href={site.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="text-teal-700 transition hover:text-teal"
            >
              유튜브 채널 ↗
            </a>
          </div>
        </div>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((v) => (
            <li key={v.id}>
              <LiteYouTube id={v.id} title={v.title} place="home" />
              <p className="mt-3 break-keep text-[15px] font-bold leading-snug text-ink">{v.title}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                {v.category}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
