import Button from "@/components/Button";

// 2026-08-25 홈 리디자인 시안 v3 — 참조: vercel(무채 바탕 + 브랜드 심볼 하나 + 대형 타이포)
// 심볼 = 로고의 다리(아치) 그라디언트. design.md: "브랜드의 성격은 아치 그라디언트가 혼자 짊어진다"
// — 정본 시그니처(라임→청록 95°)를 히어로 스케일로 키운 것. 창작 도형 없음.
export default function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      {/* 대형 아치(다리) — 오른쪽에서 떠오르는 정본 그라디언트 밴드 */}
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
        </defs>
        {/* 본 아치 — 로고의 다리 */}
        <path
          d="M 150 560 A 330 330 0 0 1 810 560"
          stroke="url(#pi-arch)"
          strokeWidth="88"
          strokeLinecap="round"
        />
        {/* 에코 아치 — 얇게 한 번 더(로고의 겹아치 문법) */}
        <path
          d="M 258 560 A 222 222 0 0 1 702 560"
          stroke="url(#pi-arch-soft)"
          strokeWidth="30"
          strokeLinecap="round"
        />
      </svg>
      {/* 바닥 글로우 — 아치가 바닥에 비치는 빛 */}
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-24 right-[6%] h-[280px] w-[420px] rounded-full bg-arch opacity-[0.10] blur-[100px]"
      />
      <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
        <div className="flex min-h-[76vh] flex-col justify-center py-24">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Design for Public
          </p>
          <h1 className="mt-5 max-w-3xl break-keep text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-6xl lg:text-[72px]">
            일상과 안전을 잇는
            <br />
            디자인 다리를 놓습니다.
          </h1>
          <p className="mt-6 max-w-xl break-keep text-lg leading-relaxed text-ink-soft">
            친환경 노면표시·안전표지의 시공과 관리, 그리고 매달 도착하는 디자인
            구독까지 — 공공과 작은 회사의 디자인 파트너, 퍼블릭아이디.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3">
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
