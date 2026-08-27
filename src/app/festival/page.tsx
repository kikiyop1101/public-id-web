import type { Metadata } from 'next'
import Image from 'next/image'
import Button from '@/components/Button'
import Container from '@/components/Container'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'

// 축제·전시·행사 제안형 랜딩 (2026-08-27 대표 지시)
// - 퍼블릭아이디 단독 제안 페이지(08-27 대표 재확정 — 콜라보 표기·외부 사진 제거, 자사 자산만).
// - 4대 주축 전부: 노면표시재 · 직물시트 · 친환경 현수막 · 홍보판촉물.
// - store.public-id.co.kr 루트가 이 페이지로 rewrite된다(proxy.ts). 정본 주소는 www/festival.
// - 사진은 전부 자사 갤러리(/products/*)·자사 연출 에셋(/work/*)만 쓴다.

export const metadata: Metadata = {
  title: '축제·행사 공간 브랜딩 — 퍼블릭아이디 제안',
  description:
    '축제·전시·행사장의 바닥과 벽이 가장 큰 홍보 공간이 됩니다. 붙였다 떼는 친환경 그래픽 노면표시재(기준가 132,000원/㎡)·직물시트(88,000원/㎡)·친환경 타이벡 현수막·홍보판촉물까지 — 디자인부터 부착 시공·철거까지 퍼블릭아이디가 한 번에 진행합니다.',
  alternates: { canonical: '/festival' },
  openGraph: {
    title: '축제·행사 공간 브랜딩 — 퍼블릭아이디 제안',
    description:
      '행사장 바닥·벽·배너·굿즈까지 친환경 소재 4종으로. 행사가 끝나면 끈적임 없이 철거됩니다.',
    images: [{ url: '/products/친환경그래픽노면표시재/참조16.jpg' }],
  },
}

const breadcrumbJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: '홈', item: 'https://www.public-id.co.kr' },
    {
      '@type': 'ListItem',
      position: 2,
      name: '축제·행사',
      item: 'https://www.public-id.co.kr/festival',
    },
  ],
}

// 4대 주축 제품 — 카피 정본 = src/lib/products.ts · assistant-knowledge.ts
const PRODUCTS = [
  {
    name: '친환경 그래픽 노면표시재',
    where: '바닥·계단·광장',
    img: '/products/친환경그래픽노면표시재/참조17.jpg',
    alt: '행사장 광장 바닥에 부착된 대형 다트 게임 그래픽에서 아이들이 뛰어노는 모습',
    w: 773,
    h: 376,
    points: [
      '인쇄된 알루미늄 박판을 이형지 떼서 붙이는 점착식 바닥 스티커 — 특허받은 제품으로, 페인트 도색이 아닙니다.',
      '미끄럼저항 46BPN(서울시 보도포장 기준 45 이상 충족) — 사람이 몰리는 행사장에서도 안전합니다.',
      '철거 시 끈적임 없음 — 단기 행사 후 원상복구가 됩니다.',
    ],
    price: '기준가 132,000원/㎡',
    priceNote: 'VAT 포함 · 정확한 금액은 견적 문의',
  },
  {
    name: '친환경 그래픽 직물시트',
    where: '벽면·기둥·부스',
    img: '/products/친환경그래픽직물시트/참조16.jpg',
    alt: '경기장 게이트 기둥과 벽면을 감싼 대형 오렌지색 숫자 슈퍼그래픽',
    w: 773,
    h: 523,
    points: [
      '실내외 벽면·기둥·천장에 부착하는 그래픽 직물 시트 — 부스 가벽·게이트·계단실까지 공간 전체를 감쌉니다.',
      '탈부착이 쉬워 행사 기간에만 붙였다 떼기 좋습니다.',
      '기존 안내판·시설물도 감싸서 새것처럼 바꿉니다.',
    ],
    price: '기준가 88,000원/㎡',
    priceNote: 'VAT 포함 · 정확한 금액은 견적 문의',
  },
  {
    name: '친환경 현수막',
    where: '게이트·무대·안내 배너',
    img: '/work/gen-banner.png',
    alt: '종이 질감의 친환경 타이벡 현수막 연출 이미지',
    w: 2336,
    h: 1744,
    caption: '연출 이미지',
    points: [
      '종이 질감의 친환경 타이벡 소재 현수막 — 행사 게이트·무대·안내 배너에 씁니다.',
      '폭 1,200mm로 원하는 디자인을 출력합니다.',
      '행사 브랜딩을 바닥·벽 그래픽과 같은 디자인 언어로 통일합니다.',
    ],
    price: '견적 문의',
    priceNote: '규격·수량에 따라 안내',
  },
  {
    name: '친환경 홍보판촉물',
    where: '기념품·굿즈',
    img: '/products/친환경홍보판촉물/참조01.jpg',
    alt: '친환경 타이벡 소재 가방과 굿즈가 전시된 부스 테이블',
    w: 773,
    h: 580,
    points: [
      '친환경 소재 기반의 가방·파우치 등 행사 기념품을 기획·제작합니다.',
      '소량·맞춤 제작이 가능해 행사 규모에 맞춥니다.',
      '캠페인 메시지와 연계한 굿즈로 행사가 끝난 뒤에도 홍보가 이어집니다.',
    ],
    price: '견적 문의',
    priceNote: '품목·수량에 따라 안내',
  },
]

// 행사 적용 장면 6종 — 전부 자사 시공 실사
const SCENES = [
  {
    src: '/products/친환경그래픽노면표시재/참조13.jpg',
    title: '바닥 놀이존',
    desc: '광장 바닥에 붙이는 대형 놀이판 — 가족 관람객의 발걸음을 세우고 체류 시간을 늘립니다.',
  },
  {
    src: '/products/친환경그래픽노면표시재/참조33.jpg',
    title: '축제 무대·게이트',
    desc: '무대 앞 바닥 그래픽과 게이트 배너로 행사 아이덴티티를 입구에서부터 보여줍니다.',
  },
  {
    src: '/products/친환경그래픽노면표시재/참조20.jpg',
    title: '관람 동선 안내',
    desc: '전시관·체험존으로 가는 길을 바닥 사인이 안내합니다. 안내 인력을 대신하는 가장 확실한 표지판입니다.',
  },
  {
    src: '/products/친환경그래픽직물시트/참조33.jpg',
    title: '실내 포토존 연출',
    desc: '실내 바닥·벽을 그래픽으로 연출해 줄 서서 찍는 포토존을 만듭니다.',
  },
  {
    src: '/products/친환경그래픽직물시트/참조09.jpg',
    title: '기둥·시설물 랩핑',
    desc: '행사장의 기둥·시설물을 감싸 밋밋한 구조물을 브랜딩 공간으로 바꿉니다.',
  },
  {
    src: '/products/친환경그래픽노면표시재-노란발자국/참조28.jpg',
    title: '대기줄·안전 안내',
    desc: '대기 위치·안전 동선을 바닥에 표시해 혼잡한 행사장의 질서를 만듭니다.',
  },
]

const PROCESS = [
  { step: '상담·견적', desc: '행사명·기간·장소·필요 면적을 알려주시면 규격과 견적을 회신합니다.' },
  { step: '디자인', desc: '행사 아이덴티티에 맞춰 바닥·벽면·배너·굿즈를 한 디자인 언어로 설계합니다.' },
  { step: '제작', desc: '친환경 소재에 인쇄해 부착형 시트와 배너·판촉물로 제작합니다.' },
  { step: '부착 시공', desc: '행사 개장 전 현장에 부착합니다. 페인트 도색이 아니라 공사 소음·냄새가 없습니다.' },
  { step: '행사 후 철거', desc: '끈적임 없이 떼어내 원상복구합니다. 현수막처럼 폐기물 더미가 남지 않습니다.' },
]

export default function FestivalPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      {/* 히어로 — 좌 텍스트 + 우 실사 */}
      <section className="relative overflow-hidden border-b border-line bg-cloud/50">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 right-[-8%] h-[360px] w-[360px] rounded-full bg-arch opacity-[0.10] blur-[90px]"
        />
        <Container className="py-16 sm:py-20 lg:py-24">
          <div className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                Festival &amp; Event
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
                축제의 바닥과 벽이
                <br />
                가장 큰 홍보 공간이 됩니다
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                행사장 바닥·계단·벽면에 붙이는 친환경 그래픽과 타이벡 현수막·굿즈까지 —
                페인트 도색이 아니라 부착식이라 행사가 끝나면 끈적임 없이 철거됩니다.
                디자인부터 제작·부착 시공·철거까지 퍼블릭아이디가 한 번에 진행합니다.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Button href="#apply" variant="arch" size="lg">
                  행사 견적·상담 신청
                </Button>
                <Button href="#scenes" variant="outline" size="lg">
                  적용 장면 먼저 보기
                </Button>
              </div>
              <p className="mt-6 text-sm text-ink-soft">
                축제·전시·박람회·지역행사 대행사와 주최 기관을 위한 제안입니다.
              </p>
            </div>
            <figure>
              <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
                <Image
                  src="/products/친환경그래픽노면표시재/참조16.jpg"
                  alt="광장 바닥에 부착된 연잎 그래픽 위를 아이가 뛰어 건너는 모습"
                  width={3840}
                  height={1867}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-ink-soft">
                실제 시공 사진 — 광장 바닥 놀이 그래픽, 아이들이 먼저 알아봅니다
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* 페인포인트 — 행사 담당자가 겪는 3가지 */}
      <section className="bg-white">
        <Container className="py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.3fr]">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                Why
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                행사 홍보물, 이런 고민
                <br />
                해보셨을 겁니다
              </h2>
            </div>
            <ul className="divide-y divide-line">
              {[
                {
                  t: '현수막·배너는 행사가 끝나면 전부 폐기물이 됩니다',
                  d: '설치비를 들인 홍보물이 며칠 뒤 쓰레기가 되고, 처리 비용과 환경 부담까지 남습니다.',
                },
                {
                  t: '바닥에 뭔가 하고 싶어도 도색은 부담스럽습니다',
                  d: '페인트 도색은 원상복구가 어려워 장소 승인부터 막힙니다. 붙였다 떼는 방식이면 이야기가 달라집니다.',
                },
                {
                  t: '안내 인력을 늘려도 동선은 정리되지 않습니다',
                  d: '관람객의 시선은 손에 든 휴대폰과 바닥을 향합니다. 바닥 사인이 가장 확실한 안내판입니다.',
                },
              ].map((item) => (
                <li key={item.t} className="py-6 first:pt-0 last:pb-0">
                  <h3 className="text-lg font-bold text-ink">{item.t}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-soft">{item.d}</p>
                </li>
              ))}
            </ul>
          </div>
        </Container>
      </section>

      {/* 해법 — 4대 주축 제품 */}
      <section className="bg-cloud/50">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Solution
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            행사에 쓰는 친환경 소재 4종
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            바닥·벽·배너·굿즈까지 한 디자인 언어로 맞춰 행사 전체의 인상을 통일합니다.
            부착형은 행사 일정에 맞춰 붙이고, 끝나면 깔끔하게 떼어냅니다.
          </p>

          {PRODUCTS.map((p, i) => (
            <div
              key={p.name}
              className={`grid items-center gap-10 lg:grid-cols-2 ${i === 0 ? 'mt-12' : 'mt-14'}`}
            >
              <figure className={i % 2 === 1 ? 'lg:order-last' : ''}>
                <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
                  <Image
                    src={p.img}
                    alt={p.alt}
                    width={p.w}
                    height={p.h}
                    className="h-full w-full object-cover"
                  />
                </div>
                {p.caption && (
                  <figcaption className="mt-2 text-xs text-ink-soft">{p.caption}</figcaption>
                )}
              </figure>
              <div>
                <h3 className="text-2xl font-extrabold tracking-tight text-ink">
                  {p.name} <span className="text-teal-700">— {p.where}</span>
                </h3>
                <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                  {p.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
                <p className="mt-5 text-lg font-bold text-ink">
                  <span className="num">{p.price}</span>
                  <span className="ml-2 text-sm font-normal text-ink-soft">{p.priceNote}</span>
                </p>
              </div>
            </div>
          ))}
        </Container>
      </section>

      {/* 적용 장면 6종 */}
      <section id="scenes" className="bg-white">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Scenes
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            행사장에서 이렇게 쓰입니다
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            전부 퍼블릭아이디의 실제 시공 사진입니다. 우리 행사에 맞는 장면을 골라
            문의에 적어주시면 그 기준으로 견적을 드립니다.
          </p>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SCENES.map((scene, i) => (
              <Reveal key={scene.title} delay={(i % 3) * 100}>
                <figure className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
                  <div className="aspect-[4/3] overflow-hidden">
                    <Image
                      src={scene.src}
                      alt={`${scene.title} — ${scene.desc}`}
                      width={800}
                      height={600}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <figcaption className="p-6">
                    <h3 className="text-lg font-bold text-ink">{scene.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-soft">{scene.desc}</p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 진행 순서 */}
      <section className="bg-cloud/50">
        <Container className="py-20 sm:py-28">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div>
              <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                Process
              </p>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
                행사 일정에 맞춰
                <br />
                다섯 단계로 진행합니다
              </h2>
              <ol className="mt-8">
                {PROCESS.map((p, i) => (
                  <li key={p.step} className="relative flex gap-5 pb-8 last:pb-0">
                    {i < PROCESS.length - 1 && (
                      <span
                        aria-hidden
                        className="absolute left-[15px] top-8 h-full w-px bg-line"
                      />
                    )}
                    <span className="num relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-700 text-sm font-bold text-white">
                      {i + 1}
                    </span>
                    <div>
                      <h3 className="text-lg font-bold text-ink">{p.step}</h3>
                      <p className="mt-1 text-[15px] leading-relaxed text-ink-soft">{p.desc}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
            <figure className="self-center">
              <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
                <Image
                  src="/products/친환경그래픽노면표시재-노란발자국/참조10.jpg"
                  alt="보도 바닥에 노란발자국 그래픽을 부착 시공하는 현장"
                  width={773}
                  height={435}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-ink-soft">
                부착 시공 현장 — 붙이는 방식이라 도색 공사가 아닙니다
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* 신뢰 밴드 */}
      <section className="bg-navy">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">
            Why Public ID
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            디자인부터 시공·철거까지
            <br />한 회사가 책임집니다
          </h2>
          <ul className="mt-10 max-w-3xl divide-y divide-white/15">
            {[
              '사회적기업 · KIDP 종합산업디자인전문회사(시각·포장·환경) — 행사 아이덴티티 디자인을 직접 합니다.',
              '특허받은 친환경 그래픽 노면표시재와 직물시트·타이벡 현수막·홍보판촉물까지 소재를 자체 보유합니다.',
              '노란발자국·노란볼라드(2023 굿디자인 선정) 등 전국 공공공간 시공 실적을 보유하고 있습니다.',
            ].map((line) => (
              <li key={line} className="py-5 text-[15px] leading-relaxed text-white/80 first:pt-0 last:pb-0">
                {line}
              </li>
            ))}
          </ul>
          <div className="mt-10">
            <Button href="/credibility" variant="light">
              실적·인증 보기
            </Button>
          </div>
        </Container>
      </section>

      {/* 견적 신청 */}
      <section id="apply" className="bg-white">
        <Container className="py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Contact
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              행사 견적·상담 신청
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              행사명·기간·장소·필요 면적(㎡)을 적어주시면 확인 후 빠르게 회신드립니다.
              전화 상담은{' '}
              <a href="tel:070-4150-1172" className="font-semibold text-teal-700">
                070-4150-1172
              </a>
              로 연락주세요.
            </p>
          </div>
          <div className="mx-auto mt-10 max-w-2xl">
            <LeadForm
              kinds={[{ value: 'festival', label: '축제·행사 견적' }]}
              products={[
                '친환경 그래픽 노면표시재(바닥)',
                '친환경 그래픽 직물시트(벽면·부스)',
                '친환경 현수막(게이트·배너)',
                '친환경 홍보판촉물(굿즈)',
                '패키지(복수 품목)',
              ]}
              messagePlaceholder="예) ○○문화재단 가을 축제 / 10월 10~12일 / 야외 광장 / 포토존·동선 안내·현수막 필요, 약 50㎡"
              submitLabel="견적 요청 보내기"
            />
          </div>
        </Container>
      </section>
    </>
  )
}
