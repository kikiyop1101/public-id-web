import Link from "next/link";
import Container from "@/components/Container";

// 2026-08-25 홈 리디자인 — 참조: notion(대형 타이포 리스트). 홈에서 갈래는 딱 셋:
// 상세(가격표·사례·플랜)는 각 페이지가 맡고, 홈은 방향만 정확히 가리킨다(섹션 다이어트 9→5).
const GATES = [
  {
    href: "/subscribe",
    label: "디자인 구독",
    desc: "전용 마스코트 · 매월 웹툰 · 디자인 시스템 — Basic 연 110만원부터",
  },
  {
    href: "/products",
    label: "제품 · 시공",
    desc: "노면표시 · 안전표지 · 직물시트 · 명화/지도 출력 — 시공 후 1년 관리까지",
  },
  {
    href: "/os",
    label: "우리회사OS",
    desc: "소상공인을 위한 AI 자동화 템플릿 — 무료 진단으로 시작",
  },
];

export default function ProductGateway() {
  return (
    <section className="border-t border-line bg-paper">
      <Container className="py-20 sm:py-28">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          What We Offer
        </p>
        <h2 className="mt-3 max-w-3xl break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
          디자인이 필요한 순간,
          <br />셋 중 하나에서 시작하세요.
        </h2>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {GATES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group flex flex-col gap-1 py-7 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="text-2xl font-extrabold tracking-tight text-ink transition group-hover:text-teal-700 sm:text-3xl">
                  {g.label}
                  <span className="ml-2 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span className="break-keep text-ink-soft sm:max-w-md sm:text-right">
                  {g.desc}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
