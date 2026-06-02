import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";

const traits = [
  { k: "Public-ID 모자", v: "어디서나 알아보는 브랜드 사인" },
  { k: "새싹", v: "친환경을 먼저 생각하는 마음" },
  { k: "타이벡 가방", v: "재활용 소재로 만든 시그니처" },
];

export default function MascotIntro() {
  return (
    <section id="mascot" className="relative overflow-hidden py-20 sm:py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute -left-[12%] top-1/2 h-[440px] w-[440px] -translate-y-1/2 rounded-full bg-arch opacity-[0.10] blur-[90px]"
      />
      <Container className="grid items-center gap-12 lg:grid-cols-12 lg:gap-10">
        <Reveal className="lg:col-span-5">
          <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[32px] border border-line bg-cloud">
            <Image
              src="/mascot/pui-wave.png"
              alt="퍼블릭아이디 마스코트 퍼이가 손을 흔들며 인사하는 모습"
              fill
              sizes="(min-width:1024px) 440px, 90vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <Reveal className="lg:col-span-7" delay={80}>
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Meet 퍼이
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            안녕하세요, 저는 <span className="text-arch">퍼이</span>예요
          </h2>
          <div className="mt-5 max-w-xl space-y-4 text-lg leading-relaxed text-ink-soft">
            <p className="font-semibold text-ink">
              디자인 구독을 시작하면, 브랜드에도 캐릭터가 생깁니다.
            </p>
            <p>
              친환경 새싹 모자와 재활용 타이벡 가방을 메고 다니는 퍼블릭아이디의
              마스코트 <b className="font-semibold text-ink">퍼이</b>처럼, 귀사만의
              브랜드 가치를 담은{" "}
              <b className="font-semibold text-ink">전용 마스코트</b>가 탄생합니다.
            </p>
            <p>
              그리고 그 마스코트는 웹툰, SNS, DTC Ads 등 다양한 콘텐츠 속에서
              고객과 만나며 브랜드의 이야기를 전합니다.
            </p>
          </div>
          <ul className="mt-8 grid gap-4 sm:grid-cols-3">
            {traits.map((t) => (
              <li
                key={t.k}
                className="rounded-2xl border border-line bg-white p-4"
              >
                <p className="font-semibold text-ink">{t.k}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {t.v}
                </p>
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
