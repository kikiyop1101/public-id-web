import Link from "next/link";
import Container from "@/components/Container";
import CountUp from "@/components/CountUp";

// 2026-08-26 업그레이드 — 텍스트 나열 → "숫자+근거" 스탯 밴드(리서치: B2B 신뢰는
// 인증명 나열이 아니라 정량 증거. Stripe 스탯 블록 패턴). 값은 전부 공개 확정 사실만
// (assistant-knowledge.ts 절대 규칙 — 회사 규모 수치는 비공개라 쓰지 않는다).
// 2026-09-03 숫자는 뷰포트 진입 시 1회 카운트업(design.md §5 스크롤 연동 ③) — SSR·reduced-motion 은 최종값.
const stats: { num: number | string; from?: number; unit: string; desc: string }[] = [
  {
    num: 2017,
    from: 2000,
    unit: "년부터",
    desc: "세종에서 전국으로, 공공 디자인 한 길",
  },
  {
    num: 46,
    from: 0,
    unit: "BPN",
    desc: "미끄럼저항 — 서울시 보도 기준(45+) 충족",
  },
  {
    num: "특허",
    unit: "보유",
    desc: "자체 특허 · 국제 특허의 노면표시재",
  },
  {
    num: 3,
    from: 0,
    unit: "개 인증",
    desc: "KIDP 산업디자인전문회사 · 사회적기업 · GD",
  },
];

export default function TrustBar() {
  return (
    <section className="border-y border-line bg-cloud/60">
      <Container className="py-10 sm:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="text-sm font-medium text-ink-soft">
            관공서 · 공공기관 · 기업 · 소상공인이 신뢰하는 디자인 파트너
          </p>
          <Link
            href="/credibility"
            className="text-sm font-semibold text-teal-700 transition hover:text-teal"
          >
            실적·인증 전체 보기 →
          </Link>
        </div>
        <dl className="mt-6 grid grid-cols-2 gap-x-6 gap-y-7 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.desc}>
              <dt className="sr-only">{s.desc}</dt>
              <dd>
                <p className="font-display text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                  {typeof s.num === "number" ? (
                    <CountUp to={s.num} from={s.from} />
                  ) : (
                    s.num
                  )}
                  <span className="text-base font-semibold text-teal-700">
                    {s.unit}
                  </span>
                </p>
                <p className="mt-1.5 break-keep text-sm leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}
