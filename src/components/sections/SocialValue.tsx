import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { Leaf, Shield, Sparkle } from "@/components/icons";

const pillars = [
  {
    icon: Leaf,
    title: "친환경",
    desc: "환경을 생각한 그래픽 표시재와 소재로 제작·시공합니다.",
  },
  {
    icon: Shield,
    title: "안전 · 공공",
    desc: "어린이와 보행자의 안전을 최우선으로 디자인합니다.",
  },
  {
    icon: Sparkle,
    title: "윤리적 가치",
    desc: "사회적기업으로서 디자인의 사회적 책임을 실천합니다.",
  },
];

export default function SocialValue() {
  return (
    <section id="about" className="bg-navy py-20 text-white sm:py-28">
      <Container>
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-8">
          <Reveal className="lg:col-span-5">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">
              About
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
              디자인으로
              <br />
              공공의 가치를 만듭니다
            </h2>
            <p className="mt-5 max-w-md leading-relaxed text-white/65">
              퍼블릭아이디는 KIDP 인증 종합산업디자인전문회사이자 인증
              사회적기업입니다. 안전한 보행환경과 작은 브랜드의 성장을 디자인으로
              함께 만듭니다.
            </p>
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-white/80">
              <span className="h-2 w-2 rounded-full bg-arch" />
              윤리적 가치를 담은 사회적기업
            </p>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-7">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 80}>
                  <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-arch text-white">
                      <Icon className="h-6 w-6" />
                    </span>
                    <h3 className="mt-5 text-lg font-bold">{p.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-white/60">
                      {p.desc}
                    </p>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
