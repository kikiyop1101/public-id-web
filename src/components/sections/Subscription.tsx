import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import { Mascot, Webtoon, Palette, Footprint, Shield, Check, Bollard, Sparkle, Browser } from "@/components/icons";

const designFeatures = [
  {
    icon: Palette,
    title: "디자인 시스템",
    desc: "로고·BI·CI·SNS·현수막까지 일관된 브랜드 키트를 제공합니다.",
    note: "Design System — BrandDNA를 21개 항목에 걸쳐 일관되게 적용하기 위한 규칙",
  },
  {
    icon: Browser,
    title: "홈페이지 제작",
    desc: "디자인 시스템과 구독으로 받는 자료(마스코트·로고·템플릿)로 홈페이지까지 만들어 드립니다.",
    note: "",
  },
  {
    icon: Mascot,
    title: "전용 마스코트",
    desc: "우리 회사(기업)만의 캐릭터를 제작해 어디에나 활용합니다.",
    note: "",
  },
  {
    icon: Webtoon,
    title: "매월 웹툰",
    desc: "브랜드 이야기를 담은 월 1편의 웹툰 콘텐츠를 받아보세요.",
    note: "",
  },
  {
    icon: Sparkle,
    title: "월 정기 디자인 (요청 시 월 1회 기준)",
    desc: "DTC Ads — 인스타그램·쓰레드 등 SNS용 (비율 1:1 · 9:16 · 16:9)",
    note: "",
  },
];

const designBullets = [
  { label: "로고·컬러·폰트 가이드" },
  { label: "SNS·홍보물 템플릿" },
  { label: "디자인 원본 파일 제공", sub: "PDF, JPG, PNG" },
  { label: "상표 등록 가능한 캐릭터" },
  { label: "간단 인쇄물 · Sign물 제작 가이드" },
  { label: "AI 자동화 키트", sub: "Basic 기본 · Standard 심화" },
];

const safetyFeatures = [
  {
    icon: Footprint,
    title: "노란발자국 · 노면표시",
    desc: "어린이보호구역·횡단보도 안전표시를 직접 제작·시공합니다.",
  },
  {
    icon: Bollard,
    title: "노란볼라드",
    desc: "보도·횡단보도 진입부에 설치해 차량 진입을 막고 보행자를 보호하는 안전 기둥. 친환경 직물시트로 시인성 있게 마감합니다.",
  },
  {
    icon: Shield,
    title: "정기 점검 · 교체",
    desc: "마모·손상을 주기적으로 점검하고 유지보수합니다.",
  },
  {
    icon: Palette,
    title: "안전 디자인 제안",
    desc: "CPTED·웨이파인딩 등 현장 맞춤 공공디자인을 제안합니다.",
  },
];

const safetyBullets = [
  "친환경 그래픽 표시재(노면)",
  "친환경 직물시트",
  "현장 실측 · 시공",
  "계약형 정기 관리",
  "지자체 우선구매 가능",
];

export default function Subscription({
  moreHref,
  designHref = "#pricing",
  safetyHref = "/contact",
  pricing = false,
}: {
  moreHref?: string;
  designHref?: string;
  safetyHref?: string;
  pricing?: boolean;
}) {
  return (
    <section id="subscribe" className="py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Subscription
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            구독 한 번으로, 디자인과 안전을 동시에
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            필요한 만큼만, 매월 합리적으로. 두 가지 구독을 따로 또 같이 이용하세요.
          </p>
          {moreHref && (
            <Link
              href={moreHref}
              className="link-underline mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
            >
              구독 서비스 자세히 보기 <span aria-hidden>→</span>
            </Link>
          )}
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {/* 디자인 구독 */}
          <Reveal>
            <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-white p-8 shadow-sm sm:p-10">
              <div className="absolute inset-x-0 top-0 h-1.5 bg-arch" />
              <div className="absolute right-6 top-6 h-14 w-14 overflow-hidden rounded-2xl border border-line bg-cloud sm:h-16 sm:w-16">
                <Image
                  src="/mascot/pui-3q.png"
                  alt=""
                  aria-hidden
                  fill
                  sizes="64px"
                  className="object-cover"
                />
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-700">
                소상공인 등 중소기업 추천
              </span>
              <h3 className="mt-5 text-2xl font-bold text-ink">디자인 구독</h3>
              <p className="mt-2 text-ink-soft">
                디자인 팀 없이도 매달 새로운 브랜드 콘텐츠를 받아보세요.
              </p>

              <ul className="mt-7 space-y-4">
                {designFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.title} className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-arch text-white">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold text-ink">{f.title}</p>
                        <p className="text-sm text-ink-soft">{f.desc}</p>
                        {f.note && (
                          <p className="mt-1 text-xs leading-relaxed text-teal-700">
                            {f.note}
                          </p>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {designBullets.map((b) => (
                  <li
                    key={b.label}
                    className="flex items-start gap-2 text-sm text-ink"
                  >
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                    <span>
                      {b.label}
                      {b.sub && (
                        <span className="block text-xs text-ink-soft">
                          {b.sub}
                        </span>
                      )}
                    </span>
                  </li>
                ))}
              </ul>

              {pricing && (
                <div className="mt-7 space-y-3 rounded-2xl border border-line bg-cloud/60 p-5 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">디자인 시스템 구축</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                        Base → Mini → Guide (70~80p 기준) · Client Confirm 약 15일 소요
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-teal-700">3,500,000원</p>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-line pt-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-ink">디자인 구독 1년 (디자인 시스템 구축 포함)</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">
                        홈페이지 제작 포함 · 디자인 시스템 수정 요청 시 반기별 반영
                      </p>
                    </div>
                    <p className="shrink-0 font-bold text-teal-700">4,000,000원부터</p>
                  </div>
                  <p className="border-t border-line pt-3 text-xs leading-relaxed text-ink-soft">
                    표시 금액은 기준가입니다 · 사회적경제 기업(사회적기업·협동조합·마을기업·자활기업)은 할인 적용 · 정확한 견적은 문의
                  </p>
                </div>
              )}

              <div className="mt-auto pt-8">
                <Button href={designHref} variant="arch" className="w-full sm:w-auto">
                  디자인 구독 상담
                </Button>
              </div>
            </article>
          </Reveal>

          {/* 안전·시설 관리 구독 */}
          <Reveal delay={80}>
            <article className="relative flex h-full flex-col overflow-hidden rounded-3xl border border-navy bg-navy p-8 text-white sm:p-10">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-teal-100">
                관공서 · 공공기관 · 학교 · 비영리단체(NGO) 등 추천
              </span>
              <h3 className="mt-5 text-2xl font-bold">안전 · 시설 관리 구독</h3>
              <p className="mt-2 text-white/70">
                노면표시·안전표지를 시공부터 정기 관리까지 한 번에.
              </p>

              <ul className="mt-7 space-y-4">
                {safetyFeatures.map((f) => {
                  const Icon = f.icon;
                  return (
                    <li key={f.title} className="flex gap-4">
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-yellow">
                        <Icon className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-semibold">{f.title}</p>
                        <p className="text-sm text-white/60">{f.desc}</p>
                      </div>
                    </li>
                  );
                })}
              </ul>

              <ul className="mt-7 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {safetyBullets.map((b) => (
                  <li
                    key={b}
                    className="flex items-center gap-2 text-sm text-white/85"
                  >
                    <Check className="h-4 w-4 shrink-0 text-yellow" />
                    {b}
                  </li>
                ))}
              </ul>

              {pricing && (
                <div className="mt-7 space-y-3 rounded-2xl border border-white/10 bg-white/[0.05] p-5 text-sm">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="font-semibold text-white">친환경 그래픽 표시재 (노면)</p>
                    <p className="shrink-0 font-bold text-yellow">132,000원 / ㎡</p>
                  </div>
                  <div className="flex items-start justify-between gap-3 border-t border-white/10 pt-3">
                    <p className="font-semibold text-white">노란발자국</p>
                    <div className="shrink-0 text-right text-xs leading-relaxed">
                      <p>
                        <span className="text-white/60">전면형 </span>
                        <span className="font-bold text-yellow">600,000원부터</span>
                      </p>
                      <p className="mt-0.5">
                        <span className="text-white/60">우측면형 </span>
                        <span className="font-bold text-yellow">400,000원부터</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-baseline justify-between gap-3 border-t border-white/10 pt-3">
                    <p className="font-semibold text-white">친환경 직물시트 (노란볼라드)</p>
                    <p className="shrink-0 font-bold text-yellow">88,000원 / ㎡</p>
                  </div>
                  <p className="border-t border-white/10 pt-3 text-xs leading-relaxed text-white/60">
                    표시 금액은 기준가입니다 · 현장 실측·시공비 별도 · 설치 시 1년 유지보수 보장 · 정확한 견적은 문의
                  </p>
                </div>
              )}

              <div className="mt-auto pt-8">
                <Button href={safetyHref} variant="light" className="w-full sm:w-auto">
                  안전 관리 문의
                </Button>
              </div>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
