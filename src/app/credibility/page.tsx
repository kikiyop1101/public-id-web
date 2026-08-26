import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { credibility as c } from "@/lib/credibility";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = {
  title: "숫자로 보는 신뢰",
  alternates: { canonical: "/credibility" },
  description:
    "2019년부터 7개년 연속, 누적 960여 건의 프로젝트와 278개 거래처 — 공공기관·지자체 63%. 퍼블릭아이디의 검증된 실행 이력.",
};

const stats = [
  { v: `${c.yearsActive}`, u: "개년", k: "연속 운영", s: `${c.period}` },
  { v: `${c.totalProjects.toLocaleString()}`, u: "건", k: "누적 프로젝트", s: "실행 완료 기준" },
  { v: `${c.totalClients.toLocaleString()}`, u: "곳", k: "함께한 거래처", s: "누적 파트너" },
  { v: `${c.publicOrgs.toLocaleString()}`, u: "곳", k: "공공기관·지자체", s: "B2G 신뢰 기반" },
  { v: `${c.repeatRatePct}`, u: "%", k: "재거래율", s: "다시 찾는 파트너" },
];

const clients = [
  { label: "관공서·지자체", names: "세종특별자치시 · 서울특별시 · 서초구청 · 경기도청 · 경기남부경찰청 · 국립세종수목원 등 다수" },
  { label: "NGO 단체", names: "유니세프 한국위원회 · 세이브더칠드런 등 다수" },
  { label: "기업", names: "스타벅스 · 현대자동차 · 유한양행 · 에버랜드 등 다수" },
];

// ── 성장 곡선 SVG(빌드 시 서버 렌더 · 클라이언트 JS 0) ──
function GrowthChart() {
  const W = 720, H = 280, L = 52, R = 24, T = 24, B = 44;
  const pw = W - L - R, ph = H - T - B;
  const maxY = 1000; // 누적 프로젝트 최대(961) 여유
  const n = c.years.length;
  const x = (i: number) => L + (pw * i) / (n - 1);
  const y = (v: number) => T + ph - (v / maxY) * ph;
  const proj = c.cumulativeProjects;
  const cli = c.cumulativeClients;
  const line = (arr: readonly number[]) => arr.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `M ${x(0)},${T + ph} ` + proj.map((v, i) => `L ${x(i)},${y(v)}`).join(" ") + ` L ${x(n - 1)},${T + ph} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" role="img"
      aria-label="연도별 누적 프로젝트 및 거래처 성장 추이">
      <defs>
        <linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#069CBB" stopOpacity="0.28" />
          <stop offset="100%" stopColor="#069CBB" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 250, 500, 750, 1000].map((g) => (
        <g key={g}>
          <line x1={L} y1={y(g)} x2={W - R} y2={y(g)} stroke="#e4eaeb" strokeWidth="1" />
          <text x={L - 8} y={y(g) + 4} textAnchor="end" fontSize="11" fill="#9aa3a8" fontFamily="var(--font-display)">{g}</text>
        </g>
      ))}
      <path d={area} fill="url(#cg)" />
      <polyline points={line(proj)} fill="none" stroke="#069CBB" strokeWidth="3" strokeLinejoin="round" strokeLinecap="round" />
      <polyline points={line(cli)} fill="none" stroke="#16303D" strokeWidth="2" strokeDasharray="1 5" strokeLinecap="round" />
      {proj.map((v, i) => <circle key={i} cx={x(i)} cy={y(v)} r="3.5" fill="#069CBB" />)}
      {c.years.map((yr, i) => (
        <text key={yr} x={x(i)} y={H - 16} textAnchor="middle" fontSize="12" fill="#57636b" fontFamily="var(--font-display)">{yr}</text>
      ))}
      <text x={x(n - 1)} y={y(proj[n - 1]) - 12} textAnchor="end" fontSize="13" fontWeight="700" fill="#0B6C7D" fontFamily="var(--font-display)">{proj[n - 1]} 건</text>
      <text x={x(n - 1)} y={y(cli[n - 1]) - 10} textAnchor="end" fontSize="12" fontWeight="600" fill="#16303D" fontFamily="var(--font-display)">{cli[n - 1]} 곳</text>
    </svg>
  );
}

function Bars({ rows }: { rows: readonly { label: string; pct: number }[] }) {
  return (
    <div className="space-y-4">
      {rows.map((r) => (
        <div key={r.label}>
          <div className="flex items-baseline justify-between gap-3">
            <span className="text-sm font-medium text-ink">{r.label}</span>
            <span className="font-display text-sm font-semibold text-teal-700">{r.pct}%</span>
          </div>
          <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-cloud">
            <div className="h-full rounded-full bg-teal-500" style={{ width: `${r.pct}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CredibilityPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "실적·신뢰", path: "/credibility" }]} />
      <PageHero
        eyebrow="Track Record"
        title={
          <>
            숫자로 증명하는
            <br />
            7년의 신뢰
          </>
        }
        description="2019년 이후 한 해도 멈추지 않고, 공공기관·지자체와 기업 곁에서 쌓아 온 실행 이력입니다."
      />

      {/* 핵심 지표 */}
      <section className="py-16 sm:py-20">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {stats.map((s, i) => (
              <Reveal key={s.k} delay={i * 60}>
                <div className="h-full rounded-2xl border border-line bg-white p-6 shadow-sm">
                  <div className="font-display text-3xl font-bold leading-none text-navy sm:text-4xl">
                    {s.v}<span className="ml-0.5 text-base font-semibold text-teal-500">{s.u}</span>
                  </div>
                  <div className="mt-3 text-sm font-semibold text-ink">{s.k}</div>
                  <div className="mt-0.5 text-xs text-ink-soft">{s.s}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 성장 곡선 */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <Reveal>
            <div className="rounded-3xl border border-line bg-white p-7 shadow-sm sm:p-9">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-ink">해마다 넓어지는 신뢰의 폭</h2>
                  <p className="mt-1 text-sm text-ink-soft">연도별 누적 프로젝트와 거래처 수의 성장 추이입니다.</p>
                </div>
                <div className="flex gap-4 text-xs text-ink-soft">
                  <span className="flex items-center gap-1.5"><span className="inline-block h-2.5 w-2.5 rounded-full bg-teal-500" />누적 프로젝트</span>
                  <span className="flex items-center gap-1.5"><span className="inline-block h-0.5 w-4 bg-navy" />누적 거래처</span>
                </div>
              </div>
              <div className="mt-6">
                <GrowthChart />
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 구성 */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            <Reveal>
              <div className="h-full rounded-3xl border border-line bg-white p-7 shadow-sm">
                <div className="h-1.5 w-12 rounded-full bg-arch" />
                <h3 className="mt-4 text-lg font-bold text-ink">사업영역 구성</h3>
                <p className="mt-1 text-sm text-ink-soft">노면표시재·직물시트·사인 시스템을 아우르는 친환경 그래픽 전문성.</p>
                <div className="mt-6"><Bars rows={c.lineDistribution} /></div>
              </div>
            </Reveal>
            <Reveal delay={80}>
              <div className="flex h-full flex-col rounded-3xl border border-line bg-white p-7 shadow-sm">
                <div className="h-1.5 w-12 rounded-full bg-arch" />
                <h3 className="mt-4 text-lg font-bold text-ink">고객 구성</h3>
                <p className="mt-1 text-sm text-ink-soft">공공기관·지자체가 신뢰하고 함께하는 검증된 파트너.</p>
                <div className="mt-6"><Bars rows={c.segmentMix} /></div>
                <div className="mt-auto pt-6">
                  <div className="rounded-2xl bg-cloud/60 p-5">
                    <div className="font-display text-3xl font-bold text-navy">63<span className="text-lg text-teal-500">%</span></div>
                    <p className="mt-1 text-sm text-ink-soft">공공 부문(B2G) 비중 — 까다로운 공공 조달 기준을 통과한 실행 이력.</p>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* 함께한 곳 */}
      <section className="pb-16 sm:pb-20">
        <Container>
          <Reveal>
            <div className="rounded-3xl border border-line bg-white p-7 shadow-sm sm:p-9">
              <div className="h-1.5 w-12 rounded-full bg-arch" />
              <h2 className="mt-4 text-xl font-bold text-ink">함께한 곳</h2>
              <p className="mt-1 text-sm text-ink-soft">
                관공서·지자체부터 글로벌 기업·NGO까지, 다양한 분야에서 신뢰를 쌓아 왔습니다.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {clients.map((cl) => (
                  <div key={cl.label} className="rounded-2xl bg-cloud/60 p-5">
                    <div className="font-display text-sm font-semibold text-teal-700">{cl.label}</div>
                    <p className="mt-2 text-sm font-medium leading-relaxed text-navy/75">{cl.names}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 인증 · CTA */}
      <section className="pb-24">
        <Container>
          <Reveal>
            <div className="rounded-3xl border border-line bg-navy px-8 py-10 text-white sm:px-12 sm:py-14">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-300">Verified</h3>
              <p className="mt-3 max-w-2xl text-2xl font-bold leading-snug">
                특허받은 친환경 기술과 국내외 인증으로 뒷받침되는 신뢰입니다.
              </p>
              <div className="mt-7 flex flex-wrap gap-2.5">
                {["인증 사회적기업", "KIDP 산업디자인전문회사", "GREENGUARD GOLD (UL 2818)"].map((b) => (
                  <span key={b} className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-medium text-white/90">{b}</span>
                ))}
              </div>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/credentials" className="rounded-full bg-teal-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-teal-600">
                  인증·특허 자세히
                </Link>
                <Link href="/contact" className="rounded-full border border-white/25 px-6 py-3 text-sm font-semibold text-white/90 transition hover:bg-white/10">
                  프로젝트 문의
                </Link>
              </div>
              <p className="mt-6 text-xs text-white/50">※ 수치는 2019–2025 실제 실행 이력 기준 집계입니다.</p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
