import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";

export const metadata: Metadata = {
  title: "노면 그래픽 부착 가이드",
  alternates: { canonical: "/guide" },
  description:
    "친환경 그래픽 노면표시재는 칠하지 않고 붙입니다. 붙일 수 있는 바닥 조건, 노면 온도 기준, 위치 선정·청소·부착·밀착 4단계와 동절기 시공까지 영상과 함께 정리한 실무 가이드.",
};

const conditions = [
  { k: "가능한 바닥", v: "아스팔트 · 콘크리트 등 단단하고 평활한 노면" },
  { k: "불가한 바닥", v: "맨 흙 · 자갈 · 탄성포장(우레탄·고무칩)" },
  { k: "노면 온도", v: "10℃ 이상에서 시공. 15~25℃가 가장 좋습니다" },
  { k: "수분", v: "물기·습기가 있으면 시공하지 않습니다. 마른 뒤 진행" },
  { k: "준비물", v: "시트 · 고무망치 · 빗자루(동절기에는 열풍기·프라이머·퍼티 추가)" },
];

const steps = [
  {
    n: "01",
    t: "위치 선정",
    d: "붙이기 전에 실제 자리에 대어 보고 보행 동선과 시선 방향을 확인합니다. 한 번 붙이면 옮기기 어려우므로 이 단계에서 충분히 결정하고, 가장자리에 표시를 남깁니다.",
  },
  {
    n: "02",
    t: "청소",
    d: "모래·먼지·작은 돌을 쓸어내고 기름기는 닦아냅니다. 이물질이 남은 자리부터 들뜨기 시작하므로, 부착력의 대부분이 이 단계에서 결정됩니다.",
  },
  {
    n: "03",
    t: "이형지 제거 후 부착",
    d: "뒷면 이형지를 벗기고 표시해 둔 자리에 한쪽 끝부터 천천히 붙입니다. 가운데에서 바깥으로 쓸어내리듯 눌러 공기를 빼고, 큰 시트는 두 사람이 양쪽을 잡습니다.",
  },
  {
    n: "04",
    t: "고무망치 밀착",
    d: "노면의 요철을 따라 붙도록 두드립니다. 들뜸은 늘 가장자리에서 시작되므로 모서리와 가장자리를 특히 꼼꼼히 두드립니다.",
  },
];

const winter = [
  { k: "적용 시기", v: "11월 중순 ~ 3월 중순" },
  { k: "① 가열", v: "청소 후 노면이 10℃ 아래면 온풍기·열풍기로 바닥을 데웁니다. 토치는 거리를 두고 쓸어가며 건조 용도로만." },
  { k: "② 프라이머", v: "데운 노면에 프라이머를 도포합니다(융착식 기준 1ℓ당 약 2㎡)." },
  { k: "③ 2차 밀착", v: "1차로 붙인 뒤 고무망치로 다시 한 번 밀착시킵니다." },
  { k: "④ 퍼티 마무리", v: "가장자리를 퍼티로 마감하면 추위에도 들뜨지 않습니다." },
];

const faqs = [
  {
    q: "붙인 뒤 언제부터 차가 지나가도 되나요?",
    a: "점착제가 자리를 잡는 동안 통행을 늦추는 것이 좋습니다. 차량이 지나는 자리라면 24~48시간 정도 여유를 두시길 권합니다. 다음 날 가장자리를 한 번 더 눌러 확인하면 더 오래갑니다.",
  },
  {
    q: "미끄럽지 않나요?",
    a: "표면 미끄럼저항은 46BPN으로 서울시 기준(45 이상)을 넘습니다. 보행 구간과 차량 통행 구간 모두에 적용하고 있습니다.",
  },
  {
    q: "얼마나 오래 유지되나요?",
    a: "현장 조건에 따라 6개월에서 1년 이상 유지됩니다. 마모가 진행되면 점검 후 부분 보수하거나 새 그래픽으로 교체할 수 있습니다.",
  },
  {
    q: "철거하면 바닥에 자국이 남나요?",
    a: "끈적임 없이 깨끗하게 떨어집니다. 페인트로 칠한 것이 아니라 인쇄된 시트를 부착한 방식이라, 교체와 원상복구가 쉽습니다.",
  },
  {
    q: "직접 붙이기 어려운 현장은 어떻게 하나요?",
    a: "퍼블릭아이디가 실측부터 제작·시공까지 진행합니다. 시공 후 정기 점검·보수가 필요하시면 안전시설관리 구독으로도 이용하실 수 있습니다.",
  },
];

const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "친환경 그래픽 노면표시재 부착 방법",
  description:
    "인쇄된 점착식 노면 그래픽 시트를 바닥에 부착하는 표준 시공 절차. 바닥 조건과 노면 온도를 확인한 뒤 위치 선정·청소·부착·밀착 4단계로 진행합니다.",
  totalTime: "PT30M",
  tool: [
    { "@type": "HowToTool", name: "고무망치" },
    { "@type": "HowToTool", name: "빗자루" },
  ],
  supply: [{ "@type": "HowToSupply", name: "친환경 그래픽 노면표시재 시트" }],
  step: steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.t,
    text: s.d,
  })),
};

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map((f) => ({
    "@type": "Question",
    name: f.q,
    acceptedAnswer: { "@type": "Answer", text: f.a },
  })),
};

export default function GuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <PageHero
        eyebrow="Install Guide"
        title={
          <>
            칠하지 않고
            <br />
            붙입니다
          </>
        }
        description="친환경 그래픽 노면표시재는 인쇄된 점착식 시트입니다. 어디에, 어떤 순서로 붙이는지 영상과 함께 정리했습니다."
      />

      {/* 영상 */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <div className="grid items-start gap-10 lg:grid-cols-[1fr_360px] lg:gap-16">
              <div className="overflow-hidden rounded-2xl border border-line bg-white/60">
                <video
                  className="block aspect-video w-full"
                  src="/guide/attach-guide.mp4"
                  poster="/guide/attach-guide-poster.jpg"
                  controls
                  preload="none"
                  playsInline
                />
              </div>
              <div className="lg:pt-2">
                <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
                  Video
                </p>
                <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-ink sm:text-[28px]">
                  부착 과정 전체 보기
                </h2>
                <p className="mt-3 leading-relaxed text-ink-soft">
                  바닥 조건과 온도 확인부터 기본 4단계, 동절기 시공까지 3분 40초에 담았습니다.
                  현장 담당자·시공팀에게 링크로 그대로 전달하실 수 있습니다.
                </p>
                <div className="mt-8">
                  <Button href="/guide/attach-guide.pdf" variant="outline" size="md" external>
                    가이드 PDF 내려받기
                  </Button>
                </div>
              </div>
            </div>
          </Reveal>
        </Container>
      </section>

      {/* 시공 전 확인 */}
      <section className="bg-cloud py-20 sm:py-28">
        <Container>
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Before You Start
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              시공 전 확인할 것
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              부착 실패의 대부분은 바닥과 온도에서 갈립니다. 아래 다섯 가지만 먼저 확인하세요.
            </p>
          </Reveal>
          <Reveal className="mt-12">
            <dl className="divide-y divide-line border-y border-line">
              {conditions.map((c) => (
                <div key={c.k} className="grid gap-2 py-5 sm:grid-cols-[200px_1fr] sm:gap-8">
                  <dt className="font-semibold text-ink">{c.k}</dt>
                  <dd className="leading-relaxed text-ink-soft">{c.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* 기본 4단계 */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              4 Steps
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              기본 4단계
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              따뜻한 계절이라면 이 네 단계로 시공이 끝납니다.
            </p>
          </Reveal>
          <ol className="mt-12 space-y-px">
            {steps.map((s, i) => (
              <Reveal key={s.n} delay={i * 70}>
                <li className="grid gap-3 border-t border-line py-8 sm:grid-cols-[88px_1fr] sm:gap-10">
                  <span className="font-display text-2xl font-bold text-teal-700">{s.n}</span>
                  <div>
                    <h3 className="text-xl font-bold text-ink">{s.t}</h3>
                    <p className="mt-3 max-w-3xl leading-relaxed text-ink-soft">{s.d}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      {/* 동절기 */}
      <section className="bg-cloud py-20 sm:py-28">
        <Container>
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              Winter
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              추운 계절의 시공
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink-soft">
              점착제는 차가우면 굳어 노면에 완전히 닿지 못합니다. 겨울에는 아래 단계가 더해집니다.
            </p>
          </Reveal>
          <Reveal className="mt-12">
            <dl className="divide-y divide-line border-y border-line">
              {winter.map((w) => (
                <div key={w.k} className="grid gap-2 py-5 sm:grid-cols-[200px_1fr] sm:gap-8">
                  <dt className="font-semibold text-ink">{w.k}</dt>
                  <dd className="leading-relaxed text-ink-soft">{w.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </Container>
      </section>

      {/* FAQ */}
      <section className="py-20 sm:py-28">
        <Container>
          <Reveal>
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              FAQ
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              자주 묻는 질문
            </h2>
          </Reveal>
          <dl className="mt-12 divide-y divide-line border-y border-line">
            {faqs.map((f, i) => (
              <Reveal key={f.q} delay={i * 60}>
                <div className="grid gap-3 py-7 sm:grid-cols-[minmax(0,340px)_1fr] sm:gap-10">
                  <dt className="text-lg font-bold leading-snug text-ink">{f.q}</dt>
                  <dd className="max-w-3xl leading-relaxed text-ink-soft">{f.a}</dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </Container>
      </section>

      {/* CTA */}
      <section className="bg-navy py-20 text-white sm:py-28">
        <Container>
          <Reveal className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              현장 시공까지 맡기고 싶으시면
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-white/70">
              실측부터 제작·설치, 시공 후 점검·보수까지 진행합니다. 규격과 수량을 알려주시면 맞춤 견적을 드립니다.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Button href="/contact" variant="arch" size="lg">
                시공 문의하기
              </Button>
              <Button href="/subscribe" variant="light" size="lg">
                안전시설관리 구독 보기
              </Button>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
