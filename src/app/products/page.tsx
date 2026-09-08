import type { Metadata } from 'next'
import { pageMeta } from '@/lib/seo'
import Link from 'next/link'
import { PRODUCTS } from '@/lib/products'
import { getProductMedia } from '@/lib/product-media'
import ProductTabs from '@/components/ProductTabs'
import ProductSection from '@/components/ProductSection'
import PageHero from '@/components/PageHero'
import FaqBlock, { type FaqItem } from '@/components/FaqBlock'

// 제품 FAQ (2026-09-08 AEO 감사) — 답변엔진이 "가격·설치·차이" 질문에 우리 페이지를 인용하도록.
// 사실 정본 = src/lib/assistant-knowledge.ts(기준가·시공 조건·인증). 협력·제조 기관은 일반화, 가격은 "기준가".
const PRODUCT_FAQ: FaqItem[] = [
  {
    q: '친환경 그래픽 노면표시재는 페인트 도색과 무엇이 다른가요?',
    a: '도료를 칠하는 방식이 아니라, 친환경 라텍스 잉크로 인쇄한 알루미늄 박판을 이형지를 떼고 노면에 붙이는 점착식 스티커입니다(특허받은 제품). 시공이 빠르고, 철거 후 바닥에 끈적임이 남지 않으며, 미끄럼저항 46BPN으로 서울시 보도포장 기준(45 이상)을 충족합니다. GREENGUARD GOLD(UL 2818) 친환경 인증 제품입니다.',
  },
  {
    q: '노면표시재 가격은 얼마인가요?',
    a: '친환경 그래픽 노면표시재는 기준가 132,000원/㎡(VAT 포함), 친환경 그래픽 직물시트는 88,000원/㎡입니다. 노란발자국은 전면형 60만 원~, 우측면형 40만 원~, 아이타존(승하차 안전구역)은 150만 원~부터입니다. 수량·규격·현장 조건에 따라 달라지므로 정확한 금액은 맞춤 견적으로 안내해 드립니다.',
  },
  {
    q: '노란발자국은 어디에 설치하는 표시인가요?',
    a: '차도가 아니라 인도(보도) 위, 횡단보도 앞 대기 공간에 붙이는 어린이 보행안전 표시입니다. 아이들이 발자국 위에 서서 신호를 기다리도록 유도해 차도 진입을 막습니다. 상표등록(제40-1257164호) 제품이며, 어린이보호구역·통학로·유치원 앞에 주로 설치됩니다.',
  },
  {
    q: '직접 부착할 수 있나요? 시공 조건은 무엇인가요?',
    a: '기본 4단계(위치 선정 → 부착면 청소 → 이형지를 떼고 부착 → 고무망치로 가장자리부터 두드려 밀착)로 셀프 부착이 가능합니다. 노면이 완전히 마르고 대기·노면 온도가 10℃ 이상이어야 하며, 아스팔트·콘크리트·보도블록에 붙습니다(흙·자갈·탄성포장 불가). 공용도로는 인허가가 필요하고, 혹한기·대면적·차도 시공은 전문 시공팀이 실측부터 진행합니다.',
  },
  {
    q: '시공 후 얼마나 오래 가나요? 관리도 해 주나요?',
    a: '보행은 압착 직후 가능하고 차량 통행은 24~48시간 후를 권장합니다. 내구성은 현장 조건에 따라 6개월에서 1년 이상이며, 안전시설관리 구독을 이용하면 시공 후 1년 동안 정기 점검·보수까지 책임지고 관리합니다. 설치 위치와 관리 이력은 안전관리 지도에서 확인할 수 있습니다.',
  },
  {
    q: '공공기관·학교도 구매할 수 있나요?',
    a: '네. 퍼블릭아이디는 인증 사회적기업(제2020-227호)으로 「사회적기업 육성법」 제12조에 따른 공공기관 우선구매 대상이며, 주력 3종(노면표시재·직물시트·홍보판촉물) 모두 직접생산확인을 보유하고 있습니다. 지자체·교육청·공공기관 납품과 시공 실적은 실적 페이지에서 확인하실 수 있습니다.',
  },
]

export const metadata: Metadata = pageMeta({
  title: '제품 5종 — 친환경 노면표시재·노란발자국·직물시트·노란볼라드·홍보판촉물',
  description:
    '특허받은 부착식 노면표시재(기준가 132,000원/㎡)부터 노란발자국·직물시트(88,000원/㎡)·노란볼라드·홍보판촉물까지 — 현장 사진과 기준가를 그대로 공개하는 퍼블릭아이디 친환경 제품군.',
  path: '/products',
})

// 공개 기준가(VAT 포함, 정본=assistant-knowledge.ts) — 있는 제품만 Offer 기재
const BASE_PRICES: Partial<Record<string, string>> = {
  roadmark: '132000',
  fabric: '88000',
}

// Product 필수 필드 image — 각 제품 폴더의 첫 갤러리 사진(2차 감사 N-H1)
function productImage(folder: string): string | null {
  const media = getProductMedia(folder)
  const first = media.gallery.find((g) => g.kind === 'image')
  return first ? `https://www.public-id.co.kr${first.src}` : null
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
      ...(productImage(p.folder) ? { image: productImage(p.folder) } : {}),
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
            다섯 가지 제품
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

      <FaqBlock
        title="제품에 대해 자주 묻는 질문"
        intro="가격·설치 조건·차이점처럼 문의 전에 가장 많이 확인하시는 내용을 모았습니다."
        items={PRODUCT_FAQ}
        className="bg-white border-t border-line"
      />

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
