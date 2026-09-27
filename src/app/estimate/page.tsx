import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import BreadcrumbLd from '@/components/BreadcrumbLd'
import FaqBlock, { type FaqItem } from '@/components/FaqBlock'
import EstimateClient from './EstimateClient'

// 견적 시뮬레이터 — 2026-09-08 신설(홈페이지 체류시간 기획안 후보 4안).
// 담당자가 예산을 잡을 때 슬라이더로 기준가 합계를 즉시 본다. 단가 정본 = src/lib/estimate.ts.
export const metadata: Metadata = pageMeta({
  title: '견적 시뮬레이터 — 노면표시재 기준가 계산',
  description:
    '노면표시재·노란발자국·안전표지·직물시트의 공개 기준가 합계를 슬라이더로 바로 계산하세요. 예산으로 가능한 물량도 역산해 드립니다.',
  path: '/estimate',
})

// 견적 FAQ (2026-09-27) — 단가 정본 = src/lib/estimate.ts·assistant-knowledge.ts. 가격은 항상 "기준가".
const ESTIMATE_FAQ: FaqItem[] = [
  {
    q: '노면표시재 1㎡ 가격은 얼마인가요?',
    a: '친환경 그래픽 노면표시재는 기준가 132,000원/㎡(VAT 포함)입니다. 직물시트는 88,000원/㎡, 노란발자국은 전면형 60만 원~·우측면형 40만 원~이고, 안전표지는 132,000원/㎡ 기준으로 규격별 계산합니다. 정확한 견적은 수량·규격·현장 조건에 따라 달라지니 문의로 안내해 드립니다.',
  },
  {
    q: '시뮬레이터 금액이 최종 견적인가요?',
    a: '아니요, 공개 기준가(VAT 포함)로 계산한 자재 합계입니다. 시공·디자인비는 거리·바닥 상태·문구 유무에 따라 달라져 신청 후 현장 견적으로 함께 안내합니다.',
  },
  {
    q: '견적서는 바로 받을 수 있나요?',
    a: '모든 품목이 공개 단가표 안이고 총액이 1,000만 원 미만이면 신청 즉시 견적서가 발행됩니다. 그 밖의 구성은 검토 후 안내해 드립니다.',
  },
  {
    q: '예산에 맞춰 가능한 물량을 계산할 수 있나요?',
    a: '네. "예산으로 역산"을 고르고 예산을 정하면, 예산 전액을 한 품목에 쓸 때 가능한 물량을 기준가(VAT 포함, 시공비 제외)로 보여 드립니다.',
  },
]

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
      <FaqBlock title="견적에 대해 자주 묻는 질문" items={ESTIMATE_FAQ} />
    </>
  )
}
