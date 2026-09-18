import type { Metadata } from 'next'
import Image from 'next/image'
import { pageMeta } from '@/lib/seo'
import {
  KITS,
  KIT_GROUPS,
  LATPEED_MEMBERSHIP_URL,
  LATPEED_REVIEWERS_URL,
  ALL_IN_ONE,
  ALL_IN_ONE_MEMBERS,
  formatPrice,
  priceLabel,
} from '@/lib/os-kits'
import OsCurator from '@/components/OsCurator'
import KitLink from '@/components/KitLink'
import ScanClient from '@/components/ScanClient'
import OsWhyTabs from '@/components/OsWhyTabs'
import BreadcrumbLd from '@/components/BreadcrumbLd'

export const metadata: Metadata = pageMeta({
  title: '우리회사OS — AI를 직원처럼 쓰는 회사 자동화 키트 38종',
  description:
    '견적서·홍보 글·문의 답변·월말 마감을 AI에 맡기는 실행 키트 38종. 3분 웹 진단 뒤 ①진단 킷은 0원으로 받고, 미니 9,900원·실행 킷 49,000원부터 필요한 것만 삽니다. 더블클릭으로 실행하고, 결과물에는 우리 회사 이름이 들어갑니다.',
  path: '/os',
  ogTitle: '우리회사OS — 회사 자동화 키트 38종 | 퍼블릭아이디',
  ogDescription: '3분 웹 진단 → 무료 ①진단 킷부터. 반복 업무를 덜어 주는 실행 키트 38종.',
})

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
    a: '페이지 위의 AI 큐레이터에 회사와 고민을 한 줄 적으면 맞는 키트 2~3개를 골라 드립니다. 더 꼼꼼히 보려면 3분 웹 진단으로 업무 5개 영역을 점검한 뒤, 0원인 ①진단 킷으로 우리 회사 이름이 들어간 우선순위 리포트를 받아 보세요.',
  },
  {
    q: '①진단은 정말 무료인가요?',
    a: '네, ①진단 킷은 0원입니다. 이 페이지의 3분 웹 진단으로 방향을 먼저 보고, 래피드에서 0원으로 ①진단 킷을 받아 업무 데이터를 넣으면 실행 순서 리포트가 나옵니다. 따로 있던 무료 점검 상품은 ①진단으로 합쳐졌습니다.',
  },
  {
    q: '후기단은 어떻게 신청하나요?',
    a: "하단 '후기단 신청하기'에서 0원으로 결제하면 실행 키트 8종(견적 3안·수금독촉·리뷰답글 + 미니 5종) zip을 바로 받습니다. 1주 안에 래피드 상품 페이지에 후기 한 줄을 남겨 주시면 됩니다. 5명 한정입니다.",
  },
]

// 페이지 구성(2026-09-17 대표 지시 — hyperez Skein OS 정보 구조를 PI 디자인시스템으로):
// 히어로 → 정의 → 왜(탭) → 비교 3열 + 핵심 설계 → 3층 구조(기록·실행·자율) → 업종별 구성 → 도입 단계 → 3분 진단 → 키트 목록(올인원) → FAQ → CTA
const SECTION_EYEBROW = 'font-display text-teal-700 text-sm font-semibold uppercase tracking-[0.18em]'
const SECTION_H2 = 'text-ink mt-4 break-keep text-3xl font-extrabold leading-[1.2] tracking-[-0.025em] sm:text-4xl'

const COMPARE = [
  {
    title: 'ChatGPT에 그때그때 묻기',
    desc: '똑똑하지만 우리 회사를 모릅니다. 물을 때마다 처음부터 설명해야 합니다.',
    points: ['회사 정보·거래처를 매번 다시 설명', '같은 질문에도 결과가 매번 달라짐', '대화가 끝나면 파일로 남지 않음'],
    ours: false,
  },
  {
    title: '월 구독 도구·템플릿 여러 개',
    desc: '업무마다 도구를 붙이다 보면 기록이 도구 수만큼 흩어집니다.',
    points: ['도구마다 데이터가 따로 쌓임', '사람 수·도구 수만큼 월 요금', '도구 사이는 사람이 옮겨 적음'],
    ours: false,
  },
  {
    title: '우리회사OS',
    desc: '회사 기록 한 판 위에 킷과 AI 직원을 얹어, 실제 업무 흐름대로 돌립니다.',
    points: [
      '구글시트 한 판에 회사 기록을 모음',
      '계산·조립은 고정 규칙 — 같은 입력이면 같은 결과',
      '결과물에는 우리 회사 이름, 월 이용료 없음',
    ],
    ours: true,
  },
]

const LAYERS = [
  {
    no: 'Layer 01',
    name: '기록',
    en: 'Record',
    kits: '①진단 · ②업무시트',
    summary: '거래처·견적·일정·재고를 구글시트 한 판에 모으는 바닥층. 위의 모든 킷과 AI 직원이 이 기록을 읽습니다.',
    lead: '회사의 기록을 구글시트 한 판으로 모으는 바닥층입니다. ①진단으로 어떤 일부터 맡길지 순서를 정하고, ②업무시트에 거래처·견적·일정·재고를 모읍니다. 위의 킷과 AI 직원은 모두 이 기록을 읽고 일합니다.',
    points: [
      ['우선순위 리포트', '①진단이 업무별 반복 빈도와 시간을 점수로 매겨 먼저 맡길 일을 알려 줍니다'],
      ['회사 관제탑', '오늘 마감·회신 지연·재고 경보를 한 화면에서 봅니다'],
      ['메모 한 줄 입력', '형식 없이 적어도 견적·업무요청으로 정리됩니다'],
    ],
    shots: [{ src: '/os/layer1-sheet.webp', w: 1600, h: 1146, alt: '②업무시트 관제탑 화면 — 오늘의 브리핑과 업무 상태흐름(예시 데이터)' }],
  },
  {
    no: 'Layer 02',
    name: '실행',
    en: 'Action',
    kits: '실행 킷 22종 · 미니 5종',
    summary: '견적서·독촉 문안·마감 리포트·브리핑을 고정 규칙으로 조립합니다. 같은 입력이면 언제나 같은 결과, 보내는 것은 사람입니다.',
    lead: '매주 같은 모양으로 돌아오는 일을 킷 하나가 한 가지씩 맡습니다. 더블클릭으로 창을 열고 버튼을 누르면 견적서·독촉 문안·마감 리포트·브리핑이 파일로 나옵니다. 보내는 것은 언제나 사람입니다.',
    points: [
      ['견적·수금·마감', '상담 메모 → 견적서 3안, 미수금 목록 → 독촉 문안 3단계, 장부 → 월간 마감 리포트'],
      ['콘텐츠·고객 응대', '블로그 원고·쇼츠 대본·리뷰 답글·FAQ 답변 초안'],
      ['숫자·재고', '발주 경보·재고대장·거래명세서·증빙 대사'],
    ],
    shots: [
      { src: '/os/layer2-quote.webp', w: 1000, h: 970, alt: '⑧견적 3안 킷이 만든 견적서 A안(예시 데이터)' },
      { src: '/os/layer2-brief.webp', w: 1200, h: 682, alt: '⑩사장 브리핑 킷이 만든 아침 브리핑(예시 데이터)' },
    ],
  },
  {
    no: 'Layer 03',
    name: '자율',
    en: 'Autonomy',
    kits: '③콘텐츠 · ④AI 직원 5명 · ④셀러편',
    summary: 'AI 직원이 할 일을 작업보드에 올려 처리하고 텔레그램으로 보고합니다. 대표 승인 없이는 아무것도 밖으로 나가지 않습니다.',
    lead: '킷을 사람이 누르는 단계에서, AI 직원이 할 일을 스스로 올리는 단계로 넘어갑니다. AI 직원이 작업보드에 카드를 올리고 처리하면, 대표는 텔레그램으로 보고받고 승인만 합니다. 승인 없이는 아무것도 밖으로 나가지 않습니다.',
    points: [
      ['AI 직원 5명', '기획·영업·콘텐츠·리서치·검수 역할이 작업보드에서 나눠 일합니다'],
      ['콘텐츠 자동 발행', '주제 제안 → 카피 → 대표 승인 → 공식 API로 발행'],
      ['AI가 설치', 'zip을 Claude Code·Codex에 주면 AI가 설치합니다. 작은 서버(월 1~2만 원)가 필요합니다'],
    ],
    shots: [{ src: '/os/layer3-board.webp', w: 1600, h: 956, alt: '④AI 직원 5명 관제탑의 작업보드 — 봇별 카드가 대기·완료로 흐르는 화면(카드 내용은 가림)' }],
  },
]

const PACK_MEMBERS: Record<string, string> = {
  '팩①': '⑭예약관리 · ⑥리뷰답글 · ⑰FAQ응대 · 미니③고객문자 · 미니②안내문',
  '팩②': '⑫발주경보 · ⑥리뷰답글 · 미니④가격표 · 미니②안내문 · 미니⑤마진계산',
  '팩③': '⑧견적3안 · ⑬수금독촉 · ⑨월말마감 · ⑯메일함 정리 · ⑩사장브리핑',
  '팩④': '⑤상세페이지 · ⑫발주경보 · ⑥리뷰답글 · ⑯메일함 정리 · 미니⑤마진계산',
  '팩⑤': '㉒성적통지문 · ⑭예약관리 · 미니③고객문자 · 미니①한장소개',
  '팩⑥': '⑳거래명세서 · ㉓재고대장 · ⑫발주경보 · ⑨월말마감',
}

const STEPS = [
  ['3분 웹 진단', '이 페이지에서 15문항으로 업무 5개 영역을 점검합니다. 로그인·정보 입력 없이 AI에 맡기면 좋은 일 TOP3가 나옵니다.'],
  ['①진단 킷 (무료)', '내 PC에서 업무 데이터를 넣고 우리 회사 이름이 들어간 우선순위 리포트를 받습니다.'],
  ['②업무시트로 기록 한 판', '거래처·견적·일정·재고를 구글시트 한 판에 모읍니다. 이후 모든 킷이 이 기록을 씁니다.'],
  ['실행 킷을 하나씩', '리포트가 짚은 순서대로 킷을 하나씩 켭니다. 한꺼번에 켜지 않는 것이 오래 쓰는 방법입니다.'],
  ['AI 직원으로 자율 운영', '반복 업무가 자리 잡으면 ③콘텐츠·④AI 직원 5명으로 넘어가, 대표는 승인만 합니다.'],
]

export default function OsPage() {
  // 가격 사다리 문구 — KITS에서 계산해 정본 가격이 바뀌어도 문구가 어긋나지 않게(2026-09-16)
  const minOf = (pick: (k: (typeof KITS)[number]) => boolean) =>
    formatPrice(Math.min(...KITS.filter(pick).map((k) => k.price)))
  const ladder = {
    mini: minOf((k) => k.group === '미니'),
    kit: minOf((k) => k.group !== '미니' && k.group !== '패키지' && k.price > 0),
    pack: minOf((k) => k.group === '패키지'),
    os: minOf((k) => k.name === 'AI 직원 5명'),
  }
  const packs = KITS.filter((k) => k.group === '패키지')

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
      <BreadcrumbLd trail={[{ name: '구독 서비스', path: '/subscribe' }, { name: '우리회사OS', path: '/os' }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />
      {/* 화면의 FAQ 문항을 FAQPage로도 낸다(같은 배열)(2026-09-08 AEO 감사 — "설치해야 하나요/AI 구독료" 질문 인용용) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: FAQ.map((f) => ({
              '@type': 'Question',
              name: f.q,
              acceptedAnswer: { '@type': 'Answer', text: f.a },
            })),
          }).replace(/</g, '\\u003c'),
        }}
      />

      {/* 히어로 — 좌 문구 · 우 실제 화면 */}
      <section className="mx-auto max-w-[1200px] px-5 py-16 sm:px-8 sm:py-20 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          <div>
            <p className={SECTION_EYEBROW}>Ourcompany OS</p>
            <h1 className="text-ink mt-4 break-keep text-4xl font-extrabold leading-[1.15] tracking-[-0.025em] sm:text-5xl">
              작은 회사 자동화의
              <br />
              마지막 단계
            </h1>
            <p className="text-arch font-display mt-3 text-3xl font-extrabold tracking-[-0.02em] sm:text-4xl">
              우리회사OS
            </p>
            <p className="text-ink-soft mt-6 max-w-[34em] break-keep text-lg leading-relaxed">
              회사의 실제 기록 위에 AI를 얹어, 견적·수금·마감·콘텐츠 같은 반복 업무를 실제로 덜어 내는
              작은 회사용 AI 운영체제입니다. 우리가 매일 돌리는 것을 그대로 키트로 냅니다.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <a
                href="#scan"
                className="bg-arch inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
              >
                3분 무료 진단부터 하기
              </a>
              <a
                href="#kits"
                className="border-line text-ink inline-flex h-14 items-center justify-center rounded-full border bg-white px-7 text-[15px] font-semibold transition hover:border-teal-700"
              >
                키트 {KITS.length}종 보기
              </a>
            </div>
          </div>
          <figure className="border-line overflow-hidden rounded-3xl border bg-white shadow-sm">
            <Image
              src="/os/layer1-sheet.webp"
              width={1600}
              height={1146}
              priority
              sizes="(min-width: 1024px) 640px, 100vw"
              alt="우리회사OS ②업무시트 관제탑 — 오늘의 브리핑과 업무 상태흐름(예시 데이터)"
              className="h-auto w-full"
            />
          </figure>
        </div>
      </section>

      {/* 정의 */}
      <section className="bg-cloud border-line border-y">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
          <p className={SECTION_EYEBROW}>What it is</p>
          <h2 className={`${SECTION_H2} max-w-[22ch]`}>
            회사 기록 한 판 위에서, AI가 실제 업무를 처리합니다
          </h2>
          <div className="mt-8 grid gap-8 lg:grid-cols-2 lg:gap-16">
            <p className="text-ink-soft break-keep text-lg leading-relaxed">
              퍼블릭아이디는 직원 몇 명이 B2G 입찰부터 시공·콘텐츠 발행까지 굴리는 회사입니다. 사람을
              늘리는 대신 반복 업무를 하나씩 AI에 넘겼고, 그때 만든 도구를 다듬어 우리회사OS로 냅니다.
            </p>
            <p className="text-ink-soft break-keep text-lg leading-relaxed">
              업무마다 월 구독 도구를 붙이는 대신, 구글시트 한 판에 회사 기록을 모으고 그 위에서 킷과 AI
              직원이 일합니다. 내려받아 더블클릭하면 창이 열리고, 결과물에는 우리 회사 이름이 들어갑니다.
            </p>
          </div>
          <p className="text-ink mt-10 max-w-[48em] break-keep text-base leading-relaxed">
            키트 값 외에 드는 돈은 하나입니다. 키트 안의 AI는 대표님이 이미 쓰시는 ChatGPT·Claude 구독을
            그대로 씁니다(월 2~3만 원, 이미 쓰고 계시면 추가 비용 없음). ④AI 직원 5명만 작은 서버(월 1~2만
            원)가 더 듭니다. ④의 설치는 Claude Code·Codex 같은 AI가 합니다(zip을 주고 한 줄). 설치 대행과 기술
            지원은 포함되지 않습니다.
          </p>
          <OsCurator />
        </div>
      </section>

      {/* 왜 — 탭 */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <p className={SECTION_EYEBROW}>Why</p>
        <h2 className={SECTION_H2}>우리회사OS로 이루려는 것은 분명합니다</h2>
        <OsWhyTabs />
      </section>

      {/* 비교 3열 + 핵심 설계 */}
      <section className="bg-cloud border-line border-y">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
          <p className={SECTION_EYEBROW}>Beyond chat</p>
          <h2 className={`${SECTION_H2} max-w-[24ch]`}>
            그때그때 묻는 AI를 넘어, 회사가 스스로 돌아가게
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {COMPARE.map((c) => (
              <div
                key={c.title}
                className={`rounded-2xl border p-6 sm:p-8 ${
                  c.ours ? 'border-teal-700/50 bg-white shadow-sm' : 'border-line bg-white/60'
                }`}
              >
                <p className={`text-lg font-bold ${c.ours ? 'text-teal-700' : 'text-ink'}`}>{c.title}</p>
                <p className="text-ink-soft mt-3 break-keep text-[15px] leading-relaxed">{c.desc}</p>
                <ul className="mt-6 space-y-3 text-[15px]">
                  {c.points.map((p) => (
                    <li key={p} className={`flex gap-2.5 break-keep ${c.ours ? 'text-ink' : 'text-ink-soft'}`}>
                      <span
                        aria-hidden="true"
                        className={`mt-2 size-1.5 shrink-0 rounded-full ${c.ours ? 'bg-teal-700' : 'bg-line-strong'}`}
                      />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-line mt-8 rounded-2xl border bg-white px-6 py-6 sm:px-8">
            <p className="text-teal-700 text-sm font-semibold">우리회사OS 핵심 설계</p>
            <p className="text-ink mt-2 break-keep text-base leading-relaxed">
              회사 기록(구글시트 한 판)을 바닥에 두고, 그 위에 고정 규칙으로 도는 실행 킷, 다시 그 위에 승인을
              받아 움직이는 AI 직원을 얹은 <strong className="font-semibold">3층 구조</strong>입니다. 아래층이
              탄탄해야 위층이 믿을 만한 결과를 냅니다.
            </p>
          </div>
        </div>
      </section>

      {/* 3층 구조 */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <p className={SECTION_EYEBROW}>3-Layer Architecture</p>
        <h2 className={`${SECTION_H2} max-w-[26ch]`}>
          기록 · 실행 · 자율 3층 구조로, 끊기지 않는 업무 흐름을 만듭니다
        </h2>

        {/* 3층 한눈에 — Blender 렌더(Agent\콘텐츠본부\홈페이지-우리회사OS\render_layers.py), 2026-09-17 */}
        <div className="mt-12 grid items-center gap-10 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <Image
            src="/os/layers-3d.webp"
            width={998}
            height={1037}
            sizes="(min-width: 1024px) 520px, 90vw"
            alt="우리회사OS 3층 구조 — 아래부터 기록(시트 한 판), 실행(킷), 자율(AI 직원 5명)"
            className="mx-auto h-auto w-full max-w-[520px]"
          />
          <ol className="border-line border-t">
            {[...LAYERS].reverse().map((l) => (
              <li key={l.no} className="border-line border-b py-6">
                <p className="flex flex-wrap items-baseline gap-x-3">
                  <span className="text-teal-700 font-display text-lg font-semibold">{l.en}</span>
                  <span className="text-ink text-lg font-bold">{l.name}</span>
                  <span className="text-ink-soft text-sm">{l.kits}</span>
                </p>
                <p className="text-ink-soft mt-2 break-keep text-[15px] leading-relaxed">{l.summary}</p>
              </li>
            ))}
          </ol>
        </div>
        <p className="text-ink-soft mt-8 max-w-[46em] break-keep text-[15px] leading-relaxed">
          아래층이 위층의 근거가 됩니다. AI 직원이 올린 일은 킷이 만든 문서로 확인하고, 킷은 기록 한 판의 숫자만
          씁니다. 기록이 바뀌면 킷과 AI 직원의 결과도 함께 바뀝니다.
        </p>

        <div className="mt-24 space-y-24 sm:mt-28 sm:space-y-28">
          {LAYERS.map((l) => (
            <div key={l.no}>
              <p className="font-display text-teal-700 text-base font-semibold">{l.no}</p>
              <h3 className="text-ink mt-2 text-2xl font-extrabold tracking-[-0.02em] sm:text-3xl">
                {l.name} <span className="text-line-strong font-normal">|</span>{' '}
                <span className="font-display">{l.en}</span>
              </h3>
              <p className="text-ink-soft mt-2 text-sm font-semibold">{l.kits}</p>
              <p className="text-ink mt-5 max-w-[46em] break-keep text-lg leading-relaxed">{l.lead}</p>
              <div className={`mt-10 grid gap-5 ${l.shots.length > 1 ? 'md:grid-cols-2' : ''}`}>
                {l.shots.map((s) => (
                  <figure key={s.src} className="border-line overflow-hidden rounded-2xl border bg-white shadow-sm">
                    <Image
                      src={s.src}
                      width={s.w}
                      height={s.h}
                      sizes="(min-width: 1200px) 1140px, 100vw"
                      alt={s.alt}
                      className="h-auto w-full"
                    />
                  </figure>
                ))}
              </div>
              <dl className="mt-10 grid gap-x-10 gap-y-6 md:grid-cols-3">
                {l.points.map(([t, d]) => (
                  <div key={t} className="border-line border-t pt-5">
                    <dt className="text-ink text-base font-bold">{t}</dt>
                    <dd className="text-ink-soft mt-2 break-keep text-[15px] leading-relaxed">{d}</dd>
                  </div>
                ))}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* 업종별 구성 */}
      <section className="bg-cloud border-line border-y">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
          <p className={SECTION_EYEBROW}>By industry</p>
          <h2 className={SECTION_H2}>업종별로는 이렇게 묶었습니다</h2>
          <p className="text-ink-soft mt-5 max-w-[42em] break-keep text-lg leading-relaxed">
            3층 구조는 업종과 상관없이 같습니다. 달라지는 것은 실행층에 어떤 킷을 먼저 놓느냐뿐입니다.
          </p>
          <ul className="border-line mt-10 border-t">
            {packs.map((p) => (
              <li key={p.no} className="border-line border-b">
                <KitLink
                  kit={`${p.no}${p.name}`}
                  place="list"
                  href={p.url}
                  className="grid gap-2 py-5 transition hover:opacity-75 md:grid-cols-[220px_1fr_auto] md:items-baseline md:gap-8"
                >
                  <span className="text-ink text-base font-bold">
                    <span className="text-teal-700">{p.no}</span> {p.name}
                  </span>
                  <span className="text-ink-soft break-keep text-[15px]">
                    {p.tagline}
                    <span className="text-ink mt-1 block text-sm">{PACK_MEMBERS[p.no]}</span>
                  </span>
                  <span className="text-ink text-sm font-bold">
                    {formatPrice(p.price)}원
                    <span className="text-ink-soft ml-2 text-xs font-normal line-through">
                      {formatPrice(p.listPrice)}원
                    </span>
                  </span>
                </KitLink>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 도입 단계 */}
      <section className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
        <p className={SECTION_EYEBROW}>How to start</p>
        <h2 className={SECTION_H2}>우리회사OS 도입 단계</h2>
        <ol className="mt-12 max-w-[52em]">
          {STEPS.map(([t, d], i) => (
            <li key={t} className="flex gap-5">
              <div className="flex flex-col items-center">
                <span className="bg-teal-100 text-teal-700 font-display flex size-10 shrink-0 items-center justify-center rounded-full text-base font-bold">
                  {i + 1}
                </span>
                {i < STEPS.length - 1 && <span className="bg-line my-1 w-px flex-1" aria-hidden="true" />}
              </div>
              <div className={i < STEPS.length - 1 ? 'pb-10' : ''}>
                <p className="text-ink pt-2 text-lg font-bold">{t}</p>
                <p className="text-ink-soft mt-2 break-keep text-[15px] leading-relaxed">{d}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* 3분 무료 진단 — 구 /scan 페이지 통합(2026-08-26). 구 주소는 301 → /os#scan */}
      <ScanClient />

      {/* 키트 목록 */}
      <section id="kits" className="mx-auto max-w-[1200px] scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <p className={SECTION_EYEBROW}>Kits</p>
        <h2 className={SECTION_H2}>지금 있는 키트 {KITS.length}종</h2>
        <p className="text-ink-soft mt-5 max-w-[42em] break-keep text-lg leading-relaxed">
          ①진단은 0원 무료이고, 나머지 {KITS.length - 1}종은 하나씩 따로 삽니다. 가격은 미니 {ladder.mini}원 →
          실행 킷 {ladder.kit}원부터 → 업종 패키지 {ladder.pack}원부터 → ④AI 직원 5명 {ladder.os}원(런칭가)
          순입니다. 전 상품 부가세 포함, 런칭가는 초기 10명 한정입니다.
        </p>

        {/* 올인원 키트 — 구독 상담으로만 판매(대표 확정 2026-09-17, 래피드·크몽 보류, 런칭가 없음) */}
        <div id="all-in-one" className="border-teal-700/30 mt-12 scroll-mt-24 rounded-2xl border bg-white p-6 sm:p-8">
          <p className="font-display text-teal-700 text-xs font-semibold uppercase tracking-[0.18em]">
            All-in-One Kit
          </p>
          <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
            <div className="min-w-0">
              <h3 className="text-ink text-xl font-extrabold tracking-[-0.02em] sm:text-2xl">
                올인원 키트 — {ALL_IN_ONE_MEMBERS.length}종 전부를 한 번에
              </h3>
              <p className="text-ink-soft mt-3 max-w-[40em] break-keep text-sm leading-relaxed sm:text-base">
                ①진단부터 ②업무시트·③콘텐츠·④AI 직원 5명·④셀러편, 실행 킷과 미니까지 업종 패키지를 뺀{' '}
                {ALL_IN_ONE_MEMBERS.length}종을 겹치는 것 없이 묶었습니다. 구매는 구독 상담으로 받습니다.
              </p>
            </div>
            <div className="shrink-0">
              <p className="text-teal-700 text-xs font-semibold">부가세 포함</p>
              <p className="text-ink font-display mt-1 text-3xl font-bold tracking-[-0.02em]">
                {formatPrice(ALL_IN_ONE.price)}원
              </p>
              <a
                href={`/contact?msg=${encodeURIComponent(
                  `[우리회사OS 올인원 키트 구매 상담] ${ALL_IN_ONE_MEMBERS.length}종 · ${formatPrice(ALL_IN_ONE.price)}원(부가세 포함)`,
                )}`}
                className="bg-arch mt-4 inline-flex h-12 items-center justify-center rounded-full px-6 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
              >
                올인원 키트 구매 문의
              </a>
            </div>
          </div>
        </div>

        {/* 업종 패키지는 위 '업종별 구성' 섹션에서 보여 준다 */}
        {KIT_GROUPS.filter((g) => g.key !== '패키지').map((g) => {
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
                    <KitLink
                      kit={`${k.no}${k.name}`}
                      place="list"
                      href={k.url}
                      className="flex flex-wrap items-baseline gap-x-3 gap-y-1 py-4 transition hover:opacity-75"
                    >
                      <span className="text-ink text-base font-bold">
                        <span className="text-teal-700">{k.no}</span>
                        {k.name}
                      </span>
                      <span className="text-ink-soft order-last basis-full text-sm sm:order-none sm:min-w-0 sm:flex-1 sm:basis-auto">
                        {k.tagline}
                      </span>
                      <span className="text-ink shrink-0 text-sm font-bold">
                        {priceLabel(k.price)}
                        {/* 0원(①진단)은 정가 취소선 없이 "무료"만 */}
                        {k.listPrice > 0 && (
                          <span className="text-ink-soft ml-2 text-xs font-normal line-through">
                            {formatPrice(k.listPrice)}원
                          </span>
                        )}
                      </span>
                    </KitLink>
                  </li>
                ))}
              </ul>
            </div>
          )
        })}
      </section>

      {/* FAQ */}
      <section className="bg-cloud border-line border-y">
        <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8 sm:py-28">
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
        </div>
      </section>

      {/* 최종 CTA */}
      <section className="bg-navy">
        <div className="mx-auto max-w-[1200px] px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="text-2xl font-extrabold tracking-[-0.025em] text-white sm:text-3xl">
            어디부터 바꿀지, 3분이면 답이 나옵니다
          </h2>
          <p className="mx-auto mt-5 max-w-[38em] text-base leading-relaxed text-white/75">
            15문항 무료 진단으로 우리 회사 업무 5개 영역을 점검하고, AI에 맡기면 좋은
            우선순위 TOP3와 주당 절감 시간을 확인하세요. 로그인도, 정보 입력도 없습니다. 이어서
            받는 ①진단 킷도 0원입니다.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#scan"
              className="bg-arch inline-flex h-14 items-center justify-center rounded-full px-7 text-[15px] font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-105"
            >
              무료 진단 시작하기
            </a>
            <a
              href="#kits"
              className="inline-flex h-14 items-center justify-center rounded-full border border-white/25 bg-white/10 px-7 text-[15px] font-semibold text-white transition hover:bg-white/20"
            >
              키트 전체 보기
            </a>
          </div>

          {/* 첫 후기단 5명 — 실행 키트 8종 0원(대표 확정 2026-09-09, 09-18 8종·1주·래피드 후기로 개편) */}
          <div className="mx-auto mt-12 max-w-[42em] rounded-2xl border border-white/15 bg-white/5 px-6 py-6 text-left sm:px-8">
            <p className="font-display text-lime text-xs font-semibold uppercase tracking-[0.18em]">
              First reviewers
            </p>
            <h3 className="mt-2 text-lg font-bold text-white">
              첫 후기단 5명 — 실행 키트 8종을 0원에
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              가장 많이 쓰이는 견적 3안·수금독촉·리뷰답글과 미니 5종, 정가 476,500원어치를
              드립니다. 값은 0원이고, 1주 안에 래피드 상품 페이지에 후기 한 줄만 남겨 주시면
              됩니다. 5명이 차면 닫힙니다.
            </p>
            <KitLink
              kit="reviewers"
              place="cta"
              href={LATPEED_REVIEWERS_URL}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              후기단 신청하기 (0원·5명)
            </KitLink>
          </div>

          {/* 무료 멤버십 — 아직 살 킷이 안 보이는 분의 다음 한 걸음 */}
          <div className="mx-auto mt-6 max-w-[42em] rounded-2xl border border-white/15 bg-white/5 px-6 py-6 text-left sm:px-8">
            <p className="font-display text-lime text-xs font-semibold uppercase tracking-[0.18em]">
              Free membership
            </p>
            <h3 className="mt-2 text-lg font-bold text-white">
              아직 살 킷이 안 보이면, 무료 멤버로 먼저 받아 보세요
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">
              0원, 결제 정보 없음. 새 킷이 나오면 판매 전에 먼저 알려 드리고, 작은 회사가 실제로
              자동화한 사례를 한 달에 한 통만 보냅니다. 언제든 그만둘 수 있습니다.
            </p>
            <KitLink
              kit="membership"
              place="cta"
              href={LATPEED_MEMBERSHIP_URL}
              className="mt-4 inline-flex h-11 items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 text-sm font-semibold text-white transition hover:bg-white/20"
            >
              무료 멤버 가입하기 (월 1회 레터)
            </KitLink>
          </div>
        </div>
      </section>
    </>
  )
}
