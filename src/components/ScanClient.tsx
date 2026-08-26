'use client'

import { useRef, useState } from 'react'
import {
  AREAS,
  LATPEED_COLLECTION_URL,
  LATPEED_URL,
  MAX_TOTAL,
  QUESTIONS,
  SERIES,
  areaScores,
  priorityOrder,
  savedHours,
  verdict,
} from '@/lib/scan'

// 2026-08-26 /scan 페이지 통합(대표: "같은 페이지 아닌가? 합쳐라") —
// 별도 랜딩의 중복 마케팅(페인포인트·소개)은 /os 본문이 이미 하므로 버리고,
// 진단 엔진(15문항 → 리포트 → 키트 업셀)만 /os 안의 #scan 섹션으로 임베드.
// 구 /scan 주소는 next.config 301 → /os#scan.
type View = 'intro' | 'quiz' | 'result'

export default function ScanClient() {
  const rootRef = useRef<HTMLElement>(null)
  const [view, setView] = useState<View>('intro')
  const [answers, setAnswers] = useState<number[]>(() => Array(QUESTIONS.length).fill(-1))
  const [cur, setCur] = useState(0)
  const [copied, setCopied] = useState(false)

  const scores = areaScores(answers)
  const total = scores.reduce((a, b) => a + b, 0)
  const { level, summary } = verdict(total)
  const order = priorityOrder(scores)
  const hours = savedHours(scores)

  function toSectionTop() {
    rootRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  function start() {
    setAnswers(Array(QUESTIONS.length).fill(-1))
    setCur(0)
    setView('quiz')
    toSectionTop()
  }

  function pick(optionIndex: number) {
    const next = [...answers]
    next[cur] = optionIndex
    setAnswers(next)
    if (cur < QUESTIONS.length - 1) {
      setCur(cur + 1)
    } else {
      setView('result')
      toSectionTop()
    }
  }

  async function copyResult() {
    const lines = [
      '[우리회사OS 무료 진단 결과]',
      `종합 ${total}/${MAX_TOTAL}점 · ${level}`,
      '',
      ...scores.map((v, i) => `· ${AREAS[i].name}: ${v}/9`),
      '',
      'AI에 맡기면 좋은 우선순위 TOP3',
      ...order.slice(0, 3).map((ai, r) => `${r + 1}. ${AREAS[ai].name}`),
      '',
      `예상 절감 시간: 주당 약 ${hours}시간 (추정치)`,
      '진단: 퍼블릭아이디 우리회사OS · public-id.co.kr/os',
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <section
      ref={rootRef}
      id="scan"
      className="border-line scroll-mt-20 border-t bg-white"
    >
      <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        {/* ── 시작 패널 ── */}
        {view === 'intro' && (
          <>
            <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
              Free Scan
            </p>
            <h2 className="text-ink mt-4 max-w-[24ch] text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
              우리 회사, 뭘 AI에 맡겨야 할까? — 3분 무료 진단
            </h2>
            <p className="text-ink-soft mt-5 max-w-[42em] text-lg leading-relaxed">
              도구가 없어서가 아니라 <strong className="text-ink font-semibold">순서</strong>가
              없어서 막힙니다. 15문항으로 아래 5개 영역을 점검하면, AI에 맡기면 좋은
              우선순위 TOP3와 주당 절감 시간이 그 자리에서 나옵니다.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {AREAS.map((a, i) => (
                <li
                  key={a.name}
                  className="border-line text-ink rounded-full border bg-white/60 px-4 py-1.5 text-sm font-semibold"
                >
                  <span className="text-teal-700 mr-1">{['①', '②', '③', '④', '⑤'][i]}</span>
                  {a.short}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={start}
                className="bg-arch inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
              >
                3분 무료 진단 시작하기
              </button>
              <p className="text-ink-soft text-sm">
                15문항 · 약 3분 · <strong className="text-ink font-semibold">로그인 없음</strong> ·
                서버로 보내는 데이터 없음
              </p>
            </div>
          </>
        )}

        {/* ── 진단 ── */}
        {view === 'quiz' && (
          <div className="mx-auto max-w-[640px]">
            <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
              Free Scan
            </p>
            <h2 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
              우리회사OS 무료 진단
            </h2>

            <div className="border-line mt-8 rounded-3xl border bg-white/50 p-6 shadow-sm sm:p-8">
              <div className="flex items-center justify-between">
                <span className="text-ink-soft text-sm">
                  <strong className="text-ink font-bold">{cur + 1}</strong> / {QUESTIONS.length}
                </span>
                <span className="border-line text-ink-soft rounded-full border bg-white/60 px-3 py-1 text-xs font-semibold">
                  {AREAS[QUESTIONS[cur].area].short}
                </span>
              </div>
              <div className="border-line mt-3 h-1.5 w-full overflow-hidden rounded-full border bg-white/60">
                <div
                  className="bg-arch h-full rounded-full transition-[width] duration-300"
                  style={{ width: `${(cur / QUESTIONS.length) * 100}%` }}
                />
              </div>

              <p className="text-ink mt-7 text-lg font-bold leading-snug">{QUESTIONS[cur].text}</p>

              <div className="mt-6 grid gap-3">
                {QUESTIONS[cur].options.map((label, i) => (
                  <button
                    key={label}
                    type="button"
                    onClick={() => pick(i)}
                    className={`border-line rounded-xl border px-4 py-4 text-left text-[15px] font-medium transition ${
                      answers[cur] === i
                        ? 'border-teal-700 text-teal-700 bg-teal-100'
                        : 'text-ink hover:border-teal'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between gap-4">
                {cur > 0 ? (
                  <button
                    type="button"
                    onClick={() => setCur(cur - 1)}
                    className="border-line text-ink inline-flex h-10 items-center rounded-full border px-5 text-sm font-semibold transition"
                  >
                    이전
                  </button>
                ) : (
                  <span />
                )}
                <span className="text-ink-soft text-xs">답을 고르면 자동으로 넘어갑니다</span>
              </div>
            </div>
          </div>
        )}

        {/* ── 결과 리포트 ── */}
        {view === 'result' && (
          <>
            <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
              Scan Report
            </p>
            <h2 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
              우리 회사 AI 진단 리포트
            </h2>
            <div className="mt-6 flex items-baseline gap-3">
              <span className="text-teal-700 text-5xl font-extrabold">{total}</span>
              <span className="text-ink-soft text-sm">
                / {MAX_TOTAL}점 · {level}
              </span>
            </div>
            <p className="text-ink-soft mt-4 max-w-[42em] text-lg leading-relaxed">{summary}</p>

            {/* 영역별 점수 */}
            <div className="border-line mt-10 rounded-3xl border bg-white/50 p-6 shadow-sm sm:p-8">
              <h3 className="text-ink text-lg font-bold">영역별 AI 위임 여지</h3>
              <ul className="mt-6 space-y-4">
                {scores.map((v, i) => (
                  <li key={AREAS[i].name} className="flex items-center gap-4">
                    <span className="text-ink w-20 shrink-0 text-sm font-semibold">
                      {AREAS[i].short}
                    </span>
                    <span className="border-line h-6 min-w-0 flex-1 overflow-hidden rounded-full border bg-white/60">
                      <span
                        className="block h-full rounded-full"
                        style={{
                          width: `${Math.max(3, (v / 9) * 100)}%`,
                          background: v >= 6 ? '#0b6c7d' : '#069CBB',
                          opacity: v >= 6 ? 1 : 0.55,
                        }}
                      />
                    </span>
                    <span className="text-ink-soft w-10 shrink-0 text-right text-sm font-bold">
                      {v}/9
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-ink-soft mt-5 text-xs">
                점수가 높을수록 지금 사람 손에 잡혀 있는 시간이 많고, AI에 맡겼을 때 돌아오는
                시간이 큰 영역입니다.
              </p>
            </div>

            {/* TOP3 */}
            <div className="mt-12">
              <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
                Priority
              </p>
              <h3 className="text-ink mt-4 text-xl font-extrabold tracking-[-0.025em]">
                AI에 맡기면 좋은 우선순위 TOP3
              </h3>
              <ol className="mt-6 space-y-5">
                {order.slice(0, 3).map((ai, rank) => (
                  <li key={AREAS[ai].name} className="border-line/70 flex gap-4 border-b pb-5">
                    <span
                      className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        rank === 0 ? 'bg-teal-700 text-white' : 'bg-teal-100 text-teal-700'
                      }`}
                    >
                      {rank + 1}
                    </span>
                    <div>
                      <h4 className="text-ink text-base font-bold">
                        {AREAS[ai].name}{' '}
                        <span className="text-teal-700 text-sm">{scores[ai]}/9</span>
                      </h4>
                      <p className="text-ink-soft mt-1 text-sm">{AREAS[ai].prescription}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>

            {/* 절감 시간 */}
            <div className="border-line mt-12 rounded-3xl border bg-white/50 p-6 shadow-sm sm:p-8">
              <h3 className="text-ink text-lg font-bold">예상 절감 시간</h3>
              <p className="text-teal-700 mt-3 text-4xl font-extrabold">
                {hours}
                <span className="text-lg">시간/주</span>
              </p>
              <p className="text-ink-soft mt-3 text-sm">
                답변 기준으로 계산한 추정치입니다. 우선순위 상위 영역부터 AI로 바꿨을 때 주당
                돌려받을 수 있는 시간의 어림값이며, 실제 값은 업무 구조에 따라 달라집니다.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={copyResult}
                className="border-line text-ink inline-flex h-12 items-center rounded-full border px-6 text-sm font-semibold transition"
              >
                결과 텍스트 복사
              </button>
              <button
                type="button"
                onClick={start}
                className="border-line text-ink inline-flex h-12 items-center rounded-full border px-6 text-sm font-semibold transition"
              >
                다시 진단하기
              </button>
              {copied && (
                <span className="text-teal-700 text-sm">
                  복사되었습니다. 메모장이나 메신저에 붙여 넣으세요.
                </span>
              )}
            </div>

            {/* 업셀 — 진단 키트·시리즈 (구 /scan 하단 네이비 밴드 → 패널로) */}
            <div className="mt-12 rounded-3xl bg-navy p-7 sm:p-10">
              <p className="font-display text-teal-100 text-xs font-semibold uppercase tracking-[0.16em]">
                Next Step
              </p>
              <h3 className="mt-3 text-xl font-extrabold tracking-[-0.025em] text-white sm:text-2xl">
                이 우선순위, 실행 키트로 이어 가세요
              </h3>
              <p className="mt-4 max-w-[42em] text-sm leading-relaxed text-white/75">
                무료 진단이 방향을 알려 줬다면, 유료 키트는 실행 순서를 만들어 줍니다. 업무
                데이터를 넣으면 우리 회사 이름이 박힌 우선순위 리포트가 1시간 안에 나옵니다.
              </p>

              <div className="mt-8 rounded-2xl border border-white/15 bg-white/5 p-6 sm:p-8">
                <p className="font-display text-teal-100 text-xs font-semibold uppercase tracking-[0.16em]">
                  Ourcompany OS ① Scan Kit
                </p>
                <h4 className="mt-3 text-lg font-bold text-white">
                  우리회사OS ①진단 | 뭘 AI에 맡길지, 1시간 만에 우선순위 리포트
                </h4>
                <div className="mt-4 flex flex-wrap items-baseline gap-3">
                  <span className="text-3xl font-extrabold text-white">
                    49,000<span className="text-lg">원</span>
                  </span>
                  <span className="text-base text-white/50 line-through">79,000원</span>
                  <span className="text-xs text-white/70">
                    정가 79,000원 · 부가세 포함 · 초기 10명 한정 런칭가
                  </span>
                </div>
                <ul className="mt-5 space-y-2.5 text-sm text-white/85">
                  <li>더블클릭으로 실행하는 진단 앱 — 설치 부담 없이 바로 시작</li>
                  <li>결과 리포트에 우리 회사 이름이 들어가는 화이트라벨 구성</li>
                  <li>무료 진단보다 깊은 문항과 업무별 실행 순서 리포트</li>
                </ul>
                <a
                  href={LATPEED_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-arch mt-7 inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
                >
                  래피드에서 키트 받기
                </a>
              </div>

              <div className="mt-10">
                <p className="font-display text-teal-100 text-xs font-semibold uppercase tracking-[0.16em]">
                  Series
                </p>
                <p className="mt-3 text-sm text-white/75">
                  진단 다음 단계도 시리즈로 준비되어 있습니다.
                </p>
                <ul className="mt-4 space-y-3">
                  {SERIES.map((s) => (
                    <li key={s.name} className="border-b border-white/10 pb-3">
                      <a
                        href={s.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex flex-wrap items-baseline gap-x-3 text-sm transition hover:opacity-80"
                      >
                        <b className="text-white">{s.name}</b>
                        <span className="text-white/70">
                          {s.desc} · {s.price}
                        </span>
                      </a>
                    </li>
                  ))}
                </ul>
                <a
                  href={LATPEED_COLLECTION_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex h-11 items-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20"
                >
                  래피드에서 시리즈 전체 보기
                </a>
                <p className="mt-4 text-xs text-white/60">
                  시리즈 전 상품 부가세 포함 표기 · 런칭가는 초기 10명 한정
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  )
}
