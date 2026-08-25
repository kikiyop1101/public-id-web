import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { Leaf, Shield, Sparkle } from "@/components/icons";

// 2026-08-25 홈 리디자인 — MascotIntro + SocialValue 통합(섹션 다이어트 9→5).
// 네이비 반전 밴드 하나에 "회사의 가치 + 퍼이"를 함께 담는다. 섹션 메시지는 하나다.
const pillars = [
  { icon: Leaf, title: "친환경", desc: "환경을 생각한 소재로 제작·시공합니다." },
  { icon: Shield, title: "안전 · 공공", desc: "아이와 보행자의 안전을 먼저 디자인합니다." },
  { icon: Sparkle, title: "사회적기업", desc: "디자인의 사회적 책임을 실천합니다." },
];

export default function Story() {
  return (
    <section id="about" className="bg-navy py-20 text-white sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-7">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-100">
            Public Value
          </p>
          <h2 className="mt-4 max-w-xl break-keep text-3xl font-extrabold leading-[1.2] tracking-tight sm:text-4xl">
            디자인으로
            <br />
            공공의 가치를 만듭니다.
          </h2>
          <p className="mt-5 max-w-md break-keep leading-relaxed text-white/65">
            퍼블릭아이디는 KIDP 인증 종합산업디자인전문회사이자 인증
            사회적기업입니다. 안전한 보행환경과 작은 브랜드의 성장을 디자인으로
            함께 만듭니다.
          </p>
          <ul className="mt-9 grid gap-4 sm:grid-cols-3">
            {pillars.map((p, i) => {
              const Icon = p.icon;
              return (
                <Reveal key={p.title} delay={i * 80}>
                  <li className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-arch text-white">
                      <Icon className="h-5 w-5" />
                    </span>
                    <p className="mt-4 font-bold">{p.title}</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-white/60">
                      {p.desc}
                    </p>
                  </li>
                </Reveal>
              );
            })}
          </ul>
        </Reveal>

        {/* 퍼이 — 구독의 얼굴. 카드가 아니라 밴드 위에 서 있다 */}
        <Reveal className="lg:col-span-5" delay={120}>
          <div className="relative mx-auto max-w-sm text-center">
            <Image
              src="/mascot/pui-greet-clear.png"
              alt="퍼블릭아이디 마스코트 퍼이가 손을 흔들며 인사하는 모습"
              width={360}
              height={360}
              className="mx-auto w-[240px] drop-shadow-[0_16px_32px_rgba(0,0,0,0.35)] sm:w-[300px]"
            />
            <p className="mt-6 break-keep text-lg font-semibold">
              구독을 시작하면, 귀사에도
              <br />
              퍼이 같은 마스코트가 생깁니다.
            </p>
            <Link
              href="/subscribe"
              className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-lime transition hover:translate-x-0.5"
            >
              디자인 구독 알아보기 →
            </Link>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
