'use client'

import { useState } from 'react'
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

type View = 'landing' | 'quiz' | 'result'

const PAINS = [
  { title: '견적서 하나에 한 시간', body: '예전 파일을 찾아 고치다가 오전이 다 갑니다.' },
  { title: '홍보 글은 늘 다음으로', body: '올려야 하는 걸 알지만 소재도 문구도 막막해서 미룹니다.' },
  { title: '문의 답변에 일이 끊긴다', body: '같은 질문에 매번 새로 타이핑하고, 밀리면 놓칩니다.' },
  { title: '이번 달 매출을 바로 답 못 한다', body: '숫자는 흩어져 있고, 월말 정산은 며칠씩 걸립니다.' },
]

export default function ScanClient() {
  const [view, setView] = useState<View>('landing')
  const [answers, setAnswers] = useState<number[]>(() => Array(QUESTIONS.length).fill(-1))
  const [cur, setCur] = useState(0)
  const [copied, setCopied] = useState(false)

  const scores = areaScores(answers)
  const total = scores.reduce((a, b) => a + b, 0)
  const { level, summary } = verdict(total)
  const order = priorityOrder(scores)
  const hours = savedHours(scores)

  function start() {
    setAnswers(Array(QUESTIONS.length).fill(-1))
    setCur(0)
    setView('quiz')
    window.scrollTo(0, 0)
  }

  function pick(optionIndex: number) {
    const next = [...answers]
    next[cur] = optionIndex
    setAnswers(next)
    if (cur < QUESTIONS.length - 1) {
      setCur(cur + 1)
    } else {
      setView('result')
      window.scrollTo(0, 0)
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
      '진단: 퍼블릭아이디 우리회사OS · public-id.co.kr/scan',
    ]
    try {
      await navigator.clipboard.writeText(lines.join('\n'))
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      setCopied(false)
    }
  }

  /* ── 랜딩 ─────────────────────────────── */
  if (view === 'landing') {
    return (
      <>
        <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
            Ourcompany OS · Free Scan
          </p>
          <h1 className="text-ink mt-4 max-w-[22ch] text-3xl font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-5xl">
            우리 회사, 뭘 AI에 맡겨야 할까?
          </h1>
          <p className="text-ink-soft mt-5 max-w-[42em] text-lg leading-relaxed">
            문서 작성, 홍보 글, 문의 답변, 숫자 정리 — 전부 급한데 어디부터 손대야 할지
            막막합니다. 도구가 없어서가 아니라 <strong className="text-ink font-semibold">순서</strong>가
            없어서입니다. 15문항 진단으로 우리 회사 업무 5개 영역을 점검하고, AI에 맡기면 좋은
            우선순위 TOP3를 바로 확인하세요.
          </p>
          <button
            type="button"
            onClick={start}
            className="bg-arch mt-10 inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
          >
            3분 무료 진단 시작하기
          </button>
          <p className="text-ink-soft mt-4 text-sm">
            15문항 · 약 3분 · <strong className="text-ink font-semibold">로그인 없음</strong> · 결과 즉시 확인
          </p>
        </section>

        <section className="border-line border-y bg-cloud">
          <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
            <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
              Pain Point
            </p>
            <h2 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
              이런 하루가 반복되고 있다면
            </h2>
            <ul className="mt-10 space-y-5">
              {PAINS.map((p) => (
                <li key={p.title} className="border-line/70 border-b pb-5 last:border-b-0">
                  <p className="text-ink text-base font-bold">{p.title}</p>
                  <p className="text-ink-soft mt-1 text-sm">{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
            How It Works
          </p>
          <h2 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
            진단은 이렇게 진행됩니다
          </h2>
          <p className="text-ink-soft mt-5 max-w-[42em] text-lg leading-relaxed">
            소상공인·중소기업 업무를 5개 영역으로 나눠, 영역마다 빈도·시간·방식 3가지를 묻습니다.
            답을 마치면 그 자리에서 영역별 점수와 우선순위 TOP3, 예상 절감 시간을 계산해 보여
            드립니다. 서버로 보내는 데이터는 없습니다.
          </p>
          <ul className="mt-10 space-y-5">
            {AREAS.map((a, i) => (
              <li key={a.name} className="border-line/70 flex gap-4 border-b pb-5 last:border-b-0">
                <span className="font-display text-teal-700 shrink-0 text-sm font-semibold">
                  {['①', '②', '③', '④', '⑤'][i]}
                </span>
                <div>
                  <p className="text-ink text-base font-bold">{a.name}</p>
                  <p className="text-ink-soft mt-1 text-sm">{a.desc}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="text-ink-soft mt-8 text-sm">
            AI를 쓰는 회사와 안 쓰는 회사의 업무 속도 차이는 해마다 벌어지고 있습니다. 도입은 도구
            선택이 아니라 우선순위 선택에서 갈립니다 — 그 첫걸음이 이 진단입니다.
          </p>
        </section>
      </>
    )
  }

  /* ── 진단 ─────────────────────────────── */
  if (view === 'quiz') {
    const q = QUESTIONS[cur]
    return (
      <section className="mx-auto max-w-[640px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
          Self Scan
        </p>
        <h1 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
          우리회사OS 무료 진단
        </h1>

        <div className="border-line mt-8 rounded-3xl border bg-white/50 p-6 shadow-sm sm:p-8">
          <div className="flex items-center justify-between">
            <span className="text-ink-soft text-sm">
              <strong className="text-ink font-bold">{cur + 1}</strong> / {QUESTIONS.length}
            </span>
            <span className="border-line text-ink-soft rounded-full border bg-white/60 px-3 py-1 text-xs font-semibold">
              {AREAS[q.area].short}
            </span>
          </div>
          <div className="border-line mt-3 h-1.5 w-full overflow-hidden rounded-full border bg-white/60">
            <div
              className="bg-arch h-full rounded-full transition-[width] duration-300"
              style={{ width: `${(cur / QUESTIONS.length) * 100}%` }}
            />
          </div>

          <p className="text-ink mt-7 text-lg font-bold leading-snug">{q.text}</p>

          <div className="mt-6 grid gap-3">
            {q.options.map((label, i) => (
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
      </section>
    )
  }

  /* ── 결과 ─────────────────────────────── */
  const barMax = 100
  return (
    <>
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
          Scan Report
        </p>
        <h1 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
          우리 회사 AI 진단 리포트
        </h1>
        <div className="mt-6 flex items-baseline gap-3">
          <span className="text-teal-700 text-5xl font-extrabold">{total}</span>
          <span className="text-ink-soft text-sm">
            / {MAX_TOTAL}점 · {level}
          </span>
        </div>
        <p className="text-ink-soft mt-4 max-w-[42em] text-lg leading-relaxed">{summary}</p>

        {/* 영역별 점수 */}
        <div className="border-line mt-10 rounded-3xl border bg-white/50 p-6 shadow-sm sm:p-8">
          <h2 className="text-ink text-lg font-bold">영역별 AI 위임 여지</h2>
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
                      width: `${Math.max(3, (v / 9) * barMax)}%`,
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
            점수가 높을수록 지금 사람 손에 잡혀 있는 시간이 많고, AI에 맡겼을 때 돌아오는 시간이 큰
            영역입니다.
          </p>
        </div>

        {/* TOP3 */}
        <div className="mt-12">
          <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
            Priority
          </p>
          <h2 className="text-ink mt-4 text-xl font-extrabold tracking-[-0.025em]">
            AI에 맡기면 좋은 우선순위 TOP3
          </h2>
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
                  <h3 className="text-ink text-base font-bold">
                    {AREAS[ai].name}{' '}
                    <span className="text-teal-700 text-sm">{scores[ai]}/9</span>
                  </h3>
                  <p className="text-ink-soft mt-1 text-sm">{AREAS[ai].prescription}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* 절감 시간 */}
        <div className="border-line mt-12 rounded-3xl border bg-white/50 p-6 shadow-sm sm:p-8">
          <h2 className="text-ink text-lg font-bold">예상 절감 시간</h2>
          <p className="text-teal-700 mt-3 text-4xl font-extrabold">
            {hours}
            <span className="text-lg">시간/주</span>
          </p>
          <p className="text-ink-soft mt-3 text-sm">
            답변 기준으로 계산한 추정치입니다. 우선순위 상위 영역부터 AI로 바꿨을 때 주당 돌려받을
            수 있는 시간의 어림값이며, 실제 값은 업무 구조에 따라 달라집니다.
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
            <span className="text-teal-700 text-sm">복사되었습니다. 메모장이나 메신저에 붙여 넣으세요.</span>
          )}
        </div>
      </section>

      {/* 업셀 — 래피드 */}
      <section className="bg-navy">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-display text-teal-100 text-sm font-semibold uppercase tracking-[0.18em]">
            Next Step
          </p>
          <h2 className="mt-4 text-2xl font-extrabold tracking-[-0.025em] text-white sm:text-3xl">
            이 우선순위, 실행 키트로 이어 가세요
          </h2>
          <p className="mt-5 max-w-[42em] text-base leading-relaxed text-white/75">
            무료 진단이 방향을 알려 줬다면, 유료 키트는 실행 순서를 만들어 줍니다. 업무 데이터를
            넣으면 우리 회사 이름이 박힌 우선순위 리포트가 1시간 안에 나옵니다.
          </p>

          <div className="mt-10 rounded-3xl border border-white/15 bg-white/5 p-7 sm:p-9">
            <p className="font-display text-teal-100 text-xs font-semibold uppercase tracking-[0.16em]">
              Ourcompany OS ① Scan Kit
            </p>
            <h3 className="mt-3 text-xl font-bold text-white">
              우리회사OS ①진단 | 뭘 AI에 맡길지, 1시간 만에 우선순위 리포트
            </h3>
            <div className="mt-5 flex flex-wrap items-baseline gap-3">
              <span className="text-3xl font-extrabold text-white">
                49,000<span className="text-lg">원</span>
              </span>
              <span className="text-base text-white/50 line-through">79,000원</span>
              <span className="text-xs text-white/70">
                정가 79,000원 · 부가세 포함 · 초기 10명 한정 런칭가
              </span>
            </div>
            <ul className="mt-6 space-y-3 text-sm text-white/85">
              <li>더블클릭으로 실행하는 진단 앱 — 설치 부담 없이 바로 시작</li>
              <li>결과 리포트에 우리 회사 이름이 들어가는 화이트라벨 구성</li>
              <li>무료 진단보다 깊은 문항과 업무별 실행 순서 리포트</li>
            </ul>
            <a
              href={LATPEED_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-arch mt-8 inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
            >
              래피드에서 키트 받기
            </a>
          </div>

          <div className="mt-12">
            <p className="font-display text-teal-100 text-xs font-semibold uppercase tracking-[0.16em]">
              Series
            </p>
            <p className="mt-3 text-sm text-white/75">진단 다음 단계도 시리즈로 준비되어 있습니다.</p>
            <ul className="mt-5 space-y-3">
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
      </section>
    </>
  )
}
