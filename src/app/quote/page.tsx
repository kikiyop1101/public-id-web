import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import LeadForm from '@/components/LeadForm'
import OpenAssistantButton from '@/components/OpenAssistantButton'
import BreadcrumbLd from '@/components/BreadcrumbLd'
import FaqBlock, { type FaqItem } from '@/components/FaqBlock'
import EstimateClient from './EstimateClient'

// 맞춤 견적 = 시뮬레이터(#simulator) + 신청서(#apply) 한 쪽.
// 2026-11-17 견적 시뮬레이터(/estimate, 09-08 신설)를 이 쪽으로 합쳤다 — 대표 "페이지가 너무 많은 느낌".
// 방문 기록(90일): /quote 방문 46명 중 1분 넘게 머문 사람 1명·접수 0건, /estimate는 32명 중 5명이 1분 넘게 머물렀다.
// 안내문 3개를 지나야 신청서가 나오던 쪽을 "숫자부터 만져 보고 → 그 구성 그대로 신청"으로 바꿨다. 단가 정본 = src/lib/estimate.ts.
export const metadata: Metadata = pageMeta({
  title: '맞춤 견적 — 노면표시재 기준가 계산·견적 신청',
  description:
    '노면표시재·노란발자국·안전표지·직물시트의 공개 기준가 합계를 슬라이더로 바로 계산하고, 그 구성 그대로 맞춤 견적을 신청하세요. 예산으로 가능한 물량도 역산해 드립니다.',
  path: '/quote',
})

// 견적 FAQ (2026-09-27) — 단가 정본 = src/lib/estimate.ts·assistant-knowledge.ts. 가격은 항상 "기준가".
const QUOTE_FAQ: FaqItem[] = [
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

const NOTES = [
  {
    t: '기준가는 공개 단가 그대로',
    d: '노면표시재 132,000원/㎡ · 직물시트 88,000원/㎡(VAT 포함). 감춰진 항목은 없습니다.',
  },
  {
    t: '시공·디자인비는 현장 견적',
    d: '거리·바닥 상태·문구 유무에 따라 달라져 여기서는 계산하지 않습니다. 신청하시면 검토 후 함께 안내합니다.',
  },
  {
    t: '1,000만 원 미만은 자동 견적',
    d: '모든 품목이 공개 단가표 안이고 총액이 1,000만 원 미만이면 신청 즉시 견적서가 발행됩니다.',
  },
]

// ?items= — 위 시뮬레이터가 넘기는 구성 요약(사람이 읽는 텍스트, 2,000자 컷)
export default async function QuotePage({
  searchParams,
}: {
  searchParams: Promise<{ items?: string | string[] }>
}) {
  const sp = await searchParams
  const raw = Array.isArray(sp.items) ? sp.items[0] : sp.items
  const items = raw ? raw.slice(0, 2000) : undefined
  return (
    <>
      <BreadcrumbLd trail={[{ name: '맞춤 견적', path: '/quote' }]} />
      <PageHero
        eyebrow="Quote"
        title={
          <>
            기준가부터 보고,
            <br />
            그대로 견적 신청
          </>
        }
        description="규격과 수량을 움직이면 기준가 합계가 바로 바뀝니다. 마음에 드는 구성은 아래 신청서로 그대로 넘어가고, 담당자가 검토해 이메일로 회신드립니다."
      />

      <section id="simulator" className="scroll-mt-24 bg-paper">
        <Container className="py-12 sm:py-16">
          <EstimateClient />
          <dl className="mt-12 grid gap-x-10 gap-y-6 border-t border-line pt-8 sm:grid-cols-3">
            {NOTES.map((n) => (
              <div key={n.t}>
                <dt className="break-keep font-bold text-ink">{n.t}</dt>
                <dd className="mt-1.5 break-keep text-sm leading-relaxed text-ink-soft">{n.d}</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="border-t border-line bg-white py-20 sm:py-28">
        <Container className="grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Apply
            </p>
            <h2 className="mt-4 break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
              견적 신청
            </h2>
            <p className="mt-5 break-keep text-lg leading-relaxed text-ink-soft">
              설치할 공간·규격·수량을 알려주시면 담당자가 검토해 이메일로 회신드립니다. 원하는 문구·그래픽을 넣는 맞춤 제작도
              가능합니다.
            </p>
            {/* 뭘 골라야 할지 모를 때 — AI 도우미 진입(대표 지적 2026-08-26 "도우미 찾기 어렵다") */}
            <div className="mt-8 border-t border-line pt-6">
              <p className="break-keep text-sm leading-relaxed text-ink">
                <span className="font-semibold">어떤 제품·규격이 맞을지 아직 모르시겠다면</span>
                <br />
                <span className="text-ink-soft">AI 도우미가 공간에 맞는 제품과 대략 견적을 바로 안내해 드립니다.</span>
              </p>
              <div className="mt-4">
                <OpenAssistantButton />
              </div>
            </div>
            <p className="mt-8 break-keep text-sm leading-relaxed text-ink-soft">
              시공 뒤 정기 관리까지 원하시면{' '}
              <Link href="/subscribe" className="font-semibold text-teal-700 hover:underline">
                구독 서비스
              </Link>
              를, 간단한 문의는{' '}
              <Link href="/contact" className="font-semibold text-teal-700 hover:underline">
                문의하기
              </Link>
              를 이용해 주세요.
            </p>
          </div>
          {/* #apply = 신청서 칸. 휴대폰에서는 왼쪽 글(제목·도우미 안내)이 먼저 쌓이므로 섹션이 아니라 여기로 내려온다 */}
          <div id="apply" className="scroll-mt-24 lg:col-span-7">
            {items && (
              <p className="mb-4 break-keep rounded-xl bg-teal-100 px-4 py-3 text-sm font-medium text-teal-700">
                계산기에서 고른 구성을 아래 &lsquo;요청 내용&rsquo;에 넣어 두었습니다. 성함과 이메일만 적으면 신청됩니다.
              </p>
            )}
            <LeadForm
              kinds={[{ value: 'quote', label: '맞춤 견적' }]}
              products={[...PRODUCTS.map((product) => product.name), '기타·잘 모르겠어요']}
              messagePlaceholder={
                '필요한 내용을 적어주세요. 예)\n· 설치 장소: ○○초등학교 정문 앞 보도\n· 규격·수량: 노란발자국 10세트\n· 원하는 문구·그래픽이 있다면 함께 적어주세요.'
              }
              defaultMessage={items}
              submitLabel="견적 신청하기"
            />
          </div>
        </Container>
      </section>

      <FaqBlock title="견적에 대해 자주 묻는 질문" items={QUOTE_FAQ} />
    </>
  )
}
