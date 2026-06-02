import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

const steps = [
  {
    n: "01",
    title: "구독 신청 & 브랜드 진단",
    desc: "간단한 상담으로 업종·목표·톤앤매너를 함께 정리합니다.",
  },
  {
    n: "02",
    title: "마스코트 & 디자인 시스템 제작",
    desc: "전용 캐릭터와 로고·컬러·템플릿 키트를 설계합니다.",
  },
  {
    n: "03",
    title: "매월 콘텐츠 전달",
    desc: "웹툰·홍보물·디자인 에셋을 매월 정기적으로 받습니다.",
  },
  {
    n: "04",
    title: "정기 안전 관리 (선택)",
    desc: "노면표시·안전표지를 주기적으로 점검하고 교체합니다.",
  },
];

export default function HowItWorks() {
  return (
    <section className="bg-cloud py-20 sm:py-28">
      <Container>
        <Reveal className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            How it works
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            신청부터 정기 관리까지, 네 단계
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            복잡한 과정 없이, 상담 한 번으로 시작합니다.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 80}>
              <div className="h-full rounded-2xl border border-line bg-white p-6">
                <span className="font-display text-3xl font-bold text-arch">
                  {s.n}
                </span>
                <h3 className="mt-3 font-bold text-ink">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                  {s.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
