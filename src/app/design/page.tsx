import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import DesignTokenDemo from "@/components/sections/DesignTokenDemo";

export const metadata: Metadata = {
  title: "디자인시스템",
  alternates: { canonical: "/design" },
  description:
    "색 하나를 바꾸면 명함부터 현수막까지 한 번에 바뀝니다. 퍼블릭아이디가 스스로 만들어 쓰는 디자인시스템과, 그 체계를 귀사의 것으로 만들어 드리는 디자인구독.",
};

const problems = [
  {
    q: "“로고 최신 파일이 어디 있죠?”",
    a: "부서마다, 업체마다 다른 로고와 색. 자료를 찾는 시간부터 비용입니다.",
  },
  {
    q: "“지난번 현수막이랑 색이 달라요.”",
    a: "매번 새로 맞추다 보면 같은 회사 산출물인데 매번 다른 회사처럼 보입니다.",
  },
  {
    q: "“업체 바뀌니 처음부터 다시래요.”",
    a: "규칙이 문서로 없으면 담당자·업체가 바뀔 때마다 처음부터 다시 시작합니다.",
  },
];

const stats = [
  { v: "395", u: "개", l: "색·글꼴·간격 디자인 토큰" },
  { v: "20", u: "종", l: "상태·접근성 규격을 포함한 컴포넌트" },
  { v: "27", u: "페이지", l: "누구나 따라 쓸 수 있는 문서 사이트" },
  { v: "2", u: "중", l: "색 정본 일치·규격 위반 자동 검증" },
];

const proofPoints = [
  "라이트·다크 두 테마를 토큰 한 겹으로 자동 전환",
  "텍스트 대비 WCAG AA 기준·키보드 조작·터치 영역 44px 규격 내장",
  "대한민국 정부 디자인시스템(KRDS) 문서 체계 벤치마킹",
  "Google Material·Apple HIG·Adobe Spectrum의 문서 구조 이식",
];

const steps = [
  {
    n: "01",
    title: "브랜드 진단",
    desc: "지금 쓰는 로고·색·산출물을 모아 무엇이 흩어져 있는지 함께 확인합니다.",
  },
  {
    n: "02",
    title: "디자인 정본 구축",
    desc: "귀사의 색·글꼴·규칙을 정본 문서로 만듭니다. 담당자·업체가 바뀌어도 흔들리지 않습니다.",
  },
  {
    n: "03",
    title: "월 디자인구독 운영",
    desc: "매월 필요한 명함·현수막·카드뉴스·웹 배너를 정본 기준으로 제작해 드립니다.",
  },
];

export default function DesignPage() {
  return (
    <>
      <PageHero
        eyebrow="Design System"
        title={
          <>
            디자인이 흔들리지 않는
            <br />
            회사를 만듭니다
          </>
        }
        description="명함, 현수막, 안내판, 홈페이지 — 어디에 있어도 한눈에 같은 회사로 보이도록. 퍼블릭아이디는 색·글꼴·간격의 정본(디자인시스템)을 먼저 만들고, 모든 디자인을 거기서 꺼내 씁니다."
      />

      {/* 문제 */}
      <section className="bg-cloud py-20 sm:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Why
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              디자인이 흩어져 있으면,
              <br />
              만들 때마다 비용입니다
            </h2>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {problems.map((p, i) => (
              <Reveal key={p.q} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-white p-6">
                  <h3 className="font-bold text-ink">{p.q}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{p.a}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* 인터랙티브 데모 */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              3초 체험
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              색 하나를 바꾸면,
              <br />
              전부가 한 번에 바뀝니다
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              이것이 디자인시스템의 힘입니다. 귀사의 색을 정본 한 곳에 정하면 — 명함·현수막·
              홈페이지·안내판이 같은 언어로 다시 태어납니다. 아래 버튼을 눌러 보세요.
            </p>
          </Reveal>
          <Reveal className="mt-12" delay={120}>
            <DesignTokenDemo />
          </Reveal>
        </Container>
      </section>

      {/* 증거 */}
      <section className="bg-cloud py-20 sm:py-28">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              말이 아니라 실물로
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              우리 스스로에게 먼저 만들어 썼습니다
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              아래 숫자는 홍보 문구가 아니라, 지금 실제로 운영 중인 퍼블릭아이디
              디자인시스템(PI-DS)의 실측값입니다.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((s, i) => (
              <Reveal key={s.l} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-white p-6">
                  <div className="font-display text-4xl font-bold text-navy">
                    {s.v}
                    <span className="ml-0.5 text-base font-bold text-teal-700">{s.u}</span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.l}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-10" delay={160}>
            <ul className="grid gap-3 sm:grid-cols-2">
              {proofPoints.map((p) => (
                <li key={p} className="flex items-start gap-2 text-[15px] text-ink-soft">
                  <span aria-hidden className="mt-0.5 font-bold text-teal">
                    ✓
                  </span>
                  {p}
                </li>
              ))}
            </ul>
            <div className="mt-10">
              <Button href="/design-docs/index.html" variant="outline" external>
                디자인시스템 문서 전체 보기
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* CTA — 디자인구독 */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Subscription
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              이 체계를, 귀사의 것으로
              <br />
              만들어 드립니다
            </h2>
            <p className="mt-4 text-lg text-ink-soft">
              한 번 만들고 끝나는 외주가 아니라 — 정본을 함께 만들고, 매월 필요한 디자인을 그
              정본에서 꺼내 드리는 구독 방식입니다.
            </p>
          </Reveal>
          <div className="mt-14 grid gap-6 lg:grid-cols-3">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 80}>
                <div className="h-full rounded-2xl border border-t-4 border-line border-t-teal bg-white p-6">
                  <span className="font-display text-3xl font-bold text-arch">{s.n}</span>
                  <h3 className="mt-3 font-bold text-ink">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{s.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
          <Reveal className="mt-12 flex flex-wrap items-center justify-center gap-4" delay={160}>
            <Button href="/contact" size="lg">
              디자인구독 문의하기
            </Button>
            <Button href="/subscribe" variant="outline" size="lg">
              구독 서비스 자세히 보기
            </Button>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
