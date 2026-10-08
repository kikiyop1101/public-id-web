import Link from "next/link";
import Container from "@/components/Container";
import CountUp from "@/components/CountUp";
import { credibility as c } from "@/lib/credibility";

// 2026-08-26 숫자+근거 스탯 밴드 → 2026-10-08 고객사 이름 줄(엑사 홈 "50만 개발자 + 고객 로고 7곳" 구조의 우리 판).
// 숫자 근거(미끄럼저항·인증·특허)는 바로 아래 ProofSection 탭으로 옮겼다.
// 이름은 실적 페이지(/credibility)에 이미 실명 공개된 고객사만(대표 확정 2026-08-26). 숫자는 credibility.ts(매출장 실거래 기준, 금액 없음).
const CLIENTS = [
  "세종특별자치시",
  "서울특별시",
  "경기도청",
  "경기남부경찰청",
  "국립세종수목원",
  "유니세프 한국위원회",
  "세이브더칠드런",
  "스타벅스",
  "현대자동차",
  "유한양행",
  "에버랜드",
];

const B2G = Math.round(c.segmentMix[0].pct);

export default function TrustBar() {
  return (
    <section className="border-y border-line bg-cloud/60">
      <Container className="py-10 sm:py-12">
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="break-keep text-base font-medium text-ink-soft sm:text-lg">
            2019년부터{" "}
            <strong className="font-display font-bold text-navy">
              <CountUp to={c.totalClients} from={0} />곳
            </strong>
            과{" "}
            <strong className="font-display font-bold text-navy">
              <CountUp to={c.totalProjects} from={0} />건
            </strong>
            을 함께했습니다 · 그중 {B2G}%가 공공기관·지자체
          </p>
          <Link href="/credibility" className="text-sm font-semibold text-teal-700 transition hover:text-teal">
            고객사·실적 전체 보기 →
          </Link>
        </div>
        <ul aria-label="함께한 고객사" className="mt-6 flex flex-wrap items-center gap-x-7 gap-y-3 sm:gap-x-9">
          {CLIENTS.map((name) => (
            <li key={name} className="break-keep text-[15px] font-bold tracking-tight text-ink-soft sm:text-lg">
              {name}
            </li>
          ))}
          <li className="text-sm text-ink-soft">등 {c.totalClients}곳</li>
        </ul>
      </Container>
    </section>
  );
}
