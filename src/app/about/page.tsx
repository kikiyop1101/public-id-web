import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Image from "next/image";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Button from "@/components/Button";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import BreadcrumbLd from "@/components/BreadcrumbLd";
import FaqBlock, { type FaqItem } from "@/components/FaqBlock";

export const metadata: Metadata = pageMeta({
  title: "회사소개 — 세종의 산업디자인 사회적기업",
  description:
    "2017년 세종에서 설립한 KIDP 종합산업디자인전문회사이자 인증 사회적기업입니다. 노란발자국·친환경 그래픽 노면표시재·웨이파인딩·친환경 현수막까지 공공 안전 디자인을 디자인부터 시공까지 맡고, 우리회사OS와 디자인 구독으로 작은 조직의 파트너가 됩니다.",
  path: "/about",
});

const facts = [
  { k: "전문성", v: "KIDP 종합산업디자인전문회사 (시각 · 제품 · 환경)" },
  { k: "가치", v: "윤리적 가치를 담은 인증 사회적기업" },
  { k: "분야", v: "우리회사OS(AI 업무자동화) · 디자인 구독 · 친환경 그래픽 노면표시 · 안전시설관리" },
  { k: "거점", v: "세종특별자치시 · 전국 시공" },
];

const history = [
  { y: "2007", t: "디자인 전문 경력 시작", d: "시각 · 공간(환경) · 제품 디자인" },
  { y: "2017", t: "사업 등록 · 법인 설립", d: "주식회사 퍼블릭아이디\n인쇄사·출판사 신고" },
  { y: "2018", t: "KIDP 산업디자인전문회사(종합)", d: "제07691호 · 시각·제품·환경" },
  { y: "2020", t: "인증 사회적기업", d: "고용노동부 인증" },
  { y: "2026", t: "우리회사OS · 구독 런칭", d: "소상공인 AI 업무자동화 킷\n디자인 구독 서비스" },
];

// 사업영역(#work) — 2026-11-17 옛 /work 쪽을 회사소개 안으로 합쳤다(대표 "페이지가 너무 많은 느낌", /work → /about#work 301).
// 그림은 AI 연출 컷(/work/gen-*) 대신 자사 실제 시공·캠페인 사진으로 — "우리가 했다"를 말하는 자리(루트 규약). 문구는 옛 쪽 그대로(특허 줄만 '보유'로).
const works = [
  {
    img: "/products/친환경그래픽노면표시재/참조14.jpg",
    alt: "광장 바닥에 부착한 놀이 그래픽과 색색의 달리기 선",
    title: "노면 그래픽 콘텐츠",
    desc: "횡단보도 앞 안전보행, 아이들의 안전한 놀이공간, 금연표지를 비롯한 표지 등을 유도하는 노면 그래픽.",
    tag: "대표 사업",
  },
  {
    img: "/products/친환경그래픽노면표시재/참조23.jpg",
    alt: "경사로와 계단을 따라 부착한 파랑·빨강 동선 표시",
    title: "친환경 그래픽 노면표시재",
    // 특허는 '보유'로만 쓴다(대표 2026-11-09 — 제품에 '적용'이라고 쓰지 않는다)
    desc: "공공·산업 공간의 노면 그래픽. 자체 특허(제10-1974029호)와 국제특허(유럽특허 EP 1 677 974) 보유 · GREENGUARD GOLD 인증 잉크로 인쇄.",
    tag: "특허 보유",
  },
  {
    img: "/products/친환경그래픽직물시트/참조16.jpg",
    alt: "주차장 기둥과 보를 노란 직물시트로 감싼 출입구 번호 안내",
    title: "웨이파인딩 · 사인",
    desc: "공공·상업 공간을 위한 길찾기 사인 시스템과 안내 그래픽.",
  },
  {
    img: "/products/친환경홍보판촉물/참조01.jpg",
    alt: "전시 부스에 놓인 타이벡 소재 가방과 친환경 홍보판촉물",
    title: "친환경 현수막·배너 등",
    desc: "Tyvek 소재로 만드는 친환경 현수막·배너, 그리고 이를 재활용한 친환경 홍보판촉물.",
  },
  {
    img: "/products/친환경그래픽노면표시재-노란발자국/참조16.jpg",
    alt: "횡단보도 앞 보도에 노란발자국을 함께 붙이는 캠페인 참가자들",
    title: "이벤트 · 캠페인",
    desc: "축제·캠페인 현장의 사인과 바닥 그래픽.",
  },
  {
    img: "/products/친환경그래픽노면표시재-노란발자국/참조21.jpg",
    alt: "횡단보도 앞 보도에 노란 대기선을 부착하는 시공 장면",
    title: "전국 안전 시공",
    desc: "전국 관공서·공공기관 등의 안전 노면표시를 직접 제작·설치·점검합니다.",
  },
];

// 회사 FAQ (2026-09-27) — 사실 정본 = assistant-knowledge.ts·llms.txt·credibility.ts. 규모 수치(임직원·매출) 비공개.
const ABOUT_FAQ: FaqItem[] = [
  {
    q: "퍼블릭아이디는 언제, 어디서 설립됐나요?",
    a: "2017년 세종특별자치시에서 설립한 주식회사 퍼블릭아이디입니다. 본사는 세종특별자치시 한누리대로 2135, 에이동 401호(보람동, 스타힐타워Ⅰ)이며 전국에 시공합니다.",
  },
  {
    q: "퍼블릭아이디는 사회적기업인가요?",
    a: "네, 고용노동부 인증 사회적기업(제2020-227호)입니다. 「사회적기업 육성법」 제12조에 따른 공공기관 우선구매 대상이며, KIDP 종합산업디자인전문회사이기도 합니다.",
  },
  {
    q: "어떤 특허와 인증을 보유하고 있나요?",
    a: "자체 특허(제10-1974029호)와 국제특허(유럽특허 EP 1 677 974)를 보유하고 있습니다. 친환경 그래픽 노면표시재는 GREENGUARD GOLD(UL 2818) 인증 친환경 라텍스 잉크로 인쇄하고, 노란발자국은 상표등록(제40-1257164호) 제품, 노란볼라드는 GD2023 굿디자인 선정 제품입니다.",
  },
  {
    q: "어떤 곳과 일해 왔나요?",
    a: "세종시·서울시·경기도청·국립세종수목원·유니세프·세이브더칠드런·스타벅스·현대자동차 등과 함께했습니다. 누적 960여 건의 프로젝트와 278개 거래처 가운데 공공기관·지자체가 63%입니다.",
  },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "회사소개", path: "/about" }]} />
      <PageHero
        eyebrow="About"
        title={
          <>
            디자인으로
            <br />
            공공의 가치를 만듭니다
          </>
        }
        description="안전한 보행환경과 작은 브랜드의 성장을 디자인으로 함께 만드는 회사, 퍼블릭아이디입니다."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-[40px]">
              작은 표지 하나가
              <br />
              거리를 바꿉니다
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                퍼블릭아이디는 어린이 교통안전을 위한{" "}
                <b className="font-semibold text-ink">노란발자국</b>을 비롯해, 도시
                곳곳의 안전을 친환경 그래픽으로 풀어 온 산업디자인 전문회사입니다.
              </p>
              <p>
                공공과 민간을 잇는 친절한 디자인으로{" "}
                <b className="font-semibold text-ink">
                  아동·청소년·여성의 사회 문제
                </b>
                를 함께 풀고, 아이템 선정은 언제나 <b className="font-semibold text-ink">안전과 친환경</b>을
                최우선으로 합니다.
              </p>
              <p>
                그 전문성을 이제 작은 회사를 위한{" "}
                <b className="font-semibold text-ink">우리회사OS(AI 업무 자동화)</b>와{" "}
                <b className="font-semibold text-ink">디자인 구독</b>으로 넓혀가고
                있습니다. 디자인이 만드는 안전과 가치를, 더 많은 곳에 더 가까이.
              </p>
            </div>
          </Reveal>

          <Reveal className="lg:col-span-6" delay={80}>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-line bg-cloud">
              <Image
                src="/products/친환경그래픽노면표시재-노란발자국/참조01.jpg"
                alt="등굣길 횡단보도 앞 노란발자국 위에 서 있는 아이들"
                fill
                sizes="(min-width:1024px) 568px, 100vw"
                className="object-cover"
              />
            </div>
            <dl className="mt-6 divide-y divide-line border-y border-line">
              {facts.map((f) => (
                <div key={f.k} className="flex gap-5 py-3.5">
                  <dt className="w-14 shrink-0 text-sm font-semibold text-teal-700">{f.k}</dt>
                  <dd className="break-keep text-sm font-medium leading-relaxed text-ink">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* 사업영역 — 옛 /work. 카드 테두리 없이 사진+글(포트폴리오 격자) */}
      <section id="work" className="scroll-mt-24 border-t border-line bg-white py-20 sm:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Our Work
            </p>
            <h2 className="mt-4 text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
              공공의 안전을 디자인합니다
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-ink-soft">
              노면표시부터 도시 사인까지. 사람을 먼저 생각하는 공공디자인으로 더 안전한 거리를 만듭니다.
            </p>
          </Reveal>
          <ul className="mt-12 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {works.map((w, i) => (
              <Reveal as="li" key={w.title} delay={(i % 3) * 80}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-line bg-cloud">
                  <Image
                    src={w.img}
                    alt={w.alt}
                    fill
                    sizes="(min-width:1024px) 368px, (min-width:640px) 50vw, 100vw"
                    className="object-cover"
                  />
                  {w.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
                      {w.tag}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold text-ink">{w.title}</h3>
                <p className="mt-2 break-keep text-sm leading-relaxed text-ink-soft">{w.desc}</p>
              </Reveal>
            ))}
          </ul>
          <p className="mt-12 flex flex-wrap gap-x-8 gap-y-2 text-sm font-semibold">
            <Link href="/products" className="link-underline inline-flex min-h-11 items-center gap-1.5 text-teal-700">
              제품과 기준가 보기 <span aria-hidden>→</span>
            </Link>
            <Link href="/guide" className="link-underline inline-flex min-h-11 items-center gap-1.5 text-teal-700">
              칠하지 않고 붙이는 부착 가이드 <span aria-hidden>→</span>
            </Link>
            <Link href="/credibility" className="link-underline inline-flex min-h-11 items-center gap-1.5 text-teal-700">
              실적·인증 보기 <span aria-hidden>→</span>
            </Link>
          </p>
        </Container>
      </section>

      <section id="history" className="border-y border-line bg-cloud/50 py-20 sm:py-24">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              History
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              걸어온 길
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {history.map((h, i) => (
              <Reveal key={h.y} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-white p-6">
                  <p className="font-display text-2xl font-bold text-arch">{h.y}</p>
                  <h3 className="mt-3 font-bold text-ink">{h.t}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                    {h.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <FaqBlock title="회사에 대해 자주 묻는 질문" items={ABOUT_FAQ} className="bg-white" />

      {/* 다음 행동 — 회사·사업영역을 본 뒤 견적·문의로(2026-09-27 동선 점검, 옛 /work 맺음) */}
      <section className="border-t border-line bg-cloud/50 py-20 text-center sm:py-24">
        <Container>
          <h2 className="text-2xl font-bold text-ink sm:text-3xl">우리 공간에도 적용할 수 있을까요?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-soft">
            설치 장소·규격·수량을 알려주시면 맞춤 견적으로 회신드립니다.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button href="/quote">맞춤 견적 받기</Button>
            <Button href="/contact" variant="navy">문의하기</Button>
          </div>
          <p className="mt-6 text-sm text-ink-soft">
            소재부터 시공·관리까지 스크롤로 둘러보려면{" "}
            <a href="/world" target="_blank" rel="noopener noreferrer" className="font-semibold text-teal-700 hover:underline">
              퍼블릭아이디 3D 월드
            </a>
          </p>
        </Container>
      </section>
    </>
  );
}
