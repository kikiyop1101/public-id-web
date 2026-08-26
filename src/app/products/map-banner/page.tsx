import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import maps from '@/data/maps.json'

export const metadata: Metadata = {
  title: '친환경 현수막 지도 라인 — 전도·시도·시군 행정지도 출력',
  description:
    '국토지리정보원 2025년판 대한민국 전도부터 우리 동네 시·군 행정지도까지 182종을 친환경 타이벡 현수막·직물시트에 폭 1,200mm로 출력합니다. 관공서 상황실·학교·사무실 벽면 지도.',
  alternates: { canonical: '/products/map-banner' },
}

type MapItem = (typeof maps)[number]

const KOREA = maps.filter((m) => m.type === 'korea' || m.type === 'vicinity')
const WORLD = maps.filter((m) => m.type === 'world')
const OLD = maps.filter((m) => m.type === 'old')
const SIDO = maps.filter((m) => m.type === 'region-sido' || m.type === 'region-all')
const SIGUN = maps.filter((m) => m.type === 'region-sigun')

function MapCard({ item, compact = false }: { item: MapItem; compact?: boolean }) {
  return (
    <figure className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div
        className="relative w-full overflow-hidden bg-cloud"
        style={{ aspectRatio: `${item.w} / ${item.h}` }}
      >
        <Image
          src={item.thumb}
          alt={item.title}
          fill
          sizes={compact ? '(max-width: 640px) 50vw, 200px' : '(max-width: 640px) 100vw, 360px'}
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
        {item.vector && !compact && (
          <span className="absolute left-3 top-3 rounded-full bg-teal-700 px-2.5 py-1 text-[11px] font-semibold text-white">
            벡터 원본 · 해상도 무제한
          </span>
        )}
      </div>
      <figcaption className={compact ? 'p-3' : 'p-4'}>
        <p className={`font-semibold text-ink ${compact ? 'text-sm' : ''}`}>{item.title}</p>
        {!compact && (
          <p className="mt-0.5 text-sm text-ink-soft">
            {item.institution}
            {item.year ? ` · ${item.year}년판` : ''}
          </p>
        )}
      </figcaption>
    </figure>
  )
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '친환경 현수막 지도 라인',
  url: 'https://www.public-id.co.kr/products/map-banner',
  description:
    '대한민국 전도·시도·시군 행정지도를 친환경 타이벡 현수막·직물시트에 폭 1,200mm로 출력하는 벽면 지도 라인.',
  about: {
    '@type': 'Product',
    name: '친환경 현수막 지도 출력',
    brand: { '@type': 'Brand', name: '퍼블릭아이디' },
    offers: {
      '@type': 'Offer',
      url: 'https://www.public-id.co.kr/quote',
      priceCurrency: 'KRW',
      availability: 'https://schema.org/InStock',
      seller: { '@id': 'https://www.public-id.co.kr/#organization' },
    },
  },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: maps.length,
    itemListElement: [...KOREA, ...SIDO].slice(0, 12).map((m, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: m.title,
    })),
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.public-id.co.kr' },
    { '@type': 'ListItem', position: 2, name: '제품', item: 'https://www.public-id.co.kr/products' },
    { '@type': 'ListItem', position: 3, name: '친환경 현수막 지도 라인', item: 'https://www.public-id.co.kr/products/map-banner' },
  ],
}

export default function MapBannerPage() {
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
      <PageHero
        eyebrow="Eco Map Banner"
        title={
          <>
            우리 동네까지 담는,
            <br />
            친환경 현수막 지도 라인
          </>
        }
        description="국토지리정보원 2025년 최신판 대한민국 전도부터 시·도 17종, 시·군 152종 행정지도까지 — 친환경 타이벡 현수막과 직물시트에 폭 1,200mm로 출력합니다. 상황실·민원실·학교·사무실 벽면에 못질 없이 부착하는 지도."
      />

      {/* 스펙 밴드 */}
      <section className="border-b border-line bg-white">
        <Container className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {[
            ['출력 폭', '1,200mm 통일'],
            ['소재', '듀폰 타이벡 현수막 · 직물시트'],
            ['판형', '최신 2025년판 · 벡터 원본 보유'],
            ['범위', '전도 · 시도 17 · 시군 152'],
          ].map(([k, v]) => (
            <div key={k}>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                {k}
              </p>
              <p className="mt-1 font-semibold text-ink">{v}</p>
            </div>
          ))}
        </Container>
      </section>

      {/* 대한민국 전도·주변도 */}
      <section className="bg-paper">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Korea
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            대한민국 전도 · 주변도
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            국토지리정보원 2025년판 공식 지도(공공누리 제1유형·출처 표기)를 벡터
            원본으로 보유해 어떤 크기로도 선명하게 출력합니다. 한글판·영문판 모두
            가능합니다.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-3">
            {KOREA.map((m) => (
              <MapCard key={m.id} item={m} />
            ))}
          </div>
        </Container>
      </section>

      {/* 시·도 행정지도 */}
      <section className="bg-white">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Province
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            시·도 행정지도 {SIDO.length}종
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            관할 구역 전체가 한눈에 — 시·군 경계와 지명을 담은 광역 행정지도입니다.
            지자체 상황실·의회·교육청 벽면에 바로 걸 수 있습니다.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {SIDO.map((m) => (
              <MapCard key={m.id} item={m} compact />
            ))}
          </div>
        </Container>
      </section>

      {/* 시·군 행정지도 */}
      <section className="bg-paper">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            City &amp; County
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            시·군 행정지도 {SIGUN.length}종
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            우리 동네 읍·면·동 경계까지 담은 기초자치단체 지도 — 전국 어느 시·군이든
            찾으시는 지역이 있습니다.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {SIGUN.map((m) => (
              <MapCard key={m.id} item={m} compact />
            ))}
          </div>
        </Container>
      </section>

      {/* 세계지도·고지도 */}
      <section className="bg-white">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            World &amp; Historic
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            세계지도 · 대동여지도
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            음영기복 세계지도(한글 국가명 자체 제작)와 1864년 목판본 대동여지도 —
            교실·복도·라운지의 큰 벽을 채우는 그림 같은 지도입니다.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-3">
            {[...WORLD, ...OLD].map((m) => (
              <MapCard key={m.id} item={m} />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <Container className="py-20 text-center sm:py-24">
          <h2 className="text-2xl font-bold sm:text-3xl">
            우리 기관 벽면 크기만 알려주세요
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            지역 이름과 벽면 폭·높이를 알려주시면 규격에 맞춘 견적으로 회신드립니다.
            게시 위치에 맞는 소재(현수막·직물시트)도 함께 제안합니다.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-arch inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              견적 문의하기
            </Link>
            <Link
              href="/products/art-fabric"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              명화 라인 보기
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/50">
            국토지리정보원 지도는 공공누리 제1유형(출처 표시) 조건으로 제작하며,
            행정지도는 국토지리정보원 공개 데이터를 바탕으로 퍼블릭아이디가 직접
            렌더링한 판본입니다.
          </p>
        </Container>
      </section>
    </>
  )
}
