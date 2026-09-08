'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { cn } from '@/lib/cn'
import {
  QUESTIONS,
  STORAGE_KEY,
  axisScores,
  toGrade,
  toScore,
  type Grade,
} from '@/lib/safety-score'

// "우리 동네 안전 점수" 진단 — 한 화면 한 문항 → 결과(점수·등급·항목 차트·처방 3·결과 카드 저장·공유).
// 상태는 이 컴포넌트 안에만, 저장은 localStorage 1건(최근 결과). 개인정보·이메일 수집 없음.

type Answers = (number | null)[]
type Saved = { score: number; grade: Grade['key']; at: string }

const GRADE_COLOR: Record<Grade['key'], { text: string; bg: string; line: string; hex: string }> = {
  safe: { text: 'text-success-deep', bg: 'bg-success-bg', line: 'border-success-line', hex: '#1e7a46' },
  care: { text: 'text-teal-700', bg: 'bg-teal-100', line: 'border-teal/30', hex: '#0b6c7d' },
  warn: { text: 'text-warning-deep', bg: 'bg-warning-bg', line: 'border-warning-line', hex: '#c2641b' },
  urgent: { text: 'text-danger-deep', bg: 'bg-danger-bg', line: 'border-danger-line', hex: '#b5322e' },
}

function readSaved(): Saved | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const v = JSON.parse(raw) as Saved
    if (typeof v.score !== 'number') return null
    return v
  } catch {
    return null
  }
}

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/** 카운트업 — 결과 점수용(간단 자체 구현, reduced-motion이면 즉시) */
function useCountUp(target: number, run: boolean) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!run) return
    let raf = 0
    if (prefersReducedMotion()) {
      raf = requestAnimationFrame(() => setV(target))
      return () => cancelAnimationFrame(raf)
    }
    const start = performance.now()
    const dur = 900
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur)
      const eased = 1 - Math.pow(1 - p, 3)
      setV(Math.round(target * eased))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return v
}

/** 항목별 점수 레이더(8축) — teal 하나 + 회색 그리드 */
function Radar({ values }: { values: number[] }) {
  const n = values.length
  const cx = 160, cy = 160, r = 120
  const pt = (i: number, ratio: number) => {
    const a = -Math.PI / 2 + (Math.PI * 2 * i) / n
    return [cx + Math.cos(a) * r * ratio, cy + Math.sin(a) * r * ratio] as const
  }
  const ring = (ratio: number) =>
    Array.from({ length: n }, (_, i) => pt(i, ratio).join(',')).join(' ')
  const poly = values.map((v, i) => pt(i, Math.max(0.04, v / 100)).join(',')).join(' ')
  return (
    <svg viewBox="0 0 320 320" className="mx-auto w-full max-w-[320px]" role="img" aria-label="항목별 점수 레이더 차트">
      {[0.25, 0.5, 0.75, 1].map((k) => (
        <polygon key={k} points={ring(k)} fill="none" stroke="#e4eaeb" strokeWidth="1" />
      ))}
      {Array.from({ length: n }, (_, i) => {
        const [x, y] = pt(i, 1)
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#e4eaeb" strokeWidth="1" />
      })}
      <polygon points={poly} fill="#069CBB" fillOpacity="0.18" stroke="#0b6c7d" strokeWidth="2.5" strokeLinejoin="round" />
      {values.map((v, i) => {
        const [x, y] = pt(i, Math.max(0.04, v / 100))
        return <circle key={i} cx={x} cy={y} r="4" fill="#0b6c7d" />
      })}
      {QUESTIONS.map((q, i) => {
        const [x, y] = pt(i, 1.19)
        return (
          <text
            key={q.id}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            fontSize="11.5"
            fontWeight="600"
            fill="#57636b"
          >
            {q.axis}
          </text>
        )
      })}
    </svg>
  )
}

/** 결과 카드 PNG(1080×1350) — Canvas API, 외부 의존 없음 */
async function renderCard(score: number, grade: Grade, axes: number[]): Promise<Blob | null> {
  const W = 1080, H = 1350
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const g = c.getContext('2d')
  if (!g) return null
  const sans = '"Pretendard", "Apple SD Gothic Neo", "Malgun Gothic", system-ui, sans-serif'
  g.fillStyle = '#f1f1f0'
  g.fillRect(0, 0, W, H)
  // 상단 아치 라인
  const grad = g.createLinearGradient(0, 0, W, 0)
  grad.addColorStop(0, '#CADA1F')
  grad.addColorStop(0.42, '#7cc63f')
  grad.addColorStop(1, '#069CBB')
  g.fillStyle = grad
  g.fillRect(0, 0, W, 12)
  // 로고(실패해도 카드는 만든다)
  await new Promise<void>((res) => {
    const img = new Image()
    img.onload = () => {
      const h = 46
      g.drawImage(img, 72, 64, (img.width / img.height) * h, h)
      res()
    }
    img.onerror = () => res()
    img.src = '/logo.png'
  })
  g.fillStyle = '#0b6c7d'
  g.font = `600 22px ${sans}`
  g.fillText('SAFETY SCORE', 72, 168)
  g.fillStyle = '#0F172A'
  g.font = `800 60px ${sans}`
  g.fillText('우리 동네 안전 점수', 72, 240)
  // 점수
  g.font = `800 220px ${sans}`
  g.fillStyle = GRADE_COLOR[grade.key].hex
  g.fillText(String(score), 72, 470)
  const scoreW = g.measureText(String(score)).width
  g.font = `700 44px ${sans}`
  g.fillStyle = '#57636b'
  g.fillText('/ 100', 72 + scoreW + 18, 470)
  // 등급 배지
  g.font = `800 40px ${sans}`
  const label = grade.label
  const lw = g.measureText(label).width + 60
  g.fillStyle = GRADE_COLOR[grade.key].hex
  g.beginPath()
  g.roundRect(72, 512, lw, 72, 36)
  g.fill()
  g.fillStyle = '#ffffff'
  g.fillText(label, 102, 562)
  // 항목 막대
  const top = 660
  const rowH = 66
  QUESTIONS.forEach((q, i) => {
    const y = top + i * rowH
    g.fillStyle = '#0F172A'
    g.font = `600 28px ${sans}`
    g.fillText(q.axis, 72, y + 30)
    g.fillStyle = '#dde3e5'
    g.beginPath()
    g.roundRect(300, y + 8, 640, 26, 13)
    g.fill()
    g.fillStyle = '#069CBB'
    g.beginPath()
    g.roundRect(300, y + 8, Math.max(26, (640 * axes[i]) / 100), 26, 13)
    g.fill()
    g.fillStyle = '#57636b'
    g.font = `700 26px ${sans}`
    g.textAlign = 'right'
    g.fillText(String(axes[i]), 1008, y + 30)
    g.textAlign = 'left'
  })
  // 푸터
  g.fillStyle = '#57636b'
  g.font = `500 26px ${sans}`
  g.fillText('통학로 8개 항목 자가진단 · 퍼블릭아이디', 72, 1250)
  g.fillStyle = '#0b6c7d'
  g.font = `700 28px ${sans}`
  g.fillText('www.public-id.co.kr/safety-score', 72, 1294)
  return new Promise((res) => c.toBlob((b) => res(b), 'image/png'))
}

export default function SafetyScoreClient() {
  const [step, setStep] = useState(0) // 0..7 문항, 8 = 결과
  const [answers, setAnswers] = useState<Answers>(() => QUESTIONS.map(() => null))
  const [saved, setSaved] = useState<Saved | null>(null)
  const [started, setStarted] = useState(false)
  const [busy, setBusy] = useState<'save' | 'share' | null>(null)
  const [toast, setToast] = useState<string | null>(null)
  const [fade, setFade] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const done = step >= QUESTIONS.length

  // localStorage는 클라이언트에만 있으므로 hydration 뒤 한 틱 뒤에 읽는다(SSR 불일치 방지)
  useEffect(() => {
    const id = window.setTimeout(() => setSaved(readSaved()), 0)
    return () => window.clearTimeout(id)
  }, [])

  const score = useMemo(() => toScore(answers), [answers])
  const axes = useMemo(() => axisScores(answers), [answers])
  const grade = useMemo(() => toGrade(score), [score])
  const shown = useCountUp(score, done)

  const go = useCallback(
    (next: number) => {
      if (prefersReducedMotion()) {
        setStep(next)
        return
      }
      setFade(true)
      window.setTimeout(() => {
        setStep(next)
        setFade(false)
      }, 180)
    },
    [],
  )

  const choose = useCallback(
    (qi: number, ci: number) => {
      if (!started) {
        setStarted(true)
        track('quiz_start')
      }
      setAnswers((prev) => {
        const n = [...prev]
        n[qi] = ci
        return n
      })
      window.setTimeout(() => go(qi + 1), prefersReducedMotion() ? 0 : 220)
    },
    [go, started],
  )

  // 결과 도달 시 저장·계측(1회)
  const reported = useRef(false)
  useEffect(() => {
    if (!done || reported.current) return
    reported.current = true
    const s: Saved = { score, grade: grade.key, at: new Date().toISOString() }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    } catch {
      /* 저장 불가 환경 — 무시 */
    }
    track('quiz_complete', { score, grade: grade.key })
    topRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }, [done, score, grade.key])

  // 숫자키 1~4 선택, ←/→ 이동
  useEffect(() => {
    if (done) return
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && ['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return
      const q = QUESTIONS[step]
      const k = Number(e.key)
      if (k >= 1 && k <= q.choices.length) {
        e.preventDefault()
        choose(step, k - 1)
      } else if (e.key === 'ArrowLeft' && step > 0) {
        go(step - 1)
      } else if (e.key === 'ArrowRight' && answers[step] !== null) {
        go(step + 1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, done, answers, choose, go])

  const reset = () => {
    reported.current = false
    setAnswers(QUESTIONS.map(() => null))
    setStarted(false)
    setStep(0)
    topRef.current?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' })
  }

  const flash = (msg: string) => {
    setToast(msg)
    window.setTimeout(() => setToast(null), 2400)
  }

  const saveCard = async () => {
    setBusy('save')
    try {
      const blob = await renderCard(score, grade, axes)
      if (!blob) throw new Error('canvas')
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `우리동네-안전점수-${score}점.png`
      a.click()
      URL.revokeObjectURL(url)
      track('quiz_share', { via: 'download' })
      flash('결과 카드를 저장했습니다.')
    } catch {
      flash('이 브라우저에서는 이미지 저장이 되지 않습니다.')
    } finally {
      setBusy(null)
    }
  }

  const share = async () => {
    const text = `우리 동네 안전 점수 ${score}점 · ${grade.label} — 통학로 8개 항목 자가진단`
    const url = 'https://www.public-id.co.kr/safety-score'
    setBusy('share')
    try {
      const nav = navigator as Navigator & { canShare?: (d: ShareData) => boolean }
      if (typeof nav.share === 'function') {
        let files: File[] | undefined
        const blob = await renderCard(score, grade, axes)
        if (blob) {
          const f = new File([blob], 'safety-score.png', { type: 'image/png' })
          if (nav.canShare?.({ files: [f] })) files = [f]
        }
        await nav.share({ title: '우리 동네 안전 점수', text, url, ...(files ? { files } : {}) })
        track('quiz_share', { via: 'webshare' })
      } else {
        await navigator.clipboard.writeText(`${text}\n${url}`)
        track('quiz_share', { via: 'clipboard' })
        flash('결과 문구와 링크를 복사했습니다.')
      }
    } catch {
      /* 사용자가 공유를 취소한 경우 포함 — 조용히 */
    } finally {
      setBusy(null)
    }
  }

  const lowest = useMemo(() => {
    return QUESTIONS.map((q, i) => ({ q, v: axes[i], i }))
      .sort((a, b) => a.v - b.v)
      .slice(0, 3)
  }, [axes])

  const gc = GRADE_COLOR[grade.key]

  return (
    <div ref={topRef} className="scroll-mt-24">
      {/* 지난 점수 배지 */}
      {saved && !started && !done && (
        <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-cloud px-4 py-2 text-sm text-ink-soft">
          <span className="inline-block h-2 w-2 rounded-full bg-teal" aria-hidden />
          지난 진단 <b className="font-display text-ink">{saved.score}점</b> · {toGrade(saved.score).label}
        </p>
      )}

      {!done ? (
        <div className="mx-auto max-w-3xl">
          {/* 진행바 */}
          <div className="flex items-center justify-between gap-4">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.14em] text-teal-700">
              Question {step + 1} / {QUESTIONS.length}
            </p>
            <p className="text-xs text-ink-soft">키보드 1~4로도 고를 수 있습니다</p>
          </div>
          <div className="mt-3 flex gap-1.5" aria-hidden>
            {QUESTIONS.map((q, i) => (
              <span
                key={q.id}
                className={cn(
                  'h-1.5 flex-1 rounded-full transition-colors duration-300',
                  i < step ? 'bg-teal' : i === step ? 'bg-teal-700' : 'bg-line',
                )}
              />
            ))}
          </div>

          <div
            className={cn(
              'mt-10 transition-opacity duration-200',
              fade ? 'opacity-0' : 'opacity-100',
            )}
          >
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">
              {QUESTIONS[step].axis} · 비중 {QUESTIONS[step].weight}%
            </p>
            <h2 className="mt-3 break-keep text-2xl font-extrabold leading-[1.25] tracking-tight text-ink sm:text-3xl">
              {QUESTIONS[step].title}
            </h2>
            <p className="mt-3 break-keep text-[15px] leading-relaxed text-ink-soft">{QUESTIONS[step].hint}</p>

            <div role="radiogroup" aria-label={QUESTIONS[step].title} className="mt-8 grid gap-3">
              {QUESTIONS[step].choices.map((c, ci) => {
                const on = answers[step] === ci
                return (
                  <button
                    key={c.label}
                    type="button"
                    role="radio"
                    aria-checked={on}
                    onClick={() => choose(step, ci)}
                    className={cn(
                      'group flex w-full items-start gap-4 rounded-2xl border bg-white px-5 py-4 text-left transition duration-200',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2',
                      on ? 'border-teal-700 bg-teal-100/60 shadow-md' : 'border-line hover:border-teal hover:-translate-y-0.5 hover:shadow-md',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-display text-sm font-bold transition-colors',
                        on ? 'border-teal-700 bg-teal-700 text-white' : 'border-line-strong text-ink-soft group-hover:border-teal group-hover:text-teal-700',
                      )}
                    >
                      {ci + 1}
                    </span>
                    <span className="min-w-0">
                      <span className="block break-keep text-[15px] font-semibold leading-snug text-ink sm:text-base">{c.label}</span>
                      <span className="mt-1 block break-keep text-[13px] leading-relaxed text-ink-soft">{c.why}</span>
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-8 flex items-center justify-between">
              <button
                type="button"
                onClick={() => go(step - 1)}
                disabled={step === 0}
                className="inline-flex h-11 items-center rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← 이전
              </button>
              <button
                type="button"
                onClick={() => go(step + 1)}
                disabled={answers[step] === null}
                className="inline-flex h-11 items-center rounded-full bg-navy px-6 text-sm font-semibold text-white transition hover:bg-teal disabled:cursor-not-allowed disabled:opacity-40"
              >
                {step === QUESTIONS.length - 1 ? '결과 보기' : '다음 →'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>
          {/* 결과 헤더 */}
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-center">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">Result</p>
              <div className="mt-4 flex items-end gap-3">
                <span className={cn('font-display text-[96px] font-extrabold leading-none tracking-tight sm:text-[128px]', gc.text)} aria-live="polite">
                  {shown}
                </span>
                <span className="mb-3 font-display text-2xl font-bold text-ink-soft">/ 100</span>
              </div>
              <p className={cn('mt-4 inline-flex items-center rounded-full border px-4 py-1.5 text-base font-bold', gc.bg, gc.text, gc.line)}>
                {grade.label}
              </p>
              <p className="mt-4 max-w-md break-keep text-lg leading-relaxed text-ink">{grade.note}</p>
              <p className="mt-2 text-sm text-ink-soft">
                8개 항목 비중 합계 100점 · 현장 판정을 돕는 참고 지표이며 공식 점검을 대신하지 않습니다.
              </p>

              <div className="mt-7 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={saveCard}
                  disabled={busy !== null}
                  className="inline-flex h-11 items-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal disabled:opacity-60"
                >
                  {busy === 'save' ? '만드는 중…' : '결과 카드 저장'}
                </button>
                <button
                  type="button"
                  onClick={share}
                  disabled={busy !== null}
                  className="inline-flex h-11 items-center gap-2 rounded-full border border-line bg-white px-5 text-sm font-semibold text-ink transition hover:border-teal hover:text-teal-700 disabled:opacity-60"
                >
                  {busy === 'share' ? '준비 중…' : '공유하기'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="inline-flex h-11 items-center rounded-full px-4 text-sm font-semibold text-ink-soft transition hover:text-teal-700"
                >
                  다시 하기
                </button>
              </div>
              {toast && (
                <p role="status" className="mt-3 text-sm text-teal-700">
                  {toast}
                </p>
              )}
            </div>
            <div className="rounded-3xl border border-line bg-cloud/60 p-6 sm:p-8">
              <Radar values={axes} />
              <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-4 lg:grid-cols-2">
                {QUESTIONS.map((q, i) => (
                  <li key={q.id} className="flex items-baseline justify-between gap-2 border-b border-line py-1.5">
                    <span className="text-ink-soft">{q.axis}</span>
                    <span className="font-display font-semibold text-ink">{axes[i]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 처방 3 */}
          <div className="mt-16">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">What to fix first</p>
            <h2 className="mt-3 break-keep text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              먼저 손볼 곳 세 가지
            </h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
              {lowest.map(({ q, v }, idx) => (
                <article key={q.id} className="flex flex-col rounded-3xl border border-line bg-white p-6 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-display text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
                      0{idx + 1} · {q.axis}
                    </span>
                    <span className={cn('font-display text-sm font-bold', v < 50 ? 'text-danger-deep' : v < 80 ? 'text-warning-deep' : 'text-success-deep')}>
                      {v}점
                    </span>
                  </div>
                  <h3 className="mt-3 break-keep text-lg font-bold leading-snug text-ink">{q.fix.title}</h3>
                  <p className="mt-3 flex-1 break-keep text-sm leading-relaxed text-ink-soft">{q.fix.body}</p>
                  <Link
                    href={q.fix.href}
                    onClick={() => track('quiz_cta', { to: q.fix.href })}
                    className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-700 transition hover:text-teal"
                  >
                    {q.fix.cta} →
                  </Link>
                </article>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="mt-16 grid gap-6 rounded-3xl bg-navy p-8 text-white sm:p-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">Next step</p>
              <h2 className="mt-3 break-keep text-2xl font-extrabold leading-tight sm:text-3xl">
                점수가 낮은 자리는
                <br />
                현장에서 한 번 더 확인해 드립니다
              </h2>
              <p className="mt-4 max-w-lg break-keep text-[15px] leading-relaxed text-white/75">
                위치를 남겨 주시면 통학로 점검 경험이 있는 시공팀이 사진과 함께 보완안을 드립니다. 규격이 정해져 있다면 견적으로 바로 이어집니다.
              </p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
              <Link
                href="/safety-report"
                onClick={() => track('quiz_cta', { to: '/safety-report' })}
                className="inline-flex h-12 items-center justify-center rounded-full bg-arch px-6 text-[15px] font-semibold text-white transition hover:brightness-105"
              >
                우리 학교 앞 점검 요청
              </Link>
              <Link
                href="/quote"
                onClick={() => track('quiz_cta', { to: '/quote' })}
                className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
              >
                견적 문의
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
