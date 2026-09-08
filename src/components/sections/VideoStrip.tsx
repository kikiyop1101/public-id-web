import Link from "next/link";
import Container from "@/components/Container";
import LiteYouTube from "@/components/LiteYouTube";
import { site } from "@/lib/site";
import { homeVideos } from "@/lib/videos";

// 2026-09-08 신설 — 홈에 롱폼 설명영상 3편(파사드). 클릭 전엔 썸네일뿐이라 홈 무게는 거의 늘지 않는다.
// 롱폼(3~7분)을 앞세우는 이유: 한 편 재생이 그대로 체류 몇 분이다(체류시간 기획안 2안).
export default function VideoStrip() {
  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-28">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Videos
            </p>
            <h2 className="mt-3 break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
              3분이면 이해되는 퍼블릭아이디
            </h2>
            <p className="mt-3 max-w-xl break-keep text-[15px] leading-relaxed text-ink-soft">
              제품·구독 시리즈별 설명영상 30편과 쇼츠 40여 편. 여기서 바로 재생됩니다.
            </p>
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
          {homeVideos.map((v) => (
            <li key={v.id}>
              <LiteYouTube id={v.id} title={v.title} place="home" />
              <p className="mt-3 break-keep text-[15px] font-bold leading-snug text-ink">{v.title}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                설명영상 · {v.series}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
