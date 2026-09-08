import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

// 2026-09-08 체류시간 기획안 — 홈에 "만질거리" 3종을 한 줄로 노출한다.
// 리서치: 정적 페이지 0.8~1.5분 vs 퀴즈 4.5분·계산기 4~7분(Outgrow 2026). 읽을거리가 아니라 만질거리가 체류를 만든다.
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
    href: "/safety-score",
    eyebrow: "2분 진단",
    title: "우리 동네 안전 점수",
    desc: "통학로 8개 항목에 답하면 점수·등급과 항목별 처방이 바로 나옵니다.",
    cta: "점수 보기",
    img: "/safety-game/scene-apartment-thumb.webp",
  },
  {
    href: "/estimate",
    eyebrow: "1분 계산",
    title: "견적 시뮬레이터",
    desc: "규격·수량을 슬라이더로 움직이면 기준가 합계가 바로 바뀝니다. 예산 역산도 됩니다.",
    cta: "가늠해 보기",
    img: "/safety-game/scene-factory-thumb.webp",
  },
];

export default function PlayStrip() {
  return (
    <section className="bg-paper">
      <Container className="py-20 sm:py-28">
        <Reveal>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Try it</p>
          <h2 className="mt-3 break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
            읽지 말고 직접 해 보세요
          </h2>
          <p className="mt-4 max-w-2xl break-keep text-lg leading-relaxed text-ink-soft">
            안전은 설명보다 손으로 해 볼 때 더 잘 보입니다. 게임·진단·계산기 세 가지, 가입 없이 바로 됩니다.
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
      </Container>
    </section>
  );
}
