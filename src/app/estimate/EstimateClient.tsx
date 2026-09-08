'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import { track } from '@vercel/analytics'
import { cn } from '@/lib/cn'
import {
  AUTO_QUOTE_LIMIT,
  LIMITS,
  SIGN_SPECS,
  UNIT,
  budgetPlan,
  calc,
  signUnitPrice,
  summaryText,
  won,
  type EstimateInput,
  type FootprintType,
  type InstallMode,
  type SignSpecId,
} from '@/lib/estimate'

// 견적 시뮬레이터 — 담당자가 예산을 잡을 때 슬라이더로 기준가 합계를 즉시 보는 화면.
// 계산은 전부 src/lib/estimate.ts(순수 함수). 여기서는 상태·표시·계측만 한다.

type Mode = 'build' | 'budget'

const DEFAULT: Required<EstimateInput> = {
  roadmark: { on: true, sqm: 10 },
  fabric: { on: false, sqm: 10 },
  footprint: { on: true, type: 'front', sets: 2 },
  aitazone: { on: false, sets: 1 },
  sign: { on: false, spec: 's450x600', qty: 10 },
}

const BUDGET_PRESETS = [3_000_000, 5_000_000, 10_000_000, 30_000_000]

// 슬라이더 — 트랙 8px·썸 28px(모바일 터치 44px 확보는 h-11 래퍼)
const rangeCls =
  'h-11 w-full cursor-pointer appearance-none bg-transparent focus-visible:outline-none ' +
  '[&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:rounded-full [&::-webkit-slider-runnable-track]:bg-line-strong ' +
  '[&::-webkit-slider-thumb]:-mt-2.5 [&::-webkit-slider-thumb]:h-7 [&::-webkit-slider-thumb]:w-7 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-4 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-teal-700 [&::-webkit-slider-thumb]:shadow-md ' +
  '[&::-moz-range-track]:h-2 [&::-moz-range-track]:rounded-full [&::-moz-range-track]:bg-line-strong ' +
  '[&::-moz-range-thumb]:h-7 [&::-moz-range-thumb]:w-7 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-4 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-teal-700 [&::-moz-range-thumb]:shadow-md ' +
  'focus-visible:[&::-webkit-slider-thumb]:ring-2 focus-visible:[&::-webkit-slider-thumb]:ring-teal-700 focus-visible:[&::-webkit-slider-thumb]:ring-offset-2'

const pillCls = (on: boolean) =>
  cn(
    'inline-flex h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold transition',
    on ? 'border-teal-700 bg-teal-700 text-white' : 'border-line bg-white text-ink-soft hover:border-teal hover:text-teal-700',
  )

/** 숫자를 부드럽게 따라가는 표시값(값 변경마다 240ms 트윈) */
function useTween(target: number) {
  const [v, setV] = useState(target)
  const from = useRef(target)
  const raf = useRef(0)
  useEffect(() => {
    const start = performance.now()
    const a = from.current
    const d = 240
    cancelAnimationFrame(raf.current)
    const step = (t: number) => {
      const p = Math.min(1, (t - start) / d)
      const e = 1 - Math.pow(1 - p, 3)
      const cur = a + (target - a) * e
      setV(cur)
      if (p < 1) raf.current = requestAnimationFrame(step)
      else from.current = target
    }
    raf.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf.current)
  }, [target])
  return v
}

function Stepper({
  value,
  min,
  max,
  unit,
  onChange,
  label,
}: {
  value: number
  min: number
  max: number
  unit: string
  onChange: (n: number) => void
  label: string
}) {
  const set = (n: number) => onChange(Math.min(max, Math.max(min, Math.round(n))))
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        aria-label={`${label} 줄이기`}
        onClick={() => set(value - 1)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-lg text-ink-soft transition hover:border-teal hover:text-teal-700"
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label={label}
        min={min}
        max={max}
        value={value}
        onChange={(e) => set(Number(e.target.value))}
        className="h-11 w-20 rounded-xl border border-line bg-white text-center font-display text-base font-semibold text-ink"
      />
      <span className="text-sm text-ink-soft">{unit}</span>
      <button
        type="button"
        aria-label={`${label} 늘리기`}
        onClick={() => set(value + 1)}
        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-lg text-ink-soft transition hover:border-teal hover:text-teal-700"
      >
        +
      </button>
    </div>
  )
}

function ItemCard({
  on,
  onToggle,
  title,
  detail,
  price,
  subtotal,
  children,
}: {
  on: boolean
  onToggle: () => void
  title: string
  detail: string
  price: string
  subtotal?: number
  children?: React.ReactNode
}) {
  return (
    <section
      className={cn(
        'rounded-3xl border bg-white p-5 transition sm:p-6',
        on ? 'border-teal-700 shadow-sm' : 'border-line',
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={on}
            onChange={onToggle}
            className="mt-1 h-5 w-5 accent-teal"
            aria-label={`${title} 담기`}
          />
          <span>
            <span className="block break-keep text-base font-bold text-ink">{title}</span>
            <span className="mt-0.5 block break-keep text-sm text-ink-soft">{detail}</span>
          </span>
        </label>
        <span className="rounded-full bg-teal-100 px-3 py-1 font-display text-xs font-semibold text-teal-700">
          {price}
        </span>
      </div>
      {on && children && <div className="mt-5 border-t border-line pt-5">{children}</div>}
      {on && subtotal !== undefined && (
        <p className="mt-4 flex items-baseline justify-between text-sm">
          <span className="text-ink-soft">품목 소계</span>
          <span className="font-display text-base font-bold text-ink">{won(subtotal)}</span>
        </p>
      )}
    </section>
  )
}

export default function EstimateClient() {
  const [mode, setMode] = useState<Mode>('build')
  const [input, setInput] = useState<Required<EstimateInput>>(DEFAULT)
  const [budget, setBudget] = useState(5_000_000)
  const [copied, setCopied] = useState(false)
  // 시공 방식 — 대표 지시 2026-09-08 "시공 요청이 들어오면 시공비가 따로, 작게 말고 잘 보이게".
  const [install, setInstall] = useState<InstallMode>('pro')

  const result = useMemo(() => calc(input), [input])
  const shown = useTween(result.total)
  const sub = (id: keyof EstimateInput) => result.lines.find((l) => l.id === id)?.subtotal

  // 계측 — 값 변경은 1초 디바운스로 한 번만
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const lastItem = useRef<string>('')
  const patch = <K extends keyof EstimateInput>(id: K, next: Partial<Required<EstimateInput>[K]>) => {
    setInput((s) => ({ ...s, [id]: { ...s[id], ...next } }))
    lastItem.current = id
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => track('estimate_change', { item: lastItem.current }), 1000)
  }

  const summary = summaryText(result, install)
  const quoteHref = summary ? `/quote?items=${encodeURIComponent(summary)}` : '/quote'
  const cta = (to: string) => track('estimate_cta', { to, total_band: result.band })

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(summary)
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    } catch {
      /* 클립보드 미지원 브라우저 — 조용히 무시 */
    }
  }

  const plan = useMemo(() => budgetPlan(budget), [budget])

  return (
    <div className="pb-28 lg:pb-0">
      {/* 모드 탭 */}
      <div role="tablist" aria-label="계산 방식" className="inline-flex rounded-full border border-line bg-white p-1">
        {(
          [
            ['build', '구성해서 계산'],
            ['budget', '예산으로 역산'],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            role="tab"
            type="button"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={cn(
              'h-10 rounded-full px-5 text-sm font-semibold transition',
              mode === m ? 'bg-navy text-white' : 'text-ink-soft hover:text-ink',
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === 'build' ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
          {/* 품목 */}
          <div className="space-y-4">
            {/* 시공 방식 — 시공비는 공개 단가가 없어 합계에 넣지 않고, 대신 크게 "별도"로 보여 준다 */}
            <section className="rounded-3xl border border-line bg-white p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-base font-bold text-ink">시공은 어떻게 하시나요?</h2>
                  <p className="mt-1 text-sm text-ink-soft">아래 합계는 자재 기준가입니다. 시공을 요청하시면 시공비가 따로 붙습니다.</p>
                </div>
                <div role="radiogroup" aria-label="시공 방식" className="inline-flex rounded-full border border-line bg-cloud/60 p-1">
                  {(
                    [
                      ['pro', '시공 요청'],
                      ['self', '셀프 부착'],
                    ] as [InstallMode, string][]
                  ).map(([m, label]) => (
                    <button
                      key={m}
                      type="button"
                      role="radio"
                      aria-checked={install === m}
                      onClick={() => setInstall(m)}
                      className={cn(
                        'h-10 rounded-full px-5 text-sm font-semibold transition',
                        install === m ? 'bg-navy text-white' : 'text-ink-soft hover:text-ink',
                      )}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {install === 'pro' ? (
                <p className="mt-4 rounded-2xl border border-warning-line bg-warning-bg px-4 py-3 text-sm leading-relaxed text-warning-deep">
                  <span className="block text-base font-bold">시공비 · 출장비 별도</span>
                  퍼블릭아이디 전문 시공팀이 실측부터 시공까지 진행합니다. 시공비는 면적·현장 조건·지역에 따라 달라 현장 실측 후 산정하며, 아래 자재 합계에는 들어 있지 않습니다.
                </p>
              ) : (
                <p className="mt-4 rounded-2xl border border-success-line bg-success-bg px-4 py-3 text-sm leading-relaxed text-success-deep">
                  <span className="block text-base font-bold">시공비 없음 — 자재만 받아 직접 붙입니다</span>
                  이형지를 떼어 붙이는 방식이라 소면적·보도블록 구간은 직접 부착이 가능합니다.{' '}
                  <Link href="/guide" className="font-semibold underline underline-offset-2">
                    부착 가이드 영상 보기
                  </Link>
                </p>
              )}
            </section>
            <ItemCard
              on={input.roadmark.on}
              onToggle={() => patch('roadmark', { on: !input.roadmark.on })}
              title="친환경 그래픽 노면표시재"
              detail="횡단보도·보행안전·캠페인 노면 — 부착식 알루미늄 박판 스티커"
              price={`${won(UNIT.roadmark)}/㎡`}
              subtotal={sub('roadmark')}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">시공 면적</span>
                <Stepper
                  label="노면표시재 면적"
                  value={input.roadmark.sqm}
                  min={LIMITS.roadmarkSqm[0]}
                  max={LIMITS.roadmarkSqm[1]}
                  unit="㎡"
                  onChange={(sqm) => patch('roadmark', { sqm })}
                />
              </div>
              <input
                type="range"
                aria-label="노면표시재 면적 슬라이더"
                min={LIMITS.roadmarkSqm[0]}
                max={LIMITS.roadmarkSqm[1]}
                value={input.roadmark.sqm}
                onChange={(e) => patch('roadmark', { sqm: Number(e.target.value) })}
                className={rangeCls}
              />
              <p className="text-xs text-ink-soft">1㎡ = 1m × 1m. 횡단보도 앞 대기 구역 한 곳은 보통 2~4㎡입니다.</p>
            </ItemCard>

            <ItemCard
              on={input.footprint.on}
              onToggle={() => patch('footprint', { on: !input.footprint.on })}
              title="노란발자국"
              detail="횡단보도 앞 보도의 안심 대기선 — 세트 단위"
              price={`전면형 ${won(UNIT.footprintFront)}~ · 우측면형 ${won(UNIT.footprintSide)}~`}
              subtotal={sub('footprint')}
            >
              <div className="flex flex-wrap gap-2">
                {(
                  [
                    ['front', '전면형'],
                    ['side', '우측면형'],
                  ] as [FootprintType, string][]
                ).map(([t, label]) => (
                  <button
                    key={t}
                    type="button"
                    aria-pressed={input.footprint.type === t}
                    onClick={() => patch('footprint', { type: t })}
                    className={pillCls(input.footprint.type === t)}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">세트 수</span>
                <Stepper
                  label="노란발자국 세트 수"
                  value={input.footprint.sets}
                  min={LIMITS.footprintSets[0]}
                  max={LIMITS.footprintSets[1]}
                  unit="세트"
                  onChange={(sets) => patch('footprint', { sets })}
                />
              </div>
              <input
                type="range"
                aria-label="노란발자국 세트 수 슬라이더"
                min={LIMITS.footprintSets[0]}
                max={LIMITS.footprintSets[1]}
                value={input.footprint.sets}
                onChange={(e) => patch('footprint', { sets: Number(e.target.value) })}
                className={rangeCls}
              />
              <p className="text-xs text-ink-soft">횡단보도 한 곳 = 양쪽 보도 2세트가 기본입니다.</p>
            </ItemCard>

            <ItemCard
              on={input.sign.on}
              onToggle={() => patch('sign', { on: !input.sign.on })}
              title="안전표지(낱개)"
              detail="주정차금지·어린이보호구역 등 — 규격 면적 × ㎡ 단가"
              price={`${won(UNIT.signPerSqm)}/㎡ 기준`}
              subtotal={sub('sign')}
            >
              <div className="flex flex-wrap gap-2">
                {SIGN_SPECS.map((s) => (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={input.sign.spec === s.id}
                    onClick={() => patch('sign', { spec: s.id as SignSpecId })}
                    className={pillCls(input.sign.spec === s.id)}
                  >
                    {s.label}
                    <span className="ml-2 font-display text-xs opacity-80">{won(signUnitPrice(s.id))}</span>
                  </button>
                ))}
              </div>
              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">수량</span>
                <Stepper
                  label="안전표지 수량"
                  value={input.sign.qty}
                  min={LIMITS.signQty[0]}
                  max={LIMITS.signQty[1]}
                  unit="장"
                  onChange={(qty) => patch('sign', { qty })}
                />
              </div>
              <input
                type="range"
                aria-label="안전표지 수량 슬라이더"
                min={LIMITS.signQty[0]}
                max={LIMITS.signQty[1]}
                value={input.sign.qty}
                onChange={(e) => patch('sign', { qty: Number(e.target.value) })}
                className={rangeCls}
              />
            </ItemCard>

            <ItemCard
              on={input.fabric.on}
              onToggle={() => patch('fabric', { on: !input.fabric.on })}
              title="친환경 그래픽 직물시트"
              detail="벽면·기둥·천장 부착 — 노란볼라드 드레스업도 이 소재"
              price={`${won(UNIT.fabric)}/㎡`}
              subtotal={sub('fabric')}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">부착 면적</span>
                <Stepper
                  label="직물시트 면적"
                  value={input.fabric.sqm}
                  min={LIMITS.fabricSqm[0]}
                  max={LIMITS.fabricSqm[1]}
                  unit="㎡"
                  onChange={(sqm) => patch('fabric', { sqm })}
                />
              </div>
              <input
                type="range"
                aria-label="직물시트 면적 슬라이더"
                min={LIMITS.fabricSqm[0]}
                max={LIMITS.fabricSqm[1]}
                value={input.fabric.sqm}
                onChange={(e) => patch('fabric', { sqm: Number(e.target.value) })}
                className={rangeCls}
              />
            </ItemCard>

            <ItemCard
              on={input.aitazone.on}
              onToggle={() => patch('aitazone', { on: !input.aitazone.on })}
              title="아이타존"
              detail="학교·유치원 앞 아동 승하차 안전구역 — 전체형"
              price={`${won(UNIT.aitazone)}~/세트`}
              subtotal={sub('aitazone')}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-ink">구역 수</span>
                <Stepper
                  label="아이타존 구역 수"
                  value={input.aitazone.sets}
                  min={LIMITS.aitazoneSets[0]}
                  max={LIMITS.aitazoneSets[1]}
                  unit="세트"
                  onChange={(sets) => patch('aitazone', { sets })}
                />
              </div>
              <input
                type="range"
                aria-label="아이타존 구역 수 슬라이더"
                min={LIMITS.aitazoneSets[0]}
                max={LIMITS.aitazoneSets[1]}
                value={input.aitazone.sets}
                onChange={(e) => patch('aitazone', { sets: Number(e.target.value) })}
                className={rangeCls}
              />
            </ItemCard>

            <section className="rounded-3xl border border-dashed border-line-strong bg-cloud/50 p-5 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="break-keep text-base font-bold text-ink">친환경 홍보판촉물</p>
                  <p className="mt-0.5 break-keep text-sm text-ink-soft">
                    품목·수량마다 달라 공개 단가가 없습니다. 품목을 알려주시면 따로 안내드립니다.
                  </p>
                </div>
                <Link
                  href="/contact"
                  onClick={() => cta('/contact#promo')}
                  className="inline-flex h-10 items-center justify-center rounded-full border border-line bg-white px-4 text-sm font-semibold text-teal-700 transition hover:border-teal"
                >
                  판촉물 문의
                </Link>
              </div>
            </section>
          </div>

          {/* 합계 — 데스크톱 스티키 */}
          <aside className="hidden lg:sticky lg:top-24 lg:block">
            <SummaryCard
              lines={result.lines}
              total={shown}
              rawTotal={result.total}
              autoQuote={result.autoQuote}
              install={install}
              quoteHref={quoteHref}
              onCta={cta}
              onCopy={copy}
              copied={copied}
            />
          </aside>
        </div>
      ) : (
        <BudgetView budget={budget} setBudget={setBudget} plan={plan} onCta={cta} />
      )}

      {/* 모바일 하단 고정 바 */}
      {mode === 'build' && (
        <div className="pi-estimate-bar fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 px-5 py-3 shadow-[0_-6px_16px_-8px_rgba(22,48,61,0.18)] backdrop-blur lg:hidden">
          <div className="mx-auto flex max-w-3xl items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-teal-700">
                자재 기준가 · VAT 포함
              </p>
              <p className="truncate font-display text-xl font-bold text-ink">
                {won(shown)}
                {install === 'pro' && (
                  <span className="ml-2 rounded-full bg-warning-bg px-2 py-0.5 align-middle font-sans text-[11px] font-bold text-warning-deep">
                    시공비 별도
                  </span>
                )}
              </p>
            </div>
            <Link
              href={quoteHref}
              onClick={() => cta('/quote')}
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-arch px-5 text-sm font-semibold text-white"
            >
              이 구성으로 견적 신청
            </Link>
          </div>
        </div>
      )}

      {/* 모바일에서는 합계 상세를 본문 끝에 한 번 더 */}
      {mode === 'build' && (
        <div className="mt-8 lg:hidden">
          <SummaryCard
            lines={result.lines}
            total={shown}
            rawTotal={result.total}
            autoQuote={result.autoQuote}
            install={install}
            quoteHref={quoteHref}
            onCta={cta}
            onCopy={copy}
            copied={copied}
          />
        </div>
      )}
    </div>
  )
}

function SummaryCard({
  lines,
  total,
  rawTotal,
  autoQuote,
  install,
  quoteHref,
  onCta,
  onCopy,
  copied,
}: {
  lines: ReturnType<typeof calc>['lines']
  total: number
  rawTotal: number
  autoQuote: boolean
  install: InstallMode
  quoteHref: string
  onCta: (to: string) => void
  onCopy: () => void
  copied: boolean
}) {
  const empty = lines.length === 0
  return (
    <div className="rounded-3xl border border-line bg-white p-6 shadow-sm">
      <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Summary</p>
      <h2 className="mt-2 text-lg font-bold text-ink">자재 기준가 합계</h2>

      {empty ? (
        <p className="mt-4 rounded-2xl bg-cloud/60 p-4 text-sm text-ink-soft">
          왼쪽에서 품목을 담으면 합계가 바로 계산됩니다.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-line border-y border-line">
          {lines.map((l) => (
            <li key={l.id} className="flex items-baseline justify-between gap-3 py-3 text-sm">
              <span className="min-w-0">
                <span className="block break-keep font-medium text-ink">{l.label}</span>
                <span className="block text-xs text-ink-soft">
                  {l.detail} · {l.qty.toLocaleString('ko-KR')}
                  {l.unit} × {won(l.unitPrice)}
                  {l.from ? '~' : ''}
                </span>
              </span>
              <span className="shrink-0 font-display font-semibold text-ink">
                {won(l.subtotal)}
                {l.from ? '~' : ''}
              </span>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-5 flex items-end justify-between gap-3">
        <span className="text-sm text-ink-soft">자재 합계 · VAT 포함</span>
        <span className="font-display text-3xl font-bold tracking-tight text-ink" aria-live="polite">
          {won(total)}
        </span>
      </div>

      {/* 시공비 — 합계 바로 아래 같은 크기로, 작은 글씨로 흘리지 않는다 */}
      {install === 'pro' ? (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-warning-line bg-warning-bg px-4 py-3">
          <span className="min-w-0">
            <span className="block text-sm font-bold text-warning-deep">+ 시공비 · 출장비</span>
            <span className="block text-xs text-warning-deep/80">전문 시공팀 · 현장 실측 후 산정</span>
          </span>
          <span className="shrink-0 font-display text-lg font-bold text-warning-deep">별도</span>
        </div>
      ) : (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-success-line bg-success-bg px-4 py-3">
          <span className="min-w-0">
            <span className="block text-sm font-bold text-success-deep">셀프 부착 · 시공비 없음</span>
            <span className="block text-xs text-success-deep/80">자재만 받아 직접 붙입니다</span>
          </span>
          <span className="shrink-0 font-display text-lg font-bold text-success-deep">0원</span>
        </div>
      )}

      {!empty && (
        <p
          className={cn(
            'mt-4 rounded-2xl border px-4 py-3 text-sm font-semibold',
            autoQuote
              ? 'border-success-line bg-success-bg text-success-deep'
              : 'border-warning-line bg-warning-bg text-warning-deep',
          )}
        >
          {autoQuote
            ? install === 'pro'
              ? '자재는 자동 견적 — 시공비는 담당자가 현장 확인 후 합산해 회신드립니다'
              : '자동 견적 대상 — 신청하면 바로 견적서가 나갑니다'
            : '담당자 검토 견적 — 신청 후 검토해 회신드립니다'}
          <span className="mt-1 block text-xs font-normal opacity-80">
            {autoQuote
              ? `자재 총액 ${won(AUTO_QUOTE_LIMIT)} 미만이고 모든 품목이 공개 단가표 안입니다.`
              : `자재 총액 ${won(AUTO_QUOTE_LIMIT)} 이상은 규격·물량 조건을 검토합니다.`}
          </span>
        </p>
      )}

      <p className="mt-4 break-keep text-xs leading-relaxed text-ink-soft">
        모든 금액은 공개 기준가이며 규격·수량·현장 조건에 따라 달라집니다. 디자인비는 별도이고, 노란발자국·아이타존은 기준가 이상(~)입니다.
      </p>

      <div className="mt-5 flex flex-col gap-2">
        <Link
          href={quoteHref}
          onClick={() => onCta('/quote')}
          aria-disabled={empty}
          className={cn(
            'inline-flex h-12 items-center justify-center rounded-full bg-arch px-6 text-[15px] font-semibold text-white transition hover:brightness-105',
            empty && 'pointer-events-none opacity-50',
          )}
        >
          이 구성으로 견적 신청
        </Link>
        <Link
          href="/contact"
          onClick={() => onCta('/contact')}
          className="inline-flex h-12 items-center justify-center rounded-full border border-line bg-white px-6 text-[15px] font-semibold text-ink transition hover:border-teal hover:text-teal-700"
        >
          상담 문의
        </Link>
        <button
          type="button"
          onClick={onCopy}
          disabled={empty}
          className="inline-flex h-11 items-center justify-center rounded-full px-6 text-sm font-semibold text-teal-700 transition hover:bg-cloud disabled:opacity-40"
        >
          {copied ? '복사했습니다' : '구성 요약 복사'}
        </button>
      </div>
      <p className="mt-2 text-center text-[11px] text-ink-soft">{rawTotal > 0 ? '요약을 붙여넣어 내부 보고에 쓰실 수 있습니다.' : ''}</p>
    </div>
  )
}

function BudgetView({
  budget,
  setBudget,
  plan,
  onCta,
}: {
  budget: number
  setBudget: (n: number) => void
  plan: ReturnType<typeof budgetPlan>
  onCta: (to: string) => void
}) {
  return (
    <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-start">
      <div className="space-y-6">
        <section className="rounded-3xl border border-line bg-white p-5 sm:p-6">
          <h2 className="text-base font-bold text-ink">예산</h2>
          <p className="mt-1 text-sm text-ink-soft">예산 전액을 한 품목에 쓸 때 가능한 물량입니다(기준가·VAT 포함, 시공비 제외).</p>
          <div className="mt-4 flex flex-wrap gap-2">
            {BUDGET_PRESETS.map((b) => (
              <button key={b} type="button" aria-pressed={budget === b} onClick={() => setBudget(b)} className={pillCls(budget === b)}>
                {b >= 10_000_000 ? `${b / 10_000_000}천만 원` : `${b / 1_000_000}백만 원`}
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center gap-2">
            <input
              type="number"
              inputMode="numeric"
              aria-label="예산(원)"
              min={0}
              step={100_000}
              value={budget}
              onChange={(e) => setBudget(Math.max(0, Number(e.target.value)))}
              className="h-11 w-full max-w-xs rounded-xl border border-line bg-white px-3 font-display text-base font-semibold text-ink"
            />
            <span className="text-sm text-ink-soft">원</span>
          </div>
          <input
            type="range"
            aria-label="예산 슬라이더"
            min={500_000}
            max={50_000_000}
            step={100_000}
            value={Math.min(50_000_000, Math.max(500_000, budget))}
            onChange={(e) => setBudget(Number(e.target.value))}
            className={rangeCls}
          />
        </section>

        <section className="overflow-hidden rounded-3xl border border-line bg-white">
          <table className="w-full text-sm">
            <thead className="bg-cloud/60 text-left text-xs font-semibold uppercase tracking-[0.06em] text-ink-soft">
              <tr>
                <th className="px-5 py-3">품목</th>
                <th className="px-5 py-3">단가</th>
                <th className="px-5 py-3 text-right">{won(budget)}으로</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-line">
              {plan.map((r) => (
                <tr key={r.id}>
                  <td className="px-5 py-3">
                    <span className="block break-keep font-medium text-ink">{r.label}</span>
                    <span className="block text-xs text-ink-soft">{r.detail}</span>
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 font-display text-ink-soft">
                    {won(r.unitPrice)}/{r.unit}
                  </td>
                  <td className="whitespace-nowrap px-5 py-3 text-right font-display text-base font-bold text-teal-700">
                    {r.amount.toLocaleString('ko-KR')}
                    <span className="ml-1 text-xs font-normal text-ink-soft">{r.unit}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="break-keep px-5 py-4 text-xs leading-relaxed text-ink-soft">
            예산은 기준가 기준 물량이며, 시공·출장비와 디자인비는 별도입니다. 여러 품목을 섞으려면 &lsquo;구성해서 계산&rsquo;
            탭에서 담아 보세요.
          </p>
        </section>
      </div>

      <aside className="rounded-3xl border border-line bg-navy p-6 text-white lg:sticky lg:top-24">
        <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-teal-100">Next</p>
        <h2 className="mt-2 break-keep text-lg font-bold">예산에 맞춘 구성이 필요하시면</h2>
        <p className="mt-2 break-keep text-sm leading-relaxed text-white/70">
          설치 장소와 예산을 알려주시면 규격·수량을 예산 안에서 맞춰 제안드립니다.
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <Link
            href={`/quote?items=${encodeURIComponent(`[예산 문의]\n예산: ${won(budget)}\n설치 장소·품목: `)}`}
            onClick={() => onCta('/quote#budget')}
            className="inline-flex h-12 items-center justify-center rounded-full bg-arch px-6 text-[15px] font-semibold text-white transition hover:brightness-105"
          >
            예산으로 견적 신청
          </Link>
          <Link
            href="/contact"
            onClick={() => onCta('/contact#budget')}
            className="inline-flex h-12 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-navy transition hover:bg-cloud"
          >
            상담 문의
          </Link>
        </div>
      </aside>
    </div>
  )
}
