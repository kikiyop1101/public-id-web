import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

// 2026-08-25 홈 리디자인 — 참조: notion(대형 타이포 리스트). 홈에서 갈래는 딱 셋.
// 2026-08-26 업그레이드 — 리스트가 비어 보인다(대표 08-26 "정리 안 된 느낌"):
// 행마다 실물 썸네일을 붙이고, 아래에 공통 진행 단계를 한 줄로 깔아
// "다음에 무슨 일이 일어나는지"(B2G 리서치 권고)를 보여준다.
const GATES = [
  {
    href: "/subscribe",
    label: "디자인 구독",
    desc: "홈페이지 제작 · 전용 마스코트 · 매월 웹툰 · 디자인 시스템 — Basic 연 110만원부터",
    img: "/mascot/pui-wave.png",
    imgAlt: "디자인 구독의 얼굴, 마스코트 퍼이",
    imgFit: "contain" as const,
  },
  {
    href: "/products",
    label: "제품 · 시공",
    desc: "노면표시 · 안전표지 · 직물시트 · 명화/지도 출력 — 시공 후 1년 관리까지",
    img: "/products/친환경그래픽노면표시재-노란발자국/참조01.jpg",
    imgAlt: "등굣길 횡단보도 앞 노란발자국 위에 서 있는 아이들",
    imgFit: "cover" as const,
  },
  {
    href: "/os",
    label: "우리회사OS",
    desc: "소상공인을 위한 AI 자동화 템플릿 — 무료 진단으로 시작",
    img: null,
    imgAlt: "",
    imgFit: "cover" as const,
  },
];

const STEPS = ["상담·진단", "디자인", "제작·시공", "관리·리포트"];

export default function ProductGateway() {
  return (
    <section className="border-t border-line bg-paper">
      <Container className="py-20 sm:py-28">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          What We Offer
        </p>
        <h2 className="mt-3 max-w-3xl break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
          디자인이 필요한 순간,
          <br />셋 중 하나에서 시작하세요.
        </h2>
        <ul className="mt-10 divide-y divide-line border-y border-line">
          {GATES.map((g) => (
            <li key={g.href}>
              <Link
                href={g.href}
                className="group flex items-center gap-5 py-6 sm:gap-8 sm:py-7"
              >
                <span className="relative block h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-line bg-white sm:h-24 sm:w-36">
                  {g.img ? (
                    <Image
                      src={g.img}
                      alt={g.imgAlt}
                      fill
                      sizes="144px"
                      className={
                        g.imgFit === "contain"
                          ? "bg-teal-100 object-contain p-2 transition duration-500 group-hover:scale-[1.05]"
                          : "object-cover transition duration-500 group-hover:scale-[1.05]"
                      }
                    />
                  ) : (
                    <span className="flex h-full w-full items-center justify-center bg-navy">
                      <span className="bg-arch bg-clip-text font-display text-2xl font-bold tracking-tight text-transparent sm:text-3xl">
                        OS
                      </span>
                    </span>
                  )}
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <span className="text-xl font-extrabold tracking-tight text-ink transition group-hover:text-teal-700 sm:text-3xl">
                    {g.label}
                    <span className="ml-2 inline-block transition group-hover:translate-x-1">
                      →
                    </span>
                  </span>
                  <span className="break-keep text-sm text-ink-soft sm:max-w-md sm:text-right sm:text-base">
                    {g.desc}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {/* 공통 진행 단계 — 어느 갈래든 상담부터 관리까지 한 팀이 맡는다 */}
        <div className="mt-8 flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-ink-soft">
          <span className="mr-2 font-semibold text-navy">진행은 이렇게 —</span>
          {STEPS.map((s, i) => (
            <span key={s} className="flex items-center gap-2">
              <span className="rounded-full border border-line bg-white/70 px-3 py-1 font-medium">
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <span aria-hidden className="text-line-input">
                  →
                </span>
              )}
            </span>
          ))}
        </div>
      </Container>
    </section>
  );
}
