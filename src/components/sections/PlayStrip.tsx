import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import LiteYouTube from "@/components/LiteYouTube";
import { site } from "@/lib/site";
import { homeVideos, LONG_COUNT_LABEL, SHORT_COUNT_LABEL } from "@/lib/videos";

// 2026-09-08 체류시간 기획안 — 홈에 "만질거리" 3종을 한 줄로 노출한다.
// 리서치: 정적 페이지 0.8~1.5분 vs 퀴즈 4.5분·계산기 4~7분(Outgrow 2026). 읽을거리가 아니라 만질거리가 체류를 만든다.
// 2026-11-17 홈 다이어트 — 영상 3칸(종전 VideoStrip 섹션)을 이 섹션 아랫줄로 합쳤다(섹션 11 → 10, 제목 하나).
//  · 세 번째 칸 견적 시뮬레이터 → 노란발자국 캠페인 게임: 시뮬레이터는 맞춤 견적 쪽(/quote) 안으로 들어갔고,
//    방문 기록(90일)상 캠페인 게임이 1분 넘게 머문 비율이 가장 높다(29%). 썸네일은 실제 게임 화면.
//  · 영상 3칸 = 롱폼 1 + 최신 쇼츠 2(대표 2026-10-17) 그대로. 클릭 전엔 썸네일뿐이라 무게는 거의 늘지 않는다.
const items = [
  {
    href: "/safety-game",
    eyebrow: "60초 게임",
    title: "숨은 위험 찾기",
    desc: "학교 앞·아파트·공장 장면에서 위험 8곳을 찾고, 찾을 때마다 해결책을 봅니다.",
    cta: "지금 도전",
    img: "/safety-game/scene-school-thumb.webp",
  },
  {
    href: "/campaign-game",
    eyebrow: "3D 캠페인",
    title: "노란발자국 캠페인",
    desc: "횡단보도 앞 인도를 쓸고, 고무망치로 두드려 노란발자국을 붙여 봅니다. 퍼이와 친구들이 함께합니다.",
    cta: "함께 붙이기",
    img: "/games/yellow-footprint-thumb.webp",
  },
  {
    href: "/safety-score",
    eyebrow: "2분 진단",
    title: "우리 동네 안전 점수",
    desc: "통학로 8개 항목에 답하면 점수·등급과 항목별 처방이 바로 나옵니다.",
    cta: "점수 보기",
    img: "/safety-game/scene-apartment-thumb.webp",
  },
];

export default function PlayStrip() {
  return (
    <section id="play" className="cv-defer scroll-mt-24 bg-white">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Try &amp; Watch</p>
          <h2 className="mt-3 break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
            읽지 말고 직접 해 보세요
          </h2>
          <p className="mt-4 max-w-2xl break-keep text-lg leading-relaxed text-ink-soft">
            안전은 설명보다 손으로 해 볼 때 더 잘 보입니다. 게임·캠페인·진단은 가입 없이 바로 되고, 영상은 여기서 바로 재생됩니다.
          </p>
        </Reveal>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.href} delay={i * 80}>
              <Link
                href={it.href}
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white transition hover:-translate-y-0.5 hover:border-teal hover:shadow-lg hover:shadow-teal/10 motion-reduce:transition-none"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-cloud">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={it.img}
                    alt=""
                    width={640}
                    height={357}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03] motion-reduce:transition-none"
                  />
                  <span className="absolute left-4 top-4 rounded-full bg-navy/85 px-3 py-1 font-display text-xs font-semibold text-white">
                    {it.eyebrow}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-xl font-bold text-ink">{it.title}</h3>
                  <p className="mt-2 flex-1 break-keep text-sm leading-relaxed text-ink-soft">{it.desc}</p>
                  <span className="mt-4 inline-flex items-center text-sm font-semibold text-teal-700 transition group-hover:text-teal">
                    {it.cta} →
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>

        {/* 영상 3칸 — 종전 VideoStrip. 같은 섹션의 아랫줄이라 제목은 한 단 낮춘다(h3) */}
        <div className="mt-14 flex flex-wrap items-end justify-between gap-x-6 gap-y-2 border-t border-line pt-10 sm:mt-16">
          <div>
            <h3 className="break-keep text-2xl font-extrabold leading-[1.25] tracking-tight text-ink sm:text-[28px]">
              3분이면 이해되는 퍼블릭아이디
            </h3>
            <p className="mt-2 max-w-xl break-keep text-[15px] leading-relaxed text-ink-soft">
              제품·구독 시리즈별 설명영상 {LONG_COUNT_LABEL}과 쇼츠 {SHORT_COUNT_LABEL}.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 text-sm font-semibold">
            <Link href="/videos" className="inline-flex min-h-11 items-center text-teal-700 transition hover:text-teal">
              영상관 전체 보기 →
            </Link>
            <a
              href={site.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-teal-700 transition hover:text-teal"
            >
              유튜브 채널 ↗
            </a>
          </div>
        </div>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {homeVideos.map((v) => (
            <li key={v.id}>
              <LiteYouTube id={v.id} title={v.title} place="home" />
              <p className="mt-3 break-keep text-[15px] font-bold leading-snug text-ink">{v.title}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
                {v.kind === "long" ? `설명영상 · ${v.series ?? v.category}` : `쇼츠 · ${v.category}`}
              </p>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
