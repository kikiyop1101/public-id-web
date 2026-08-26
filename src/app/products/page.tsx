import type { Metadata } from 'next'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { getProductMedia } from '@/lib/product-media'
import ProductTabs from '@/components/ProductTabs'
import ProductSection from '@/components/ProductSection'
import PageHero from '@/components/PageHero'

export const metadata: Metadata = {
  title: '제품 — 친환경 그래픽 노면표시재·노란발자국·직물시트·홍보판촉물',
  description: '퍼블릭아이디의 친환경 제품군 4종을 소개합니다.',
  alternates: { canonical: '/products' },
}

// 공개 기준가(VAT 포함, 정본=assistant-knowledge.ts) — 있는 제품만 Offer 기재
const BASE_PRICES: Partial<Record<string, string>> = {
  roadmark: '132000',
  fabric: '88000',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name: '퍼블릭아이디 친환경 제품군',
  itemListElement: PRODUCTS.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    item: {
      '@type': 'Product',
      name: p.name,
      description: p.summary,
      url: `https://www.public-id.co.kr${p.anchor}`,
      brand: { '@type': 'Brand', name: '퍼블릭아이디' },
      ...(BASE_PRICES[p.id]
        ? {
            offers: {
              '@type': 'Offer',
              url: 'https://www.public-id.co.kr/quote',
              priceCurrency: 'KRW',
              price: BASE_PRICES[p.id],
              priceSpecification: {
                '@type': 'UnitPriceSpecification',
                price: BASE_PRICES[p.id],
                priceCurrency: 'KRW',
                unitText: '㎡',
              },
              availability: 'https://schema.org/InStock',
              seller: { '@id': 'https://www.public-id.co.kr/#organization' },
            },
          }
        : {}),
    },
  })),
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.public-id.co.kr' },
    { '@type': 'ListItem', position: 2, name: '제품', item: 'https://www.public-id.co.kr/products' },
  ],
}

export default function ProductsPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c'),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />
      {/* 2026-08-26 — 얇은 네이비 띠 → 표준 PageHero(서브페이지 통일). 탭이 바로 아래 목차 역할 */}
      <PageHero
        eyebrow="Products"
        title={
          <>
            친환경 소재로 만드는
            <br />
            네 가지 제품
          </>
        }
        description="특허받은 부착식 노면표시재부터 직물시트·홍보판촉물·출력 라인업까지 — 현장 사진과 기준가를 그대로 보여드립니다. 아래 탭으로 바로 이동하세요."
      />

      <ProductTabs />

      {PRODUCTS.map((product, index) => (
        <ProductSection
          key={product.id}
          product={product}
          media={getProductMedia(product.folder)}
          index={index}
        />
      ))}

      {/* 출력 라인업 2종 — 보관고 기반 (2026-08-25 신설) */}
      <section className="bg-white">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-24">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Print Lines
          </p>
          <h2 className="text-ink mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl">
            골라서 출력하는 라인업
          </h2>
          <p className="text-ink-soft mt-3 max-w-2xl">
            원하는 작품·지역을 고르면 친환경 직물시트와 타이벡 현수막, 두 소재
            모두로 폭 1,200mm 출력해 드립니다 — 규격 견적으로 바로 이어집니다.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            <Link
              href="/products/art-fabric"
              className="group rounded-2xl border border-line bg-cloud/50 p-6 transition hover:border-teal"
            >
              <p className="text-ink text-lg font-bold group-hover:text-teal-700">
                명화 컬렉션 →
              </p>
              <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                반 고흐·모네·클림트와 한국 민화 — 퍼블릭도메인 명화 132점을
                직물시트·현수막으로 출력해 벽면 갤러리로.
              </p>
            </Link>
            <Link
              href="/products/map-banner"
              className="group rounded-2xl border border-line bg-cloud/50 p-6 transition hover:border-teal"
            >
              <p className="text-ink text-lg font-bold group-hover:text-teal-700">
                국내외 지도 컬렉션 →
              </p>
              <p className="text-ink-soft mt-2 text-sm leading-relaxed">
                2025년판 대한민국 전도·시군 행정지도부터 세계지도·대동여지도까지
                — 직물시트·현수막 어느 쪽으로도.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* 견적·구독으로 잇는 최종 CTA */}
      <section className="bg-cloud">
        <div className="mx-auto max-w-[1200px] px-5 py-20 text-center sm:px-8">
          <h2 className="text-ink text-2xl font-bold sm:text-3xl">
            우리 공간에는 얼마나 들까요?
          </h2>
          <p className="text-ink-soft mx-auto mt-3 max-w-xl">
            설치 장소·규격·수량을 알려주시면 맞춤 견적으로 회신드립니다. 시공 후
            관리까지 원하시면 구독을 함께 살펴보세요.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-arch shadow-teal/20 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              맞춤 견적 받기
            </Link>
            <Link
              href="/subscribe"
              className="hover:bg-teal inline-flex h-12 items-center justify-center rounded-full bg-navy px-6 text-[15px] font-semibold text-white transition"
            >
              구독 알아보기
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
