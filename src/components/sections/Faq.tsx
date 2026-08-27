import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

const faqs = [
  {
    q: "디자인 구독을 시작하면 무엇을 받나요?",
    a: "홈페이지 제작, 전용 마스코트, 매월 웹툰, 로고·컬러·템플릿이 담긴 디자인 시스템(BrandDNA), AI 자동화 키트, 그리고 월 정기 디자인(요청 시 1회 기준)과 SNS 홍보물 템플릿까지. 디자인 팀이 없어도 매달 완성된 브랜드 콘텐츠를 받아 보실 수 있습니다.",
  },
  {
    q: "디자인 구독을 하면 홈페이지도 만들어 주나요?",
    a: "네. 구독으로 만든 디자인 시스템과 제공해 드리는 자료(마스코트·로고·컬러·템플릿)를 그대로 사용해 홈페이지까지 제작해 드립니다. 브랜드 정본에서 출발하기 때문에 명함부터 홈페이지까지 한눈에 같은 회사로 보입니다.",
  },
  {
    q: "디자인 인력이 없는 작은 회사도 이용할 수 있나요?",
    a: "네. 구독형 디자인 서비스는 디자인 담당자가 없는 소상공인과 작은 회사를 위해 설계되었습니다. 복잡한 과정 없이 상담 한 번으로 시작하고, 매달 바로 쓸 수 있는 콘텐츠를 정기적으로 전달해 드립니다.",
  },
  {
    q: "전용 마스코트는 어떻게 제작되나요?",
    a: "브랜드 진단을 통해 업종과 가치를 파악한 뒤, 귀사만의 전용 캐릭터를 설계합니다. 완성된 마스코트는 웹툰·SNS·광고 등 다양한 콘텐츠로 확장되어 고객과 브랜드의 이야기를 전합니다. 퍼블릭아이디의 마스코트 '퍼이'가 좋은 예시입니다.",
  },
  {
    q: "안전·시설 관리 구독은 어디까지 포함되나요?",
    a: "노란발자국·노란볼라드 등 친환경 노면표시재와 안전표지의 제작·시공부터, 주기적인 점검·교체, CPTED(범죄 예방) 기반 안전 디자인 제안까지 정기적으로 관리해 드립니다.",
  },
  {
    q: "디자인 구독과 안전·시설 관리, 하나만 이용할 수도 있나요?",
    a: "네. 두 가지 구독은 따로 또 같이 이용하실 수 있습니다. 필요한 구독만 선택하셔도 되고, 디자인과 안전 관리를 함께 구독하시면 브랜드와 현장을 한 번에 관리할 수 있습니다.",
  },
  {
    q: "구독 없이 노면표시·안전표지 시공만 단건으로 의뢰할 수 있나요?",
    a: "가능합니다. 정기 구독 외에 단건 제작·시공도 진행하고 있으니, 필요하신 내용을 문의해 주시면 맞춤 견적을 안내해 드립니다.",
  },
];

export default function Faq() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <section className="bg-cloud py-20 sm:py-28">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            FAQ
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            자주 묻는 질문
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            구독 서비스에 대해 자주 궁금해하시는 점을 모았습니다.
          </p>
        </Reveal>

        <div className="mx-auto mt-12 max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {faqs.map((f, i) => (
            <Reveal key={f.q} delay={i * 60}>
              <details className="group" open={i === 0}>
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 font-semibold text-ink [&::-webkit-details-marker]:hidden">
                  <span>{f.q}</span>
                  <svg
                    className="h-5 w-5 shrink-0 text-teal transition-transform duration-300 group-open:rotate-45"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    aria-hidden
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="-mt-1 px-6 pb-6 leading-relaxed text-ink-soft">
                  {f.a}
                </p>
              </details>
            </Reveal>
          ))}
        </div>

        <Reveal className="mx-auto mt-8 max-w-3xl text-center">
          <p className="text-ink-soft">
            더 궁금한 점이 있으신가요?{" "}
            <a
              href="/contact"
              className="link-underline font-semibold text-teal-700"
            >
              문의하기 →
            </a>
          </p>
        </Reveal>
      </Container>
    </section>
  );
}
