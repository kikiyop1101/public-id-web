import Button from "@/components/Button";

// 2026-08-25 홈 리디자인 시안 v4 — 참조: vercel(무채+심볼 하나) + 리서치 반영(last30days 08-25):
//  · 그레인 그라디언트(인쇄 질감 — 2026 SaaS 히어로 지배 트렌드, 우리 타이벡/인쇄 정체성과 일치)
//  · 아치 draw-in 1회(무한 반복 애니는 실측 반감 — reduced-motion 시 정지 상태로)
//  · 스태거 텍스트 리빌(Stripe/Apple식 순차 등장 — 과한 연출 대신 절제)
// 심볼 = 로고의 다리(아치) 그라디언트. 창작 도형 없음.
export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      {/* 대형 아치(다리) — 페이지가 열리며 한 번 그려진다 */}
      <svg
        aria-hidden
        viewBox="0 0 900 560"
        className="pointer-events-none absolute -right-[14%] bottom-0 hidden h-[88%] w-auto sm:block lg:-right-[8%]"
        fill="none"
      >
        <defs>
          <linearGradient id="pi-arch" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#CADA1F" />
            <stop offset="42%" stopColor="#7cc63f" />
            <stop offset="100%" stopColor="#069CBB" />
          </linearGradient>
          <linearGradient id="pi-arch-soft" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#CADA1F" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#069CBB" stopOpacity="0.25" />
          </linearGradient>
          {/* 인쇄 그레인 — 잉크가 종이에 앉은 질감(밴딩 제거 + 필름 포스터 느낌) */}
          <filter id="pi-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" result="noise" />
            <feColorMatrix
              in="noise"
              type="matrix"
              values="0 0 0 0 0.086  0 0 0 0 0.188  0 0 0 0 0.239  0 0 0 0.5 0"
              result="tint"
            />
            <feComposite in="tint" in2="SourceGraphic" operator="in" />
          </filter>
        </defs>
        {/* 본 아치 — 로고의 다리 */}
        <path
          d="M 150 560 A 330 330 0 0 1 810 560"
          stroke="url(#pi-arch)"
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
          filter="url(#pi-grain)"
          opacity="0.16"
          pathLength={1}
          className="arch-draw"
        />
        {/* 에코 아치 — 본 아치가 그려진 뒤 은은히 */}
        <path
          d="M 258 560 A 222 222 0 0 1 702 560"
          stroke="url(#pi-arch-soft)"
          strokeWidth="30"
          strokeLinecap="round"
          className="arch-fade"
        />
      </svg>
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
              구독 상담
            </Button>
            <Button href="/products" variant="outline" size="lg">
              제품 보기
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
