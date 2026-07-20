import type { Metadata } from "next";
import Link from "next/link";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "인증·특허",
  alternates: { canonical: "/credentials" },
  description:
    "특허 제10-1974029호, GREENGUARD GOLD, 노란발자국 상표등록, 인증 사회적기업·우수디자인(GD) 등 — 특허와 인증으로 검증된 퍼블릭아이디.",
};

const groups = [
  {
    label: "특허 · 지식재산",
    items: [
      { t: "특허 제10-1974029호", d: "도로 노면 표시용 조성물 및 시공방법 (2019)" },
      { t: "노란발자국 상표등록", d: "제40-1257164호" },
      { t: "국제특허 보유", d: "유럽특허 EP 1 677 974 · 유럽특허청(EPO) 등록" },
    ],
  },
  {
    label: "친환경 · 품질 인증",
    items: [
      { t: "GREENGUARD GOLD", d: "UL 2818 저휘발성 친환경 인증" },
      { t: "KCL · SGS · KTR · KFI", d: "미끄럼저항 · 유해물질 불검출 · 방염성능 시험성적" },
      { t: "KC 인증", d: "국가통합인증" },
    ],
  },
  {
    label: "기업 인증 · 수상",
    items: [
      { t: "인증 사회적기업", d: "고용노동부 인증 (2020)" },
      { t: "e-스토어36.5+ 지정업체", d: "사회적기업 가치장터 (2020)" },
      { t: "KIDP 종합산업디자인전문회사", d: "한국디자인진흥원 (시각 · 포장 · 환경)" },
      { t: "우수디자인(GD) · 우수특허대상", d: "디자인 · 특허 수상" },
    ],
  },
];

const company: [string, string][] = [
  ["대표", site.ceo],
  ["사업자등록번호", site.bizRegNo],
  ["통신판매업 신고", site.mailOrderNo],
  ["소재지", `(${site.zip}) ${site.address}`],
];

export default function CredentialsPage() {
  return (
    <>
      <PageHero
        eyebrow="Credentials"
        title={
          <>
            특허와 인증으로
            <br />
            검증된 전문성
          </>
        }
        description="자체 특허 기술과 국내외 친환경·품질 인증으로, 공공기관·지자체가 안심하고 함께합니다."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="grid gap-6 md:grid-cols-3">
            {groups.map((g, gi) => (
              <Reveal key={g.label} delay={gi * 80}>
                <div className="h-full rounded-3xl border border-line bg-white p-7 shadow-sm">
                  <div className="h-1.5 w-12 rounded-full bg-arch" />
                  <h3 className="mt-4 text-lg font-bold text-ink">{g.label}</h3>
                  <ul className="mt-5 space-y-4">
                    {g.items.map((it) => (
                      <li
                        key={it.t}
                        className="border-b border-line pb-4 last:border-0 last:pb-0"
                      >
                        <p className="font-semibold leading-snug text-ink">
                          {it.t}
                        </p>
                        <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                          {it.d}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal className="mt-12">
            <div className="rounded-3xl border border-line bg-cloud/50 p-8 sm:p-10">
              <h3 className="font-display text-sm font-semibold uppercase tracking-[0.16em] text-teal-700">
                Company
              </h3>
              <p className="mt-2 text-2xl font-bold text-ink">{site.legalName}</p>
              <dl className="mt-6 grid gap-x-8 gap-y-1 sm:grid-cols-2">
                {company.map(([k, v]) => (
                  <div key={k} className="flex gap-4 border-b border-line py-3">
                    <dt className="w-28 shrink-0 text-sm font-medium text-ink-soft">
                      {k}
                    </dt>
                    <dd className="whitespace-pre-line text-sm leading-relaxed text-ink">{v}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm text-ink-soft">
                특허·인증서 사본 및 시공 실적 자료는{" "}
                <Link href="/contact" className="font-semibold text-teal-700">
                  문의
                </Link>{" "}
                주시면 제공해 드립니다.
              </p>
            </div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
