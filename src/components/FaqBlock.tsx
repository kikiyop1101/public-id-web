// FAQ 블록 공용 (2026-09-08 AEO 감사) — 눈에 보이는 Q&A + FAQPage JSON-LD를 한 몸으로 낸다.
// AI 답변엔진·검색은 "질문 그대로 + 짧고 사실적인 답"을 인용하므로 답은 정본 사실(기준가·인증·시공 조건)만 담는다.
import Container from "@/components/Container";

export type FaqItem = { q: string; a: string };

// 답 문자열 속 전화번호는 줄바꿈 때 쪼개지지 않게 묶는다(JSON-LD 쪽 문자열은 그대로 둔다).
const PHONE = /(\(?\d{2,4}-\d{3,4}-\d{4}\)?)/g;
function renderAnswer(a: string) {
  return a.split(PHONE).map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="whitespace-nowrap">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function FaqBlock({
  eyebrow = "FAQ",
  title,
  intro,
  items,
  className = "bg-cloud",
}: {
  eyebrow?: string;
  title: string;
  intro?: string;
  items: FaqItem[];
  className?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
  return (
    <section className={`${className} cv-defer py-20 sm:py-28`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">{eyebrow}</p>
          <h2 className="mt-4 break-keep text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{title}</h2>
          {intro ? <p className="mt-4 break-keep text-lg text-ink-soft">{intro}</p> : null}
        </div>
        <div className="mx-auto mt-12 max-w-3xl divide-y divide-line overflow-hidden rounded-2xl border border-line bg-white">
          {items.map((f, i) => (
            <details key={f.q} className="group" open={i === 0}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-left font-semibold text-ink [&::-webkit-details-marker]:hidden">
                <span className="break-keep">{f.q}</span>
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
              <p className="-mt-1 break-keep px-6 pb-6 leading-relaxed text-ink-soft">{renderAnswer(f.a)}</p>
            </details>
          ))}
        </div>
      </Container>
    </section>
  );
}
