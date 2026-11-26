import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

// 2026-11-27 대표 "모르는 사람이 궁금함을 가지고 누를 수 있게" — 3D 디지털 디오라마(/diorama, 정적 three.js 페이지) 입구.
// 그림 = 세이프타운 마지막 장면(Blender). 물음표 점 = 그 카메라로 제품 자리를 투영한 위치(%)
// (디지털-디오라마\scripts\project_dots.py) — 건물에 가린 자리는 뺐다. 노랑 점 = 제품 지시라 노랑을 쓴다(design.md).
const DOTS = [
  { x: 43.2, y: 41.5, label: "노란발자국" },
  { x: 33.0, y: 29.8, label: "안전놀이표지" },
  { x: 54.9, y: 40.5, label: "스몸비 보행주의" },
  { x: 73.0, y: 49.7, label: "버스정류소 주정차금지" },
  { x: 59.5, y: 65.1, label: "웨이파인딩" },
];
const HREF = "/diorama";

export default function DioramaTeaser() {
  return (
    <section id="diorama" className="cv-defer scroll-mt-24 bg-white">
      <Container className="py-20 sm:py-28">
        <div className="grid items-center gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">3D Digital Diorama</p>
            <h2 className="mt-3 break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
              이 동네엔 안전 장치
              <br />
              18곳이 숨어 있습니다
            </h2>
            <p className="mt-4 max-w-xl break-keep text-lg leading-relaxed text-ink-soft">
              그림에 표시한 건 5곳뿐입니다. 나머지 13곳은 어디 있을까요? 동네를 끌어서 돌려 보고, 번호를 누르면 그 자리로 날아가
              무엇인지 보여 드립니다.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2 text-sm font-semibold text-ink-soft">
              <li className="rounded-full border border-line bg-white px-3.5 py-1.5">가입 없이</li>
              <li className="rounded-full border border-line bg-white px-3.5 py-1.5">휴대폰에서도</li>
              <li className="rounded-full border border-line bg-white px-3.5 py-1.5">실제 크기 · 실제 디자인</li>
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href={HREF}
                className="inline-flex h-14 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-arch px-7 text-[15px] font-semibold text-white shadow-lg shadow-teal/20 transition duration-300 hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
              >
                나머지 13곳 찾으러 가기 <span aria-hidden="true">→</span>
              </a>
              <span className="text-sm text-ink-soft">1분이면 충분합니다</span>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <a
              href={HREF}
              aria-label="3D 디지털 디오라마 열기 — 숨은 안전 장치 18곳 찾기"
              className="group relative block overflow-hidden rounded-3xl border border-line bg-[#c9d0cf] shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-teal/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2 motion-reduce:transition-none"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/diorama-3d/img/teaser.webp"
                alt="퍼블릭아이디 세이프타운 3D 디오라마 — 흰 모형 동네에 우리 제품만 실제 색으로 놓였다"
                width={1600}
                height={900}
                loading="lazy"
                decoding="async"
                className="block h-auto w-full transition duration-700 group-hover:scale-[1.02] motion-reduce:transition-none"
              />
              {DOTS.map((d, i) => (
                <span
                  key={d.label}
                  aria-hidden="true"
                  className="pointer-events-none absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${d.x}%`, top: `${d.y}%` }}
                >
                  <span
                    className="absolute inset-0 rounded-full bg-yellow/70 motion-safe:animate-ping"
                    style={{ animationDelay: `${i * 0.35}s`, animationDuration: "2.4s" }}
                  />
                  <span className="relative grid h-7 w-7 place-items-center rounded-full bg-yellow text-[13px] font-extrabold text-navy shadow-md ring-2 ring-white sm:h-8 sm:w-8">
                    ?
                  </span>
                </span>
              ))}
              <span className="absolute bottom-3 left-3 rounded-full bg-white/95 px-4 py-2 text-sm font-bold text-navy shadow-sm sm:bottom-5 sm:left-5">
                5곳 발견 · 13곳 더 숨어 있어요
              </span>
              <span className="absolute right-3 top-3 rounded-full bg-navy/80 px-3 py-1 font-display text-xs font-semibold text-white sm:right-5 sm:top-5">
                3D · 끌어서 돌려 보기
              </span>
            </a>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
