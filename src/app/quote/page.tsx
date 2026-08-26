import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import LeadForm from '@/components/LeadForm'
import OpenAssistantButton from '@/components/OpenAssistantButton'
import BreadcrumbLd from '@/components/BreadcrumbLd'

export const metadata: Metadata = {
  title: '맞춤 견적',
  description:
    '친환경 그래픽 노면표시재·직물시트·홍보판촉물의 규격·수량 맞춤 견적을 신청하세요.',
  alternates: { canonical: '/quote' },
}

export default function QuotePage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-16 sm:px-8">
      <BreadcrumbLd trail={[{ name: '맞춤 견적', path: '/quote' }]} />
      <p className="font-display text-teal-600 text-sm font-semibold uppercase tracking-[0.18em]">
        Quote
      </p>
      <h1 className="text-ink mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
        우리 공간에 맞춘 견적
      </h1>
      <p className="text-ink-soft mt-5 text-lg leading-relaxed">
        설치할 공간·규격·수량을 알려주시면 담당자가 검토해 이메일로 회신드립니다.
        원하는 문구·그래픽을 넣는 맞춤 제작도 가능합니다.
      </p>

      {/* 뭘 골라야 할지 모를 때 — AI 도우미 진입(대표 지적 2026-08-26 "도우미 찾기 어렵다") */}
      <div className="border-line bg-cloud/60 mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl border p-5">
        <p className="text-ink text-sm leading-relaxed">
          <span className="font-semibold">어떤 제품·규격이 맞을지 아직 모르시겠다면</span>
          <br />
          <span className="text-ink-soft">
            AI 도우미가 공간에 맞는 제품과 대략 견적을 바로 안내해 드립니다.
          </span>
        </p>
        <OpenAssistantButton />
      </div>

      {/* 공개 기준 단가 — BRAND_CONSTANTS 정본(대표 확정 2026-06-26) */}
      <section className="mt-10 rounded-3xl border border-line bg-cloud/50 p-7">
        <h2 className="text-ink text-lg font-bold">기준 단가</h2>
        <dl className="mt-4 space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-ink text-sm">친환경 그래픽 노면표시재(알루미늄)</dt>
            <dd className="text-ink text-base font-bold">
              132,000원<span className="text-ink-soft text-sm font-normal">/m²</span>
            </dd>
          </div>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <dt className="text-ink text-sm">친환경 그래픽 직물시트</dt>
            <dd className="text-ink text-base font-bold">
              88,000원<span className="text-ink-soft text-sm font-normal">/m²</span>
            </dd>
          </div>
        </dl>
        <p className="text-ink-soft mt-4 text-xs">
          VAT 포함 기준 단가이며, 규격·수량·디자인에 따라 최종 견적은 달라질 수 있습니다.
          홍보판촉물은 품목별로 별도 안내드립니다.
        </p>
      </section>

      <div className="mt-12">
        <h2 className="text-ink text-2xl font-bold">견적 신청</h2>
        <p className="text-ink-soft mt-2 text-sm">
          정기 관리까지 원하시면{' '}
          <Link href="/subscribe" className="text-teal-600 font-medium hover:underline">
            구독 신청
          </Link>
          을 함께 살펴보세요.
        </p>
        <div className="mt-6">
          <LeadForm
            kinds={[{ value: 'quote', label: '맞춤 견적' }]}
            products={[...PRODUCTS.map((product) => product.name), '기타·잘 모르겠어요']}
            messagePlaceholder={
              '필요한 내용을 적어주세요. 예)\n· 설치 장소: ○○초등학교 정문 앞 보도\n· 규격·수량: 노란발자국 10세트\n· 원하는 문구·그래픽이 있다면 함께 적어주세요.'
            }
            submitLabel="견적 신청하기"
          />
        </div>
      </div>
    </div>
  )
}
