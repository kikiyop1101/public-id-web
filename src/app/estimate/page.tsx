import type { Metadata } from 'next'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import BreadcrumbLd from '@/components/BreadcrumbLd'
import EstimateClient from './EstimateClient'

// 견적 시뮬레이터 — 2026-09-08 신설(홈페이지 체류시간 기획안 후보 4안).
// 담당자가 예산을 잡을 때 슬라이더로 기준가 합계를 즉시 본다. 단가 정본 = src/lib/estimate.ts.
export const metadata: Metadata = {
  title: '견적 시뮬레이터',
  description:
    '노면표시재·노란발자국·안전표지·직물시트의 규격과 수량을 슬라이더로 움직이며 공개 기준가 합계를 바로 확인하세요. 예산으로 가능한 물량도 역산해 드립니다.',
  alternates: { canonical: '/estimate' },
}

export default function EstimatePage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: '견적 시뮬레이터', path: '/estimate' }]} />
      <PageHero
        eyebrow="Estimate"
        title={
          <>
            슬라이더로 가늠하는
            <br />
            기준가 합계
          </>
        }
        description="규격과 수량을 움직이면 기준가 합계가 바로 바뀝니다. 예산부터 정해져 있다면 그 예산으로 가능한 물량을 역산해 보세요. 마음에 드는 구성은 그대로 견적 신청으로 넘어갑니다."
      />
      <section className="bg-paper">
        <Container className="py-12 sm:py-16">
          <EstimateClient />
          <div className="mt-12 grid gap-4 rounded-3xl border border-line bg-white p-6 sm:grid-cols-3 sm:p-8">
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">01</p>
              <p className="mt-2 break-keep font-bold text-ink">기준가는 공개 단가 그대로</p>
              <p className="mt-1 break-keep text-sm leading-relaxed text-ink-soft">
                <Link href="/quote" className="font-medium text-teal-700 hover:underline">
                  맞춤 견적
                </Link>{' '}
                페이지의 공개 단가와 같은 숫자입니다. 감춰진 항목은 없습니다.
              </p>
            </div>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">02</p>
              <p className="mt-2 break-keep font-bold text-ink">시공·디자인비는 현장 견적</p>
              <p className="mt-1 break-keep text-sm leading-relaxed text-ink-soft">
                거리·바닥 상태·문구 유무에 따라 달라져 여기서는 계산하지 않습니다. 신청하시면 검토 후 함께 안내합니다.
              </p>
            </div>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">03</p>
              <p className="mt-2 break-keep font-bold text-ink">1,000만 원 미만은 자동 견적</p>
              <p className="mt-1 break-keep text-sm leading-relaxed text-ink-soft">
                모든 품목이 공개 단가표 안이고 총액이 1,000만 원 미만이면 신청 즉시 견적서가 발행됩니다.
              </p>
            </div>
          </div>
        </Container>
      </section>
    </>
  )
}
