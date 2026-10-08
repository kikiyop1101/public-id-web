import Link from "next/link";
import Container from "@/components/Container";
import { credibility as c } from "@/lib/credibility";

// 근거 섹션(2026-10-08) — 엑사 홈의 "BENCHMARKS"(탭 + 막대 + 출처 링크) 구조를 우리 사실로.
// 경쟁사 비교는 하지 않는다 — 우리 수치를 공인 기준·시험기관과 나란히 놓고, 탭마다 근거 페이지로 잇는다.
// 수치 정본: BRAND_CONSTANTS(72 BPN FITI 2016·R10 MPI·야간반사 KCL 2016 — 기관·연도 병기) · assistant-knowledge.ts
// (서울시 보도포장 기준 평지 40·완경사 45 "충족"만 말한다, 급경사 50은 말하지 않는다) · credibility.ts(매출장 실거래, 금액 없음).
// 탭 내용은 전부 HTML에 그려 두고 CSS로만 가린다 — 검색·AI가 숨은 탭까지 읽는다.
// 탭 전환은 자바스크립트 없이 라디오 + :has()로 한다(첫 배포의 클라이언트 탭이 휴대폰 TBT를 약 110ms 늘려 10-08 같은 날 교체).
const TABS = [
  { id: "slip", label: "미끄럼저항" },
  { id: "eco", label: "친환경·안전 시험" },
  { id: "track", label: "공공 실적" },
  { id: "cert", label: "인증·특허" },
] as const;

const SLIP = [
  { name: "퍼블릭아이디 노면표시재", value: 72, note: "FITI 2016 시험", ours: true },
  { name: "서울시 보도포장 기준 · 완경사", value: 45, note: "충족" },
  { name: "서울시 보도포장 기준 · 평지", value: 40, note: "충족" },
];

const ECO = [
  { k: "GREENGUARD GOLD", v: "UL 2818 인증 친환경 라텍스 잉크로 인쇄" },
  { k: "유해물질 불검출", v: "공인기관 시험성적 보유(SGS 등)" },
  { k: "방염 기준 충족", v: "공인기관 시험(KFI) — 노면표시재" },
  { k: "야간 반사", v: "574~685 mcd/(lx·m²) — KCL 2016 시험" },
  { k: "철거 후 끈적임 없음", v: "도색이 아니라 붙이는 점착식 표시재" },
];

const CERT = [
  { k: "특허 제10-1974029호", v: "도로 노면 표시용 조성물 및 시공방법 · 2019 대한민국 우수특허대상" },
  { k: "국제특허", v: "유럽특허 EP 1 677 974 보유" },
  { k: "인증 사회적기업 제2020-227호", v: "「사회적기업 육성법」 제12조 공공기관 우선구매 대상" },
  { k: "KIDP 산업디자인전문회사", v: "종합 — 시각·제품·환경" },
  { k: "GD2023 굿디자인", v: "노란볼라드 선정 · 노란발자국 상표등록 제40-1257164호" },
  { k: "직접생산확인", v: "주력 3종 — 노면표시재·직물시트·홍보판촉물" },
];

const MAX_SLIP = 80;
const lastProjects = c.cumulativeProjects[c.cumulativeProjects.length - 1];

function Source({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:text-teal">
      {children} <span aria-hidden>→</span>
    </Link>
  );
}

function Rows({ rows }: { rows: { k: string; v: string }[] }) {
  return (
    <dl className="divide-y divide-line border-y border-line">
      {rows.map((r) => (
        <div key={r.k} className="grid gap-1 py-3.5 sm:grid-cols-[minmax(0,15rem)_1fr] sm:gap-6">
          <dt className="flex items-start gap-2 break-keep font-semibold text-ink">
            <svg aria-hidden viewBox="0 0 20 20" className="mt-1 h-4 w-4 shrink-0 text-teal-700" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="m5 10.5 3.2 3.2L15 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            {r.k}
          </dt>
          <dd className="break-keep pl-6 text-[15px] text-ink-soft sm:pl-0">{r.v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** 라디오 id — 패널은 그룹 안에서 이 라디오가 체크됐을 때만 보인다 */
const rid = (id: string) => `proof-r-${id}`;

export default function ProofSection() {
  return (
    <section className="bg-white">
      <Container className="py-20 sm:py-28">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Evidence</p>
        <h2 className="mt-3 max-w-3xl break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
          말보다 숫자와 근거로
          <br />
          보여 드립니다.
        </h2>

        <div className="group/proof mt-10 grid gap-5 lg:grid-cols-[240px_1fr] lg:gap-8">
          <div role="radiogroup" aria-label="근거 종류" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0">
            {TABS.map((t, i) => (
              <label
                key={t.id}
                htmlFor={rid(t.id)}
                className="shrink-0 cursor-pointer rounded-full border border-line-strong bg-white/70 px-5 py-2.5 text-left text-sm font-medium text-ink-soft transition hover:border-teal hover:text-ink has-[:checked]:border-navy has-[:checked]:bg-navy has-[:checked]:font-semibold has-[:checked]:text-white has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-teal-700 lg:rounded-2xl lg:py-3.5 lg:text-base"
              >
                <input type="radio" name="proof-tab" id={rid(t.id)} defaultChecked={i === 0} className="sr-only" />
                {t.label}
              </label>
            ))}
          </div>

          <div className="rounded-3xl border border-line bg-paper/50 p-6 sm:p-9">
            {/* 미끄럼저항 — 우리 수치 vs 공인 기준 */}
            <div id="proof-panel-slip" className="hidden group-has-[#proof-r-slip:checked]/proof:block">
              <h3 className="break-keep text-xl font-bold text-ink sm:text-2xl">비 오는 날 보도에서도 미끄럽지 않게</h3>
              <p className="mt-2 break-keep text-[15px] text-ink-soft">
                미끄럼저항(BPN)은 높을수록 덜 미끄럽습니다. 서울시 보도포장 기준의 평지·완경사 구간을 충족합니다.
              </p>
              <ul className="mt-7 grid gap-5">
                {SLIP.map((s) => (
                  <li key={s.name}>
                    <div className="flex items-baseline justify-between gap-4">
                      <span className={s.ours ? "break-keep font-bold text-ink" : "break-keep text-ink-soft"}>{s.name}</span>
                      <span className="shrink-0 font-display text-lg font-bold text-navy">
                        {s.value}
                        <span className="ml-1 text-sm font-semibold text-ink-soft">BPN · {s.note}</span>
                      </span>
                    </div>
                    <div className="mt-2 h-3 overflow-hidden rounded-full bg-ink/[0.06]">
                      <div
                        className={s.ours ? "h-full rounded-full bg-navy" : "h-full rounded-full bg-line-input"}
                        style={{ width: `${(s.value / MAX_SLIP) * 100}%` }}
                      />
                    </div>
                  </li>
                ))}
              </ul>
              <p className="mt-6 break-keep text-sm text-ink-soft">독일 MPI 시험에서 R10 등급(DIN 51130)도 받았습니다.</p>
              <Source href="/credentials">시험성적서·인증 보기</Source>
            </div>

            {/* 친환경·안전 시험 */}
            <div id="proof-panel-eco" className="hidden group-has-[#proof-r-eco:checked]/proof:block">
              <h3 className="break-keep text-xl font-bold text-ink sm:text-2xl">아이들이 밟고 서는 곳이라, 소재부터 시험합니다</h3>
              <p className="mt-2 break-keep text-[15px] text-ink-soft">
                국내외 공인기관 시험성적서 30여 종을 갖고 있고, 수치는 기관·연도와 함께 밝힙니다.
              </p>
              <div className="mt-6">
                <Rows rows={ECO} />
              </div>
              <Source href="/credentials">시험성적서·인증 보기</Source>
            </div>

            {/* 공공 실적 — 누적 프로젝트 막대 + 고객 구성 */}
            <div id="proof-panel-track" className="hidden group-has-[#proof-r-track:checked]/proof:block">
              <h3 className="break-keep text-xl font-bold text-ink sm:text-2xl">
                {c.yearsActive}년 동안 {c.totalProjects.toLocaleString()}건, 끊기지 않고 이어 왔습니다
              </h3>
              <p className="mt-2 break-keep text-[15px] text-ink-soft">누적 프로젝트 수 · 매출장 실거래 기준({c.period})</p>
              <div className="mt-7 flex h-44 items-end gap-2 sm:gap-3" role="img" aria-label={`누적 프로젝트 ${c.years[0]}년 ${c.cumulativeProjects[0]}건에서 ${c.years[c.years.length - 1]}년 ${lastProjects}건까지`}>
                {c.years.map((y, i) => {
                  const v = c.cumulativeProjects[i];
                  const last = i === c.years.length - 1;
                  return (
                    <div key={y} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                      <span className={last ? "font-display text-sm font-bold text-navy" : "font-display text-xs font-semibold text-ink-soft"}>{v}</span>
                      <div className={last ? "w-full rounded-t-lg bg-navy" : "w-full rounded-t-lg bg-line-input/70"} style={{ height: `${(v / lastProjects) * 78}%` }} />
                      <span className="text-xs text-ink-soft">{String(y).slice(2)}년</span>
                    </div>
                  );
                })}
              </div>
              <p className="mt-7 text-sm font-semibold text-ink">고객 구성(건수 기준)</p>
              <div className="mt-2 flex h-3 overflow-hidden rounded-full">
                {c.segmentMix.map((s, i) => (
                  <div key={s.label} className={["bg-navy", "bg-teal-700", "bg-line-input"][i]} style={{ width: `${s.pct}%` }} />
                ))}
              </div>
              <ul className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-ink-soft">
                {c.segmentMix.map((s, i) => (
                  <li key={s.label} className="flex items-center gap-1.5">
                    <span aria-hidden className={`h-2.5 w-2.5 rounded-full ${["bg-navy", "bg-teal-700", "bg-line-input"][i]}`} />
                    {s.label} {s.pct}%
                  </li>
                ))}
              </ul>
              <Source href="/credibility">실적·고객사 전체 보기</Source>
            </div>

            {/* 인증·특허 */}
            <div id="proof-panel-cert" className="hidden group-has-[#proof-r-cert:checked]/proof:block">
              <h3 className="break-keep text-xl font-bold text-ink sm:text-2xl">공공기관이 안심하고 맡길 수 있는 자격</h3>
              <p className="mt-2 break-keep text-[15px] text-ink-soft">
                추정가격 2천만 원 이하는 1인 견적 수의계약으로 진행할 수 있고, 구매는 기관의 우선구매 실적에 반영됩니다.
              </p>
              <div className="mt-6">
                <Rows rows={CERT} />
              </div>
              <Source href="/credentials">인증·특허 보기</Source>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
