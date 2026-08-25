import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

// 2026-08-25 홈 리디자인 시안 — 참조: notion(대형 한글 타이포 사이에 캐릭터가 숨 쉬는 배치)
// 갈래는 딱 셋. 문장 하나 + 큰 링크 세 줄 — 히어로에서 뺀 버튼 무리를 여기서 정돈한다.
const GATES = [
  {
    href: "/subscribe",
    label: "디자인 구독",
    desc: "마스코트·웹툰·디자인시스템이 매달 도착",
  },
  {
    href: "/products",
    label: "제품 · 시공",
    desc: "노면표시 · 안전표지 · 직물시트 · 명화/지도 출력",
  },
  {
    href: "/os",
    label: "우리회사OS",
    desc: "소상공인을 위한 AI 자동화 템플릿",
  },
];

export default function ProductGateway() {
  return (
    <section className="border-t border-line bg-paper">
      <Container className="relative py-20 sm:py-28">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          What We Offer
        </p>
        <h2 className="mt-3 max-w-3xl break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
          디자인이 필요한 순간,
          <br />셋 중 하나에서 시작하세요.
        </h2>
        {/* 퍼이 — 카드에 가두지 않고 타이포 곁에 세운다(notion의 손그림 캐릭터 문법) */}
        <Image
          src="/mascot/pui-greet-clear.png"
          alt="퍼블릭아이디 마스코트 퍼이가 손을 흔드는 모습"
          width={150}
          height={150}
          className="pointer-events-none absolute right-5 top-14 hidden w-[120px] sm:block lg:w-[150px]"
        />
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {GATES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group flex flex-col gap-1 py-6 sm:flex-row sm:items-baseline sm:justify-between"
              >
                <span className="text-2xl font-extrabold tracking-tight text-ink transition group-hover:text-teal-700 sm:text-3xl">
                  {g.label}
                  <span className="ml-2 inline-block transition group-hover:translate-x-1">
                    →
                  </span>
                </span>
                <span className="break-keep text-ink-soft sm:text-right">
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
