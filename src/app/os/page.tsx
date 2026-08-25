import type { Metadata } from 'next'
import Link from 'next/link'
import { KITS, KIT_GROUPS, LATPEED_STORE_URL, formatPrice } from '@/lib/os-kits'
import OsCurator from '@/components/OsCurator'

export const metadata: Metadata = {
  title: '우리회사OS — AI를 직원처럼 쓰는 회사 자동화 키트 21종',
  description:
    '견적서·홍보 글·문의 답변·월말 마감을 AI에 맡기는 실행 키트 20종과 0원 무료 점검. 더블클릭으로 실행하고, 결과물에는 우리 회사 이름이 들어갑니다. 무료 진단으로 우선순위부터 확인하세요.',
  alternates: { canonical: '/os' },
  openGraph: {
    title: '우리회사OS — 회사 자동화 키트 21종',
    description:
      '뭘 AI에 맡길지 3분 무료 진단부터. 반복 업무를 덜어 주는 실행 키트 20종.',
    url: '/os',
  },
}

const FAQ = [
  {
    q: '프로그램을 설치해야 하나요?',
    a: '아니요. 내려받아 더블클릭하면 창이 열립니다. 설치 프로그램도, 개발 지식도 필요 없습니다.',
  },
  {
    q: 'AI 구독료가 따로 드나요?',
    a: '키트 안에서 쓰는 AI는 대표님이 쓰시는 구독(ChatGPT·Claude 등)을 그대로 씁니다. 키트 값에 AI 구독료는 포함되지 않습니다.',
  },
  {
    q: '결과물에 퍼블릭아이디 이름이 박히나요?',
    a: '아니요. 처음 실행할 때 회사 이름을 넣으면 창 제목과 산출물에 그 이름이 들어갑니다(화이트라벨).',
  },
  {
    q: '어떤 걸 먼저 사야 할지 모르겠습니다.',
    a: '페이지 위의 AI 큐레이터에 회사와 고민을 한 줄 적으면 맞는 키트 2~3개를 골라 드립니다. 더 꼼꼼히 보려면 3분 무료 진단으로 업무 5개 영역을 점검해 보세요.',
  },
]

export default function OsPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: '우리회사OS 시리즈',
    numberOfItems: KITS.length,
    itemListElement: KITS.map((k, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: `우리회사OS ${k.no}${k.name}`,
      description: k.tagline,
      url: k.url,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 히어로 */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
          Ourcompany OS
        </p>
        <h1 className="text-ink mt-4 max-w-[20ch] text-3xl font-extrabold leading-[1.12] tracking-[-0.025em] sm:text-5xl">
          AI를 직원처럼 쓰는 회사 자동화 템플릿
        </h1>
        <p className="text-ink-soft mt-5 max-w-[42em] text-lg leading-relaxed">
          견적서 한 장에 한 시간, 홍보 글은 늘 다음으로, 월말 정산은 며칠씩 — 사람을 더
          뽑기도, 대행을 맡기기도 애매한 일들입니다. 우리회사OS는 그 반복 업무를 AI에
          넘기는 <strong className="text-ink font-semibold">실행 키트 20종</strong>입니다.
          내려받아 더블클릭하면 바로 쓰고, 결과물에는 우리 회사 이름이 들어갑니다.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-3">
          <Link
            href="/scan"
            className="bg-arch inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
          >
            3분 무료 진단부터 하기
          </Link>
          <a
            href={LATPEED_STORE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="border-line text-ink inline-flex h-14 items-center justify-center rounded-full border px-7 text-[15px] font-semibold transition"
          >
            바로 구매하기
          </a>
        </div>
        <p className="text-ink-soft mt-4 text-sm">
          전 상품 부가세 포함 표기 · 런칭가는 초기 10명 한정 · 구매는 래피드에서
        </p>

        <OsCurator />
      </section>

      {/* 왜 만들었나 */}
      <section className="border-line border-y bg-cloud">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
            Why
          </p>
          <h2 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
            우리가 쓰려고 만들었고, 그대로 팝니다
          </h2>
          <p className="text-ink-soft mt-5 max-w-[42em] text-lg leading-relaxed">
            퍼블릭아이디는 직원 몇 명이 B2G 입찰부터 시공·콘텐츠 발행까지 굴리는
            회사입니다. 사람을 늘리는 대신 반복 업무를 하나씩 AI에 넘겼고, 그때 만든
            도구를 다듬어 키트로 냅니다. 만들어 본 적 없는 기능을 그럴듯하게 적어 팔지
            않습니다 — 여기 있는 것은 전부 우리가 매일 돌리는 것들입니다.
          </p>
        </div>
      </section>

      {/* 키트 목록 */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
          Kits
        </p>
        <h2 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
          지금 있는 키트 {KITS.length}종
        </h2>
        <p className="text-ink-soft mt-5 max-w-[42em]">
          하나씩 따로 삽니다. 0원 무료 점검까지 더하면 모두 21종이고, 어디부터 손댈지
          모르겠다면 ①진단부터 보세요.
        </p>

        {KIT_GROUPS.map((g) => {
          const items = KITS.filter((k) => k.group === g.key)
          if (items.length === 0) return null
          return (
            <div key={g.key} className="mt-12">
              <h3 className="text-ink text-lg font-bold">
                {g.title}
                <span className="text-ink-soft ml-3 text-sm font-normal">{g.desc}</span>
              </h3>
              <ul className="mt-5">
                {items.map((k) => (
                  <li key={k.no + k.name} className="border-line/70 border-b">
                    <a
                      href={k.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4 transition hover:opacity-75"
                    >
                      <span className="text-ink text-base font-bold">
                        <span className="text-teal-700">{k.no}</span>
                        {k.name}
                      </span>
                      <span className="text-ink-soft min-w-0 flex-1 text-sm">
                        {k.tagline}
                      </span>
                      <span className="text-ink shrink-0 text-sm font-bold">
                        {formatPrice(k.price)}원
                        <span className="text-ink-soft ml-2 text-xs font-normal line-through">
                          {formatPrice(k.listPrice)}원
                        </span>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      {/* 어떻게 쓰나 */}
      <section className="border-line border-y bg-cloud">
        <div className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
          <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
            How
          </p>
          <h2 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
            사고 나면 이렇게 씁니다
          </h2>
          <ol className="mt-10 space-y-6">
            {[
              ['내려받기', '구매하면 파일을 바로 받습니다. 설치 프로그램은 없습니다.'],
              ['회사 이름 넣기', '처음 한 번만. 이후 창 제목과 산출물에 그 이름이 들어갑니다.'],
              ['더블클릭', '창이 열리면 빈칸을 채우고 버튼을 누릅니다. 결과물이 파일로 나옵니다.'],
            ].map(([t, d], i) => (
              <li key={t} className="flex gap-4">
                <span className="bg-teal-700 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white">
                  {i + 1}
                </span>
                <div>
                  <p className="text-ink text-base font-bold">{t}</p>
                  <p className="text-ink-soft mt-1 text-sm">{d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20">
        <p className="font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]">
          FAQ
        </p>
        <h2 className="text-ink mt-4 text-2xl font-extrabold tracking-[-0.025em] sm:text-3xl">
          자주 묻는 것
        </h2>
        <dl className="mt-10 space-y-6">
          {FAQ.map((f) => (
            <div key={f.q} className="border-line/70 border-b pb-6">
              <dt className="text-ink text-base font-bold">{f.q}</dt>
              <dd className="text-ink-soft mt-2 text-sm leading-relaxed">{f.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* 최종 CTA */}
      <section className="bg-navy">
        <div className="mx-auto max-w-[1200px] px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-white sm:text-3xl">
            어디부터 바꿀지, 3분이면 답이 나옵니다
          </h2>
          <p className="mx-auto mt-5 max-w-[38em] text-base leading-relaxed text-white/75">
            15문항 무료 진단으로 우리 회사 업무 5개 영역을 점검하고, AI에 맡기면 좋은
            우선순위 TOP3와 주당 절감 시간을 확인하세요. 로그인도, 정보 입력도 없습니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/scan"
              className="bg-arch inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
            >
              무료 진단 시작하기
            </Link>
            <a
              href={LATPEED_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-[15px] font-semibold text-white transition hover:bg-white/20"
            >
              키트 전체 보기
            </a>
          </div>
        </div>
      </section>
    </>
  )
}
