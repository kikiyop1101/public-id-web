import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "개인정보처리방침",
  alternates: { canonical: "/privacy" },
  description:
    "주식회사 퍼블릭아이디 개인정보처리방침 — 수집 항목, 이용 목적, 보유 기간, 처리 위탁, 정보주체의 권리.",
};

const sections: { h: string; body: (string | string[])[] }[] = [
  {
    h: "1. 수집하는 개인정보 항목 및 수집 방법",
    body: [
      "회사는 다음과 같이 최소한의 개인정보를 수집합니다.",
      [
        "문의하기 양식: 이름(회사명), 이메일, 연락처, 문의 내용",
        "AI 도우미: 이용자가 입력한 대화 내용",
        "자동 수집: 접속 기록, 브라우저 정보 등 서비스 이용 과정에서 생성되는 정보",
      ],
    ],
  },
  {
    h: "2. 개인정보의 이용 목적",
    body: [
      [
        "문의 접수 및 상담, 견적 안내 등 요청 사항 처리",
        "AI 도우미 답변 생성 및 서비스 품질 개선",
        "서비스 운영 통계 분석 및 보안(부정 이용 방지)",
      ],
    ],
  },
  {
    h: "3. 개인정보의 보유 및 이용 기간",
    body: [
      "수집 목적이 달성되면 지체 없이 파기합니다. 다만 소비자 불만 및 분쟁 처리에 관한 기록은 관계 법령(전자상거래법)에 따라 3년간 보관합니다.",
    ],
  },
  {
    h: "4. 개인정보의 제3자 제공",
    body: [
      "회사는 이용자의 개인정보를 제3자에게 제공하지 않습니다. 다만 법령에 근거한 요청이 있는 경우는 예외로 합니다.",
    ],
  },
  {
    h: "5. 개인정보 처리의 위탁",
    body: [
      "서비스 운영을 위해 다음 업무를 외부 전문 업체에 위탁하고 있으며, 위탁 계약 시 개인정보 보호 관련 법규 준수를 요구하고 있습니다.",
      [
        "웹사이트 호스팅: Vercel Inc.",
        "문의 메일 전송: 이메일 전송 대행 서비스",
        "AI 도우미 응답 처리: Anthropic (대화 내용 처리)",
      ],
    ],
  },
  {
    h: "6. 정보주체의 권리와 행사 방법",
    body: [
      "이용자는 언제든지 자신의 개인정보에 대한 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다. 아래 연락처로 요청하시면 지체 없이 조치합니다.",
    ],
  },
  {
    h: "7. 개인정보의 파기 절차 및 방법",
    body: [
      "보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 전자적 파일 형태의 경우 복구할 수 없는 방법으로 영구 삭제하고, 그 밖의 기록물은 분쇄 또는 소각하여 파기합니다.",
    ],
  },
  {
    h: "8. 개인정보의 안전성 확보 조치",
    body: [
      [
        "개인정보 접근 권한의 최소화",
        "통신 구간 암호화(HTTPS) 적용",
        "접속 기록 보관 및 점검",
      ],
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy Policy"
        title="개인정보처리방침"
        description="주식회사 퍼블릭아이디는 이용자의 개인정보를 소중히 다루며, 관계 법령을 준수합니다."
      />

      <section className="py-20 sm:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <div className="space-y-10">
              {sections.map((s) => (
                <div key={s.h}>
                  <h2 className="text-lg font-bold text-ink">{s.h}</h2>
                  {s.body.map((b, i) =>
                    Array.isArray(b) ? (
                      <ul
                        key={i}
                        className="mt-3 list-disc space-y-1.5 pl-5 text-sm leading-relaxed text-ink-soft"
                      >
                        {b.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </ul>
                    ) : (
                      <p
                        key={i}
                        className="mt-3 text-sm leading-relaxed text-ink-soft"
                      >
                        {b}
                      </p>
                    ),
                  )}
                </div>
              ))}

              <div className="rounded-3xl border border-line bg-cloud/50 p-8">
                <h2 className="text-lg font-bold text-ink">
                  9. 개인정보 보호책임자
                </h2>
                <dl className="mt-4 space-y-1.5 text-sm leading-relaxed text-ink-soft">
                  <div>
                    <dt className="inline font-medium text-ink">책임자: </dt>
                    <dd className="inline">{site.ceo} (대표)</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-ink">이메일: </dt>
                    <dd className="inline">{site.email}</dd>
                  </div>
                  <div>
                    <dt className="inline font-medium text-ink">전화: </dt>
                    <dd className="inline">{site.tel}</dd>
                  </div>
                </dl>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft">
                  본 방침은 2026년 7월 24일부터 시행됩니다. 내용이 변경되는 경우
                  본 페이지를 통해 고지합니다.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
