import type { Metadata } from 'next'
import Image from 'next/image'
import Button from '@/components/Button'
import Container from '@/components/Container'
import LeadForm from '@/components/LeadForm'
import Reveal from '@/components/Reveal'

// 축제·전시·행사 제안형 랜딩 (2026-08-27 대표 지시)
// - ㈜퍼블릭아이디 × ㈜아스팔트아트 콜라보 사이트 — 디자인·소재(PI) + 노면 그래픽 시공(AA)
// - store.public-id.co.kr 루트가 이 페이지로 rewrite된다(proxy.ts). 정본 주소는 www/festival.
// - 사진 출처: /festival/* = 아스팔트아트 시공 사례(대표 승인), /products/* = 자사 갤러리.

export const metadata: Metadata = {
  title: '축제·행사 공간 브랜딩 — 퍼블릭아이디 × 아스팔트아트',
  description:
    '축제·전시·행사장의 바닥과 벽이 가장 큰 홍보 공간이 됩니다. 붙였다 떼는 친환경 그래픽 노면표시재(기준가 132,000원/㎡)와 직물시트(88,000원/㎡)로 포토존·동선 안내·계단 아이덴티티를 만들고, 행사가 끝나면 끈적임 없이 철거합니다.',
  alternates: { canonical: '/festival' },
  openGraph: {
    title: '축제·행사 공간 브랜딩 — 퍼블릭아이디 × 아스팔트아트',
    description:
      '행사장 바닥·계단·벽면에 붙이는 친환경 그래픽. 디자인부터 시공·철거까지 한 팀으로 진행합니다.',
    images: [{ url: '/festival/hero-plaza.jpg' }],
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

// 행사 적용 장면 6종 — 실제 시공 사진과 캡션
const SCENES = [
  {
    src: '/festival/scene-festival-stairs.jpg',
    title: '계단 아이덴티티',
    desc: '행사 이름과 키 비주얼을 계단 전면에 부착해, 입구에서부터 축제가 시작됩니다.',
  },
  {
    src: '/festival/scene-photozone.jpg',
    title: '포토존·트릭아트',
    desc: '바닥 트릭아트 한 장이 줄 서서 찍는 포토존이 되고, 사진은 SNS로 퍼집니다.',
  },
  {
    src: '/festival/scene-playzone.jpg',
    title: '바닥 놀이존',
    desc: '광장 바닥에 붙이는 대형 보드게임·놀이판 — 가족 관람객의 체류 시간을 늘립니다.',
  },
  {
    src: '/festival/scene-wayfinding.jpg',
    title: '관람 동선 안내',
    desc: '출입구·매표소·무대·화장실까지, 바닥 사인이 안내 인력을 대신합니다.',
  },
  {
    src: '/festival/scene-course.jpg',
    title: '참여 코스·스탬프 투어',
    desc: '출발점부터 도착점까지 코스를 바닥에 이어 붙여 행사 전체를 하나의 게임으로 만듭니다.',
  },
  {
    src: '/festival/scene-night.jpg',
    title: '테마 연출',
    desc: '어두운 바닥 위 대형 테마 그래픽 — 야간 행사·특별전의 분위기를 바닥부터 만듭니다.',
  },
]

const PROCESS = [
  { step: '상담·견적', desc: '행사명·기간·장소·필요 면적을 알려주시면 규격과 견적을 회신합니다.' },
  { step: '디자인', desc: '행사 아이덴티티에 맞춰 바닥·벽면 그래픽을 디자인합니다.' },
  { step: '제작', desc: '친환경 소재에 인쇄해 부착형 시트로 제작합니다.' },
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
                Public ID × Asphalt Art
              </p>
              <h1 className="mt-4 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl lg:text-[56px]">
                축제의 바닥과 벽이
                <br />
                가장 큰 홍보 공간이 됩니다
              </h1>
              <p className="mt-5 max-w-xl text-lg leading-relaxed text-ink-soft">
                행사장 바닥·계단·벽면에 붙이는 친환경 그래픽 — 페인트 도색이 아니라 부착식이라
                행사가 끝나면 끈적임 없이 철거됩니다. 디자인부터 시공·철거까지
                ㈜퍼블릭아이디와 ㈜아스팔트아트가 한 팀으로 진행합니다.
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
                  src="/festival/hero-plaza.jpg"
                  alt="경기장 광장 바닥에 부착된 컬러 관람 동선 안내 그래픽"
                  width={1920}
                  height={1081}
                  priority
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-ink-soft">
                실제 시공 사진 — 경기장 광장의 관람 동선 안내 그래픽
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

      {/* 해법 — 제품 2종 */}
      <section className="bg-cloud/50">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Solution
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            붙였다 떼는 친환경 그래픽 2종
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
            두 제품 모두 부착식이라 행사 일정에 맞춰 붙이고, 끝나면 깔끔하게 떼어냅니다.
          </p>

          <div className="mt-12 grid items-center gap-10 lg:grid-cols-2">
            <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
              <Image
                src="/products/친환경그래픽노면표시재/참조17.jpg"
                alt="행사장 광장 바닥에 부착된 대형 다트 게임 그래픽에서 아이들이 뛰어노는 모습"
                width={773}
                height={376}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h3 className="text-2xl font-extrabold tracking-tight text-ink">
                친환경 그래픽 노면표시재{' '}
                <span className="text-teal-700">— 바닥·계단·광장</span>
              </h3>
              <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                <li>
                  인쇄된 알루미늄 박판을 이형지 떼서 붙이는 점착식 바닥 스티커
                  — 특허받은 제품으로, 페인트 도색이 아닙니다.
                </li>
                <li>
                  미끄럼저항 46BPN(서울시 보도포장 기준 45 이상 충족) — 사람이 몰리는
                  행사장에서도 안전합니다.
                </li>
                <li>철거 시 끈적임 없음 — 단기 행사 후 원상복구가 됩니다.</li>
              </ul>
              <p className="mt-5 text-lg font-bold text-ink">
                기준가 <span className="num">132,000원</span>/㎡
                <span className="ml-2 text-sm font-normal text-ink-soft">
                  VAT 포함 · 정확한 금액은 견적 문의
                </span>
              </p>
            </div>
          </div>

          <div className="mt-14 grid items-center gap-10 lg:grid-cols-2">
            <div className="order-last lg:order-first">
              <h3 className="text-2xl font-extrabold tracking-tight text-ink">
                친환경 그래픽 직물시트{' '}
                <span className="text-teal-700">— 벽면·부스·실내</span>
              </h3>
              <ul className="mt-5 space-y-3 text-[15px] leading-relaxed text-ink-soft">
                <li>실내외 안내·홍보용 직물 시트 — 부스 가벽, 벽면 그래픽, 실내 연출에 씁니다.</li>
                <li>천 소재 특유의 질감으로 인쇄물보다 고급스러운 마감이 나옵니다.</li>
                <li>바닥 그래픽과 같은 디자인 언어로 맞춰 행사 전체의 인상을 통일합니다.</li>
              </ul>
              <p className="mt-5 text-lg font-bold text-ink">
                기준가 <span className="num">88,000원</span>/㎡
                <span className="ml-2 text-sm font-normal text-ink-soft">
                  VAT 포함 · 정확한 금액은 견적 문의
                </span>
              </p>
            </div>
            <div className="overflow-hidden rounded-3xl border border-line shadow-sm">
              <Image
                src="/products/친환경그래픽직물시트/참조33.jpg"
                alt="실내 공간 바닥에 조경과 함께 연출된 그래픽 포토존"
                width={771}
                height={434}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
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
            전부 실제 시공 사진입니다. 우리 행사에 맞는 장면을 골라 문의에 적어주시면
            그 기준으로 견적을 드립니다.
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
                  src="/festival/process-install.jpg"
                  alt="광장 바닥에 캐릭터 그래픽을 부착 시공하는 현장"
                  width={1200}
                  height={900}
                  className="h-full w-full object-cover"
                />
              </div>
              <figcaption className="mt-3 text-xs text-ink-soft">
                부착 시공 현장 — 전용 장비로 붙이는 방식이라 도색 공사가 아닙니다
              </figcaption>
            </figure>
          </div>
        </Container>
      </section>

      {/* 콜라보 신뢰 밴드 */}
      <section className="bg-navy">
        <Container className="py-20 sm:py-28">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">
            Collaboration
          </p>
          <h2 className="mt-4 max-w-3xl text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            디자인하는 회사와 시공하는 회사가
            <br />한 팀으로 움직입니다
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2">
            <div className="rounded-3xl border border-white/15 p-7 sm:p-9">
              <h3 className="text-xl font-bold text-white">㈜퍼블릭아이디</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                사회적기업 · 산업디자인전문회사(종합). 특허받은 친환경 그래픽 노면표시재와
                직물시트를 만들고, 행사 아이덴티티에 맞는 디자인을 책임집니다.
              </p>
            </div>
            <div className="rounded-3xl border border-white/15 p-7 sm:p-9">
              <h3 className="text-xl font-bold text-white">㈜아스팔트아트</h3>
              <p className="mt-3 text-[15px] leading-relaxed text-white/70">
                노면 그래픽 전문 시공 기업. 광장·도로·경기장·문화공간까지 전국의 바닥 시공
                사례를 보유하고 있으며, 부착부터 철거까지 현장 시공을 책임집니다.
              </p>
            </div>
          </div>
          <div className="mt-10">
            <Button href="/credibility" variant="light">
              퍼블릭아이디 실적·인증 보기
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
                '바닥+벽면 패키지',
              ]}
              messagePlaceholder="예) ○○문화재단 가을 축제 / 10월 10~12일 / 야외 광장 / 포토존·동선 안내 필요, 약 50㎡"
              submitLabel="견적 요청 보내기"
            />
          </div>
        </Container>
      </section>
    </>
  )
}
