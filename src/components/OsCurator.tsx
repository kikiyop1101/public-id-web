'use client'

import { useState } from 'react'
import { formatPrice } from '@/lib/os-kits'

// 우리회사OS AI 큐레이터 — 회사·고민 한 줄 → 키트 2~3종 추천 (/api/os-curator)

type Pick = {
  name: string
  no: string
  tagline: string
  price: number
  url: string
  reason: string
  scenario: string
}

const EXAMPLES = [
  '동네 카페 두 곳을 운영해요. 인스타에 뭘 올려야 할지 몰라 늘 미룹니다.',
  '부품 제조사입니다. 견적서 한 장 만드는 데 반나절이 갑니다.',
  '혼자 온라인 쇼핑몰을 해요. 리뷰 답글과 문의가 밀려 있어요.',
]

export default function OsCurator() {
  const [about, setAbout] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [intro, setIntro] = useState('')
  const [picks, setPicks] = useState<Pick[] | null>(null)

  async function submit(text: string) {
    const q = text.trim()
    if (q.length < 5 || loading) return
    setLoading(true)
    setError('')
    setPicks(null)
    try {
      const res = await fetch('/api/os-curator', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ about: q }),
      })
      const data = (await res.json()) as { error?: string; intro?: string; picks?: Pick[] }
      if (!res.ok || data.error) {
        setError(data.error || '추천을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.')
        return
      }
      setIntro(data.intro || '')
      setPicks(data.picks || [])
    } catch {
      setError('추천을 가져오지 못했어요. 잠시 후 다시 시도해 주세요.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="border-line bg-cloud mt-12 rounded-2xl border p-6 sm:p-10">
      <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
        AI Curator
      </p>
      <h3 className="text-ink mt-3 text-xl font-extrabold tracking-[-0.025em] sm:text-2xl">
        뭐가 필요한지 모르겠다면, 한 줄로 물어보세요
      </h3>
      <p className="text-ink-soft mt-3 max-w-[42em] text-sm leading-relaxed sm:text-base">
        회사가 하는 일과 요즘 제일 힘든 업무를 적으면, AI가 키트 21종 중 우리 회사에 맞는
        2~3개를 골라 이유와 함께 알려 드립니다.
      </p>

      <form
        className="mt-6"
        onSubmit={(e) => {
          e.preventDefault()
          submit(about)
        }}
      >
        <textarea
          value={about}
          onChange={(e) => setAbout(e.target.value.slice(0, 300))}
          rows={2}
          placeholder="예) 간판 제작 업체예요. 블로그를 해야 하는 건 아는데 글 쓸 시간이 없어요."
          className="border-line text-ink placeholder:text-ink-soft/60 w-full resize-none rounded-xl border bg-white px-4 py-3 text-[15px] leading-relaxed outline-none transition focus:border-teal-700"
        />
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button
            type="submit"
            disabled={loading || about.trim().length < 5}
            className="bg-arch inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? '키트 고르는 중…' : '내게 맞는 키트 찾기'}
          </button>
          <span className="text-ink-soft text-xs">
            입력 내용은 추천에만 쓰이고 저장하지 않습니다.
          </span>
        </div>
      </form>

      {!picks && !loading && (
        <div className="mt-5 flex flex-wrap gap-2">
          {EXAMPLES.map((ex) => (
            <button
              key={ex}
              type="button"
              onClick={() => {
                setAbout(ex)
                submit(ex)
              }}
              className="border-line text-ink-soft rounded-full border bg-white px-4 py-2 text-xs transition hover:border-teal-700 hover:text-teal-700"
            >
              {ex}
            </button>
          ))}
        </div>
      )}

      {error && <p className="mt-5 text-sm text-red-600">{error}</p>}

      {picks && (
        <div className="mt-8">
          {intro && <p className="text-ink max-w-[42em] text-base leading-relaxed">{intro}</p>}
          {picks.length === 0 && !intro && (
            <p className="text-ink-soft text-sm">
              회사가 하는 일이나 힘든 업무를 한 줄로 적어 주시면 맞는 키트를 골라 드려요.
            </p>
          )}
          <div className="mt-5 space-y-4">
            {picks.map((p) => (
              <div key={p.no + p.name} className="border-line rounded-xl border bg-white p-5 sm:p-6">
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <span className="text-ink text-base font-bold">
                    <span className="text-teal-700">{p.no}</span>
                    {p.name}
                  </span>
                  <span className="text-ink-soft text-sm">{p.tagline}</span>
                  <span className="text-ink ml-auto shrink-0 text-sm font-bold">
                    {formatPrice(p.price)}원
                  </span>
                </div>
                <p className="text-ink-soft mt-3 text-sm leading-relaxed">{p.reason}</p>
                <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                  <span className="text-ink font-semibold">이렇게 씁니다 — </span>
                  {p.scenario}
                </p>
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex items-center text-sm font-semibold text-teal-700 transition hover:opacity-75"
                >
                  키트 자세히 보기 →
                </a>
              </div>
            ))}
          </div>
          {picks.length > 0 && (
            <p className="text-ink-soft mt-5 text-sm">
              더 꼼꼼히 보고 싶다면{' '}
              <a href="/scan" className="font-semibold text-teal-700 hover:opacity-75">
                3분 무료 진단
              </a>
              으로 업무 5개 영역을 점검해 보세요.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
