import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { pageMeta } from '@/lib/seo'
import { site } from '@/lib/site'
import { KITS, KIT_GROUPS, formatPrice, priceLabel } from '@/lib/os-kits'
import { KIT_PAGES, getKitPage, relatedKits, type KitPage } from '@/lib/os-kit-pages'
import KitLink from '@/components/KitLink'
import BreadcrumbLd from '@/components/BreadcrumbLd'
import FaqBlock from '@/components/FaqBlock'

// 우리회사OS 상품별 페이지(2026-09-27) — 상품별 검색·AI 질문·쇼츠/쓰레드 홍보의 착지점.
// 구조: h1(고객 고통) → 직답 → 대표이미지 → 가격 박스 → 덜어 주는 일 → 준비물 → 3단계 → FAQ → 같은 묶음 킷 3개 → /os 허브.
// 업종 패키지는 덜어 주는 일·준비물·3단계 대신 구성 킷 목록을 보여 준다.
export const dynamicParams = false

export function generateStaticParams() {
  return KIT_PAGES.map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const p = getKitPage(slug)
  if (!p) return {}
  return pageMeta({
    title: p.title,
    description: p.lead,
    path: `/os/${p.slug}`,
    images: [{ url: p.image, width: 1000, height: 1000, alt: `우리회사OS ${p.label}` }],
  })
}

const SECTION_EYEBROW = 'font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]'
const SECTION_H2 = 'text-ink mt-4 break-keep text-3xl font-extrabold leading-[1.2] tracking-[-0.025em] sm:text-4xl'

function PriceTag({ p, size = 'sm' }: { p: KitPage; size?: 'sm' | 'lg' }) {
  const { price, listPrice } = p.kit
  return (
    <span className={size === 'lg' ? 'flex flex-wrap items-baseline gap-x-3 gap-y-1' : 'text-ink shrink-0 text-sm font-bold'}>
      <span className={size === 'lg' ? 'text-ink font-display text-4xl font-bold tracking-[-0.02em]' : ''}>
        {priceLabel(price)}
      </span>
      {/* 0원(①진단)은 정가 취소선 없이 "무료"만 */}
      {listPrice > 0 && (
        <span className={`text-ink-soft font-normal line-through ${size === 'lg' ? 'text-base' : 'ml-2 text-xs'}`}>
          {size === 'lg' ? '정가 ' : ''}
          {formatPrice(listPrice)}원
        </span>
      )}
    </span>
  )
}

export default async function OsKitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const p = getKitPage(slug)
  if (!p) notFound()

  const { kit } = p
  const isPack = kit.group === '패키지'
  const isFree = kit.price === 0
  const group = KIT_GROUPS.find((g) => g.key === kit.group)
  const related = relatedKits(p)
  const pageUrl = `${site.url}/os/${p.slug}`
  const contactHref = `/contact?msg=${encodeURIComponent(`[우리회사OS 문의] ${p.label}`)}`

  const priceSpecification = [
    { '@type': 'UnitPriceSpecification', price: kit.price, priceCurrency: 'KRW', valueAddedTaxIncluded: true },
    ...(kit.listPrice > kit.price
      ? [
          {
            '@type': 'UnitPriceSpecification',
            priceType: 'https://schema.org/ListPrice',
            price: kit.listPrice,
            priceCurrency: 'KRW',
            valueAddedTaxIncluded: true,
          },
        ]
      : []),
  ]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `우리회사OS ${p.label}`,
    description: p.lead,
    image: `${site.url}${p.image}`,
    sku: p.code,
    category: 'AI 업무 자동화 키트',
    brand: { '@type': 'Brand', name: '우리회사OS' },
    url: pageUrl,
    offers: {
      '@type': 'Offer',
      url: pageUrl,
      price: kit.price,
      priceCurrency: 'KRW',
      availability: 'https://schema.org/InStock',
      priceSpecification,
      seller: { '@type': 'Organization', name: site.legalName, url: site.url },
    },
  }

  return (
    <>
      <BreadcrumbLd
        trail={[
          { name: '구독 서비스', path: '/subscribe' },
          { name: '우리회사OS', path: '/os' },
          { name: p.label, path: `/os/${p.slug}` },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* 히어로 — 모바일은 h1·직답 → 이미지 → 가격 박스 순, 데스크톱은 이미지를 오른쪽 열로 */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <Link href="/os#kits" className="text-teal-700 text-sm font-semibold transition hover:text-teal">
          ← 우리회사OS 키트 {KITS.length}종
        </Link>
        <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_440px] lg:gap-x-16 lg:gap-y-10">
          <div className="min-w-0">
            <p className={SECTION_EYEBROW}>Ourcompany OS</p>
            <p className="text-ink mt-4 text-base font-bold">
              <span className="text-teal-700">{kit.no}</span>
              {kit.name}
              <span className="text-ink-soft ml-2 font-normal">· {group?.title}</span>
            </p>
            <h1 className="text-ink mt-3 break-keep text-4xl font-extrabold leading-[1.15] tracking-[-0.025em] sm:text-5xl">
              {p.h1}
            </h1>
            <p className="text-ink-soft mt-6 max-w-[40em] break-keep text-lg leading-relaxed">{p.lead}</p>
          </div>

          <figure className="border-line overflow-hidden rounded-3xl border bg-white lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:self-start">
            <Image
              src={p.image}
              width={1000}
              height={1000}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 440px, 100vw"
              alt={`우리회사OS ${p.label} 대표 이미지`}
              className="h-auto w-full"
            />
          </figure>

          {/* 가격 박스 — os-kits.ts 값 그대로 */}
          <div className="border-line rounded-2xl border bg-white p-6 sm:p-8 lg:col-start-1 lg:row-start-2 lg:self-start">
            <p className="text-teal-700 text-xs font-semibold">
              {isFree ? '0원 · 무료' : '런칭가 · 부가세 포함'}
            </p>
            <div className="mt-2">
              <PriceTag p={p} size="lg" />
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <KitLink
                kit={p.label}
                place="detail"
                href={kit.url}
                className="bg-arch inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold whitespace-nowrap text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
              >
                {isFree ? '무료로 받기' : '구매하기'}
              </KitLink>
              <Link
                href={contactHref}
                className="border-line text-ink inline-flex h-14 items-center justify-center rounded-full border bg-white px-7 text-[15px] font-semibold whitespace-nowrap transition hover:border-teal-700 hover:text-teal-700"
              >
                문의하기
              </Link>
            </div>
            <p className="text-ink-soft mt-5 break-keep text-sm leading-relaxed">
              받는 것: 킷 파일(zip)·설명서·예시 데이터 — 사내 사용 무제한, 결과물은 귀사 소유. 설치 대행·기술 지원은
              포함되지 않습니다.{p.note ? ` ${p.note}` : ''}
            </p>
          </div>
        </div>
      </section>

      {isPack && p.members ? (
        /* 업종 패키지 — 구성 킷 */
        <section className="bg-cloud border-line border-y">
          <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
            <p className={SECTION_EYEBROW}>What&apos;s inside</p>
            <h2 className={SECTION_H2}>이 패키지에 든 킷 {p.members.length}종</h2>
            <p className="text-ink-soft mt-5 max-w-[42em] break-keep text-lg leading-relaxed">
              킷마다 한 가지 일을 맡습니다. 이름을 누르면 킷별로 무엇을 덜어 주는지, 준비물과 사용 흐름을 볼 수
              있습니다.
            </p>
            <ul className="border-line mt-10 border-t">
              {p.members.map((m) => (
                <li key={m.slug} className="border-line border-b">
                  <Link
                    href={`/os/${m.slug}`}
                    className="grid gap-2 py-5 transition hover:opacity-75 md:grid-cols-[220px_1fr_auto] md:items-baseline md:gap-8"
                  >
                    <span className="text-ink text-base font-bold">
                      <span className="text-teal-700">{m.kit.no}</span>
                      {m.kit.name}
                    </span>
                    <span className="text-ink-soft break-keep text-[15px]">{m.kit.tagline}</span>
                    <PriceTag p={m} />
                  </Link>
                </li>
              ))}
            </ul>
            <p className="text-ink-soft mt-5 text-sm">낱개 가격은 참고용이며 모두 부가세 포함입니다.</p>
          </div>
        </section>
      ) : (
        <>
          {/* 이런 일을 덜어 줍니다 */}
          <section className="bg-cloud border-line border-y">
            <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
              <p className={SECTION_EYEBROW}>What it does</p>
              <h2 className={SECTION_H2}>이런 일을 덜어 줍니다</h2>
              <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-2">
                {p.features.map(([t, d]) => (
                  <div key={t} className="border-line border-t pt-5">
                    <dt className="text-ink text-base font-bold">{t}</dt>
                    <dd className="text-ink-soft mt-2 break-keep text-[15px] leading-relaxed">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </section>

          {/* 준비물 · 사용 흐름 */}
          <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
            <div className="grid gap-16 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
              <div>
                <p className={SECTION_EYEBROW}>Before you start</p>
                <h2 className={SECTION_H2}>준비물</h2>
                <ul className="mt-8 space-y-4">
                  {p.needs.map((n) => (
                    <li key={n} className="flex gap-3">
                      <span aria-hidden className="bg-teal-700 mt-2.5 size-1.5 shrink-0 rounded-full" />
                      <span className="text-ink-soft break-keep text-[15px] leading-relaxed">{n}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className={SECTION_EYEBROW}>How it works</p>
                <h2 className={SECTION_H2}>이렇게 씁니다</h2>
                <ol className="mt-8">
                  {p.steps.map(([t, d], i) => (
                    <li key={t} className="flex gap-5">
                      <div className="flex flex-col items-center">
                        <span className="bg-teal-100 text-teal-700 font-display flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold">
                          {i + 1}
                        </span>
                        {i < p.steps.length - 1 && <span className="bg-line my-1 w-px flex-1" aria-hidden="true" />}
                      </div>
                      <div className={i < p.steps.length - 1 ? 'pb-8' : ''}>
                        <h3 className="text-ink pt-2 text-lg font-bold">{t}</h3>
                        <p className="text-ink-soft mt-2 break-keep text-[15px] leading-relaxed">{d}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </section>
        </>
      )}

      <FaqBlock title="자주 묻는 질문" items={p.faq} className={isPack ? 'bg-white' : 'bg-cloud'} />

      {/* 같은 묶음의 다른 킷 · 허브 */}
      <section className={isPack ? 'bg-cloud border-line border-t' : ''}>
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
          <p className={SECTION_EYEBROW}>More kits</p>
          <h2 className={SECTION_H2}>{isPack ? '다른 업종 패키지' : `${group?.title ?? '같은 묶음'}의 다른 킷`}</h2>
          <ul className="border-line mt-10 border-t">
            {related.map((r) => (
              <li key={r.slug} className="border-line/70 border-b">
                <Link
                  href={`/os/${r.slug}`}
                  className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4 transition hover:opacity-75"
                >
                  <span className="text-ink text-base font-bold">
                    <span className="text-teal-700">{r.kit.no}</span>
                    {r.kit.name}
                  </span>
                  <span className="text-ink-soft order-last basis-full text-sm sm:order-none sm:min-w-0 sm:flex-1 sm:basis-auto">
                    {r.kit.tagline}
                  </span>
                  <PriceTag p={r} />
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/os#kits"
            className="text-teal-700 mt-8 inline-flex text-[15px] font-semibold underline underline-offset-4 hover:no-underline"
          >
            우리회사OS 키트 {KITS.length}종 전체 보기
          </Link>
        </div>
      </section>
    </>
  )
}
