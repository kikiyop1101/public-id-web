import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import PageHero from '@/components/PageHero'
import Container from '@/components/Container'
import artworks from '@/data/artworks.json'

export const metadata: Metadata = {
  title: '직물시트 명화 라인 — 반 고흐·모네·민화를 벽면에',
  description:
    '퍼블릭도메인 명화 132점을 친환경 직물시트에 폭 1,200mm로 출력합니다. 반 고흐·모네·르누아르·클림트와 한국 민화 — 광고물 부착방지 시트의 기술로 벽면을 갤러리로.',
  alternates: { canonical: '/products/art-fabric' },
}

type Artwork = (typeof artworks)[number]

const A_GRADE = artworks.filter((a) => a.grade === 'A')
const MINHWA = artworks.filter((a) => a.grade === '민화')
const COLLECTION = artworks.filter((a) => a.grade === 'B' || a.grade === 'B-')

function ArtCard({ art, compact = false }: { art: Artwork; compact?: boolean }) {
  return (
    <figure className="group overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
      <div
        className="relative w-full overflow-hidden bg-cloud"
        style={{ aspectRatio: `${art.w} / ${art.h}` }}
      >
        <Image
          src={art.thumb}
          alt={`${art.artist ? art.artist + ' — ' : ''}${art.title}`}
          fill
          sizes={compact ? '(max-width: 640px) 50vw, 220px' : '(max-width: 640px) 100vw, 380px'}
          className="object-cover transition duration-300 group-hover:scale-[1.02]"
        />
      </div>
      <figcaption className={compact ? 'p-3' : 'p-4'}>
        <p className={`font-semibold text-ink ${compact ? 'text-sm' : ''}`}>{art.title}</p>
        <p className="mt-0.5 text-sm text-ink-soft">
          {art.artist}
          {art.year ? ` · ${art.year}` : ''}
        </p>
        {!compact && (
          <p className="mt-1 text-xs text-ink-soft/70">{art.institution}</p>
        )}
      </figcaption>
    </figure>
  )
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'CollectionPage',
  name: '직물시트 명화 라인',
  url: 'https://www.public-id.co.kr/products/art-fabric',
  description:
    '퍼블릭도메인 명화를 친환경 직물시트에 폭 1,200mm로 출력하는 벽면 아트 라인.',
  about: {
    '@type': 'Product',
    name: '친환경 직물시트 명화 출력',
    brand: { '@type': 'Brand', name: '퍼블릭아이디' },
    offers: {
      '@type': 'Offer',
      url: 'https://www.public-id.co.kr/quote',
      priceCurrency: 'KRW',
      price: '88000',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '88000',
        priceCurrency: 'KRW',
        unitText: '㎡',
      },
      availability: 'https://schema.org/InStock',
      seller: { '@id': 'https://www.public-id.co.kr/#organization' },
    },
  },
  mainEntity: {
    '@type': 'ItemList',
    numberOfItems: artworks.length,
    itemListElement: A_GRADE.slice(0, 12).map((a, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `${a.artist ? a.artist + ' — ' : ''}${a.title}`,
    })),
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.public-id.co.kr' },
    { '@type': 'ListItem', position: 2, name: '제품', item: 'https://www.public-id.co.kr/products' },
    { '@type': 'ListItem', position: 3, name: '직물시트 명화 라인', item: 'https://www.public-id.co.kr/products/art-fabric' },
  ],
}

export default function ArtFabricPage() {
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
        eyebrow="Fabric Art Print"
        title={
          <>
            벽면을 갤러리로,
            <br />
            직물시트 명화 라인
          </>
        }
        description="반 고흐·모네·르누아르·클림트, 그리고 한국 민화까지 — 저작권이 소멸된 퍼블릭도메인 원화 132점을 친환경 직물시트에 출력해 벽면에 부착합니다. 사무실·복도·상가·병원, 못질 없이 붙이는 갤러리."
      />

      {/* 스펙 밴드 */}
      <section className="border-b border-line bg-white">
        <Container className="grid grid-cols-2 gap-6 py-10 sm:grid-cols-4">
          {[
            ['출력 폭', '1,200mm 통일'],
            ['길이', '롤 단위 · 제한 없음'],
            ['소재', '친환경 직물시트 (라텍스 잉크)'],
            ['원본', '미술관 오픈액세스 고해상도'],
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

      {/* 대표작 A 컬렉션 */}
      <section className="bg-paper">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Signature 20
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            대표 명화 20점
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            메트로폴리탄미술관·워싱턴 내셔널갤러리 오픈액세스 원본 중 해상도와
            인지도를 기준으로 고른 대표작입니다.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {A_GRADE.map((a) => (
              <ArtCard key={a.id} art={a} />
            ))}
          </div>
        </Container>
      </section>

      {/* 민화 */}
      <section className="bg-white">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Korean Minhwa
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            한국 민화 20점
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            국립중앙박물관 소장 민화 원본 — 관공서·전통 공간·한식 상가에 어울리는
            우리 그림입니다. 공공누리 제1유형 출처 표기와 함께 제작합니다.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
            {MINHWA.map((a) => (
              <ArtCard key={a.id} art={a} />
            ))}
          </div>
        </Container>
      </section>

      {/* 전체 컬렉션 */}
      <section className="bg-paper">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Full Collection
          </p>
          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            컬렉션 {COLLECTION.length}점
          </h2>
          <p className="mt-3 max-w-2xl text-ink-soft">
            시슬레·피사로·세잔·터너 — 풍경·정물·인상주의 중심의 확장 컬렉션입니다.
            공간 분위기를 알려주시면 어울리는 그림을 함께 골라 드립니다.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 sm:grid-cols-4 lg:grid-cols-6">
            {COLLECTION.map((a) => (
              <ArtCard key={a.id} art={a} compact />
            ))}
          </div>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-navy text-white">
        <Container className="py-20 text-center sm:py-24">
          <h2 className="text-2xl font-bold sm:text-3xl">
            이 그림, 우리 벽면에는 얼마일까요?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-white/70">
            작품 번호(또는 화가 이름)와 벽면 폭·높이를 알려주시면 규격 견적으로
            회신드립니다. 시공과 사후 관리까지 함께합니다.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              href="/quote"
              className="bg-arch inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-0.5 hover:brightness-105"
            >
              견적 문의하기
            </Link>
            <Link
              href="/products/map-banner"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/30 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              지도 현수막 라인 보기
            </Link>
          </div>
          <p className="mt-8 text-xs text-white/50">
            수록 원화는 전부 저작권 보호기간이 만료된 퍼블릭도메인(CC0·오픈액세스)
            작품입니다. 소장 기관 표기: 메트로폴리탄미술관 · 워싱턴
            내셔널갤러리 · 클리블랜드미술관 · 국립중앙박물관 외.
          </p>
        </Container>
      </section>
    </>
  )
}
