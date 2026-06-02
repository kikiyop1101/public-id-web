import Container from "@/components/Container";

const credentials = [
  "KIDP 종합산업디자인전문회사 (시각 · 포장 · 환경)",
  "인증 사회적기업",
  "우수디자인(GD) 선정",
  "세종 · 전국 시공",
];

export default function TrustBar() {
  return (
    <section className="border-y border-line bg-cloud/60">
      <Container className="flex flex-col items-center gap-4 py-6 sm:flex-row sm:justify-between">
        <p className="text-sm font-medium text-ink-soft">
          관공서 · 공공기관 · 기업 · 소상공인이 신뢰하는 디자인 파트너
        </p>
        <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
          {credentials.map((c) => (
            <li
              key={c}
              className="flex items-center gap-2 text-sm font-semibold text-navy"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-arch" />
              {c}
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
