import { preload } from "react-dom";
import Button from "@/components/Button";

// LCP 후보(아치 창 사진 — 데스크톱·모바일 공용) — SVG <image>는 priority 힌트를 못 받아 preload로 보강 (2026-08-26 감사)
const HERO_IMG = "/products/친환경그래픽노면표시재-노란발자국/참조04.jpg";

// 아치(다리) SVG — 데스크톱(우측 대형)과 모바일(본문 아래 인라인) 두 벌로 그린다.
// 같은 문서에 두 번 들어가므로 그라디언트·클립패스 id는 suffix로 분리(중복 id 금지).
function ArchSvg({
  suffix,
  className,
  label,
  viewBox = "0 0 900 560",
}: {
  suffix: string;
  className: string;
  label?: string;
  viewBox?: string;
}) {
  const id = (name: string) => `${name}-${suffix}`;
  return (
    <svg
      aria-hidden={label ? undefined : true}
      role={label ? "img" : undefined}
      aria-label={label}
      viewBox={viewBox}
      className={className}
      fill="none"
    >
      <defs>
        <linearGradient id={id("pi-arch")} x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#CADA1F" />
          <stop offset="42%" stopColor="#7cc63f" />
          <stop offset="100%" stopColor="#069CBB" />
        </linearGradient>
        {/* 인쇄 그레인 — 잉크가 종이에 앉은 질감(밴딩 제거 + 필름 포스터 느낌) */}
        <filter id={id("pi-grain")}>
          <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
          <feColorMatrix
            in="noise"
            type="matrix"
            values="0 0 0 0 0.086  0 0 0 0 0.188  0 0 0 0 0.239  0 0 0 0.5 0"
            result="tint"
          />
          <feComposite in="tint" in2="SourceGraphic" operator="in" />
        </filter>
        {/* 아치 창 — 다리 아래로 실제 거리(노란발자국 시공 현장)가 보인다.
            레퍼런스 교훈(vestre·arup·toss 08-23 채택): 실사가 첫 화면에 있어야 시공 회사로 읽힌다. */}
        <clipPath id={id("pi-arch-window")}>
          <path d="M 202 560 A 278 278 0 0 1 758 560 Z" />
        </clipPath>
      </defs>
      <image
        href={HERO_IMG}
        x="202"
        y="282"
        width="556"
        height="278"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${id("pi-arch-window")})`}
        className="arch-fade"
      />
      {/* 본 아치 — 로고의 다리 */}
      <path
        d="M 150 560 A 330 330 0 0 1 810 560"
        stroke={`url(#${id("pi-arch")})`}
        strokeWidth="88"
        strokeLinecap="round"
        pathLength={1}
        className="arch-draw"
      />
      {/* 그레인 레이어 — 본 아치 위에만 얹힌다 */}
      <path
        d="M 150 560 A 330 330 0 0 1 810 560"
        stroke="#16303D"
        strokeWidth="88"
        strokeLinecap="round"
        filter={`url(#${id("pi-grain")})`}
        opacity="0.16"
        pathLength={1}
        className="arch-draw"
      />
    </svg>
  );
}

// 2026-08-25 홈 리디자인 시안 v4 — 참조: vercel(무채+심볼 하나) + 리서치 반영(last30days 08-25):
//  · 그레인 그라디언트(인쇄 질감 — 2026 SaaS 히어로 지배 트렌드, 우리 타이벡/인쇄 정체성과 일치)
//  · 아치 draw-in 1회(무한 반복 애니는 실측 반감 — reduced-motion 시 정지 상태로)
//  · 스태거 텍스트 리빌(Stripe/Apple식 순차 등장 — 과한 연출 대신 절제)
// 심볼 = 로고의 다리(아치) 그라디언트. 창작 도형 없음.
export default function Hero() {
  preload(HERO_IMG, { as: "image", fetchPriority: "high" });
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      {/* 대형 아치(다리) — 데스크톱: 우측에서 페이지가 열리며 한 번 그려진다 */}
      <ArchSvg
        suffix="d"
        className="pointer-events-none absolute -right-[14%] bottom-0 hidden h-[88%] w-auto sm:block lg:-right-[8%]"
      />
      {/* 바닥 글로우 — 아치가 바닥에 비치는 빛 */}
      <div
        aria-hidden
        className="arch-fade pointer-events-none absolute -bottom-24 right-[6%] h-[280px] w-[420px] rounded-full bg-arch opacity-[0.10] blur-[100px]"
      />
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex min-h-[76vh] flex-col justify-center py-24">
          <p
            className="hero-rise font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700"
            style={{ animationDelay: "0.05s" }}
          >
            Design for Public
          </p>
          <h1 className="mt-5 max-w-3xl break-keep text-4xl font-extrabold leading-[1.08] tracking-tight text-ink sm:text-6xl lg:text-[76px]">
            <span className="hero-rise block" style={{ animationDelay: "0.15s" }}>
              일상과 안전을 잇는
            </span>
            <span className="hero-rise block" style={{ animationDelay: "0.3s" }}>
              디자인 다리를 놓습니다.
            </span>
          </h1>
          <p
            className="hero-rise mt-6 max-w-xl break-keep text-lg leading-relaxed text-ink-soft"
            style={{ animationDelay: "0.45s" }}
          >
            친환경 노면표시·안전표지의 시공과 관리, 그리고 매달 도착하는 디자인
            구독까지 — 공공과 작은 회사의 디자인 파트너, 퍼블릭아이디.
          </p>
          <div
            className="hero-rise mt-9 flex flex-wrap items-center gap-3"
            style={{ animationDelay: "0.6s" }}
          >
            <Button href="/contact" variant="arch" size="lg">
              상담·견적 문의
            </Button>
            <Button href="/products" variant="outline" size="lg">
              제품 보기
            </Button>
          </div>
          {/* 모바일 — 같은 아치를 본문 아래에 인라인으로 그린다
              (종전 반원 사진+띠는 아치로 안 읽힘 — 대표 지적 2026-08-26 "폰에선 아치가 표현이 안 된다") */}
          <div
            className="hero-rise mt-10 sm:hidden"
            style={{ animationDelay: "0.75s" }}
          >
            <ArchSvg
              suffix="m"
              viewBox="100 180 760 380"
              className="mx-auto h-auto w-full max-w-[400px]"
              label="아치(다리) 아래로 보이는 노란발자국 시공 현장 — 횡단보도 앞 보도의 안심 대기선"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
