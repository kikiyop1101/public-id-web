import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = {
  title: "회사소개",
  alternates: { canonical: "/about" },
  description:
    "2017년 세종에서 시작한 KIDP 종합산업디자인전문회사이자 인증 사회적기업 — 특허받은 부착식 노면표시재와 시험성적(46BPN·GREENGUARD GOLD)으로 공공 안전 디자인을 만들고, 디자인 구독으로 작은 조직의 디자인 파트너가 됩니다.",
};

const facts = [
  { k: "전문성", v: "KIDP 종합산업디자인전문회사 (시각 · 포장 · 환경)" },
  { k: "가치", v: "윤리적 가치를 담은 인증 사회적기업" },
  { k: "분야", v: "디자인 구독 · 친환경 그래픽 노면표시 · 안전시설관리" },
  { k: "거점", v: "세종특별자치시 · 전국 시공" },
];

const history = [
  { y: "2007", t: "디자인 전문 경력 시작", d: "시각 · 공간(환경) · 제품 디자인" },
  { y: "2017", t: "사업 등록 · 법인 설립", d: "주식회사 퍼블릭아이디" },
  { y: "2018", t: "직접생산확인 22종", d: "중소기업중앙회 인정\n인쇄사·출판사 외 다수 인증 및 등록" },
  { y: "2020", t: "인증 사회적기업", d: "고용노동부 인증\ne-스토어36.5+ 지정" },
  { y: "2026", t: "구독 서비스 런칭", d: "디자인 구독 서비스 시작" },
];

export default function AboutPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "회사소개", path: "/about" }]} />
      <PageHero
        eyebrow="About"
        title={
          <>
            디자인으로
            <br />
            공공의 가치를 만듭니다
          </>
        }
        description="안전한 보행환경과 작은 브랜드의 성장을 디자인으로 함께 만드는 회사, 퍼블릭아이디입니다."
      />

      <section className="py-20 sm:py-28">
        <Container className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-6">
            <h2 className="text-3xl font-extrabold leading-tight tracking-tight text-ink sm:text-[40px]">
              작은 표지 하나가
              <br />
              거리를 바꿉니다
            </h2>
            <div className="mt-6 space-y-4 text-lg leading-relaxed text-ink-soft">
              <p>
                퍼블릭아이디는 어린이 교통안전을 위한{" "}
                <b className="font-semibold text-ink">노란발자국</b>을 비롯해, 도시
                곳곳의 안전을 친환경 그래픽으로 풀어 온 산업디자인 전문회사입니다.
              </p>
              <p>
                공공과 민간을 잇는 친절한 디자인으로{" "}
                <b className="font-semibold text-ink">
                  아동·청소년·여성의 사회 문제
                </b>
                를 함께 풀고, 아이템 선정은 언제나 <b className="font-semibold text-ink">안전과 친환경</b>을
                최우선으로 합니다.
              </p>
              <p>
                그 전문성을 이제 작은 브랜드를 위한{" "}
                <b className="font-semibold text-ink">디자인 구독</b>으로 넓혀가고
                있습니다. 디자인이 만드는 안전과 가치를, 더 많은 곳에 더 가까이.
              </p>
            </div>
          </Reveal>

          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-6">
            {facts.map((f, i) => (
              <Reveal key={f.k} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-cloud/60 p-6">
                  <p className="font-display text-xs font-semibold uppercase tracking-[0.16em] text-teal-700">
                    {f.k}
                  </p>
                  <p className="mt-3 font-semibold leading-relaxed text-ink">
                    {f.v}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="history" className="border-y border-line bg-cloud/50 py-20 sm:py-24">
        <Container>
          <Reveal className="max-w-2xl">
            <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
              History
            </p>
            <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
              걸어온 길
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {history.map((h, i) => (
              <Reveal key={h.y} delay={i * 80}>
                <div className="h-full rounded-2xl border border-line bg-white p-6">
                  <p className="font-display text-2xl font-bold text-arch">{h.y}</p>
                  <h3 className="mt-3 font-bold text-ink">{h.t}</h3>
                  <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-ink-soft">
                    {h.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

    </>
  );
}
