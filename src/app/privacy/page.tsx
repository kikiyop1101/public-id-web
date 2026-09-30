import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import { site } from "@/lib/site";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = pageMeta({
  title: "개인정보처리방침",
  description:
    "주식회사 퍼블릭아이디 개인정보처리방침 — 수집 항목, 이용 목적, 보유 기간, 처리 위탁, 국외 이전, 쿠키, 정보주체의 권리.",
  path: "/privacy",
});

const sections: { h: string; body: (string | string[])[] }[] = [
  {
    h: "1. 수집하는 개인정보 항목 및 수집 방법",
    body: [
      "회사는 다음과 같이 최소한의 개인정보를 수집합니다.",
      [
        "문의하기 양식: 이름(회사명), 이메일, 연락처(선택), 문의 내용",
        "구독·견적 신청 양식: 이름(담당자명), 이메일, 기관·회사명(선택), 연락처(선택), 관심 제품(선택), 요청 내용",
        "우리 학교 앞 안전 리포트 제보: 현장 사진(사진의 위치 정보는 올리기 전에 자동으로 지웁니다), 위험 유형과 설명, 위치(지도 핀 좌표 또는 위치 설명), 이름·별명(선택), 이메일·연락처(선택)",
        "게시판: 닉네임, 비밀번호(원문이 아닌 해시값으로 저장), 글 제목과 내용, 답글의 닉네임과 내용",
        "AI 도우미·우리회사OS 키트 추천: 이용자가 입력한 대화·고민 내용",
        "제안 메일 열람 확인: 회사가 보낸 제안 메일을 열었는지, 메일 속 제안서 링크에 접속했는지(메일별 식별값, 브라우저 정보)",
        "자동 수집: 접속 기록, IP 주소, 브라우저 정보, 유입 경로, 쿠키와 이용 행태 정보(방문한 페이지, 머문 시간 등)",
      ],
      "개인정보는 이용자가 양식에 직접 입력해 제출할 때와 사이트를 이용하는 과정에서 자동으로 수집됩니다.",
    ],
  },
  {
    h: "2. 개인정보의 이용 목적",
    body: [
      [
        "문의 접수 및 상담, 구독·견적 신청 접수와 회신 등 요청 사항 처리",
        "안전 리포트 제보 검토와 지도 게시(공개 지도에는 대략적인 위치만 표시), 개선 소식 안내",
        "게시판 운영(본인 글 삭제 확인 포함)",
        "AI 도우미·키트 추천 답변 생성 및 서비스 품질 개선",
        "제안 메일 발송 결과 확인",
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
        "웹사이트 호스팅과 방문 통계: Vercel Inc.",
        "데이터베이스·파일 저장(문의·신청 내용, 제보 내용과 사진, 게시판 글): Supabase Inc.",
        "문의·신청·제보 접수 메일 전송: Web3Forms(운영사 Web3Creative)",
        "AI 도우미·키트 추천 응답 처리: Anthropic PBC (입력한 대화 내용 처리)",
        "방문·이용 통계 분석: Google LLC(Google Analytics 4), Microsoft Corporation(Clarity)",
        "담당자 접수 알림 전달(신청·제보): Telegram Messenger Inc.(메신저 알림)",
        "문의 접수 자동 처리(내용 분류와 응대 준비): Hostinger International Ltd.(회사 업무 자동화 서버 호스팅), OpenAI OpCo, LLC(AI 처리)",
      ],
    ],
  },
  {
    h: "6. 개인정보의 국외 이전",
    body: [
      "위 5번의 위탁 업체는 국외 사업자이므로, 「개인정보 보호법」 제28조의8에 따라 이전 내용을 다음과 같이 알립니다. 개인정보는 이용자가 양식을 제출하거나 사이트를 이용하는 시점에 암호화된 통신(HTTPS)으로 전송됩니다.",
      [
        "Vercel Inc.(미국, 문의 privacy@vercel.com): 접속 기록, 양식에 입력한 내용 — 웹사이트 호스팅과 서버 처리",
        "Supabase Inc.(호주 시드니 소재 클라우드 서버, 문의 privacy@supabase.com): 문의·신청 내용, 제보 내용과 사진, 게시판 글 — 저장·보관",
        "Anthropic PBC(미국, 문의 privacy@anthropic.com): AI 도우미·키트 추천에 입력한 내용 — 답변 생성",
        "Google LLC(미국, 문의 googlekrsupport@google.com): 쿠키, 방문한 페이지와 머문 시간 등 이용 행태 정보(IP 주소는 일부를 가려 처리) — 방문 통계 분석",
        "Microsoft Corporation(미국, 문의 https://go.microsoft.com/fwlink/?linkid=2126612): 화면 이용 행태 정보(클릭·스크롤 등) — 이용 방식 분석",
        "Web3Forms(운영사 Web3Creative, 인도 소재 — Amazon Web Services 등 여러 지역의 클라우드 서버에서 처리, 문의 support@web3forms.com): 문의·신청에 입력한 이름, 연락처, 내용과 안전 리포트 제보의 이름·위치·내용 — 접수 메일 전송(사업자 방침상 제출 내용은 최대 3년 뒤 자동 삭제)",
        "Telegram Messenger Inc.(서버 소재 국가는 사업자가 공개하지 않음, 문의 절차 https://telegram.org/privacy): 신청·제보 접수 알림에 담긴 이름, 연락처, 내용 — 담당자 알림",
        "Hostinger International Ltd.(말레이시아 쿠알라룸푸르 소재 서버, 문의 gdpr@hostinger.com): 문의 양식에 입력한 이름, 연락처, 내용 — 회사 업무 자동화 서버 운영",
        "OpenAI OpCo, LLC(미국, 문의 privacy@openai.com): 문의 양식에 입력한 이름, 연락처, 내용 — 문의 분류와 응대 준비(장애 때는 Anthropic PBC 등 예비 AI 서비스가 대신 처리할 수 있습니다)",
      ],
      "이전받는 자의 보유·이용 기간은 회사의 보유 기간(위 3번)과 각 사업자의 방침에 따릅니다.",
      `국외 이전을 원하지 않으시면 온라인 양식과 AI 도우미를 이용하지 않고 전화(${site.tel}) 또는 이메일(${site.email})로 문의하실 수 있습니다. 이 경우 온라인 접수와 AI 도우미 기능은 이용하실 수 없습니다.`,
    ],
  },
  {
    h: "7. 쿠키 등 자동 수집 장치의 설치·운영 및 거부",
    body: [
      "회사는 방문 통계를 내기 위해 쿠키와 브라우저 저장소를 사용합니다.",
      [
        "Google Analytics 4: 방문한 페이지, 머문 시간 등을 쿠키로 집계합니다(IP 주소는 일부를 가려 처리).",
        "Vercel Analytics: 쿠키 없이 방문한 페이지와 머문 시간 구간을 집계합니다.",
        "Microsoft Clarity: 화면을 어떻게 이용하는지(클릭·스크롤 등) 분석합니다.",
        "브라우저 저장소: 유입 경로(처음 들어온 링크의 꼬리표, 30일 보관), 위험 찾기 게임 기록, 안전 점수 진단 결과를 저장합니다. 게임 기록과 진단 결과는 이용자의 브라우저에만 남고 서버로 보내지 않습니다.",
      ],
      "브라우저 설정에서 쿠키 저장을 거부하거나 삭제할 수 있고, Google Analytics는 Google이 제공하는 차단 부가 기능(https://tools.google.com/dlpage/gaoptout)으로 거부할 수 있습니다. 거부하셔도 사이트 이용에는 제한이 없습니다.",
    ],
  },
  {
    h: "8. 정보주체의 권리와 행사 방법",
    body: [
      "이용자와 법정대리인은 언제든지 개인정보에 대한 열람, 정정, 삭제, 처리정지를 요구할 수 있습니다. 아래 연락처로 요청하시면 지체 없이 조치합니다.",
    ],
  },
  {
    h: "9. 개인정보의 파기 절차 및 방법",
    body: [
      "보유 기간이 경과하거나 처리 목적이 달성된 개인정보는 전자적 파일 형태의 경우 복구할 수 없는 방법으로 영구 삭제하고, 그 밖의 기록물은 분쇄 또는 소각하여 파기합니다.",
    ],
  },
  {
    h: "10. 개인정보의 안전성 확보 조치",
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
      <BreadcrumbLd trail={[{ name: "개인정보처리방침", path: "/privacy" }]} />
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
                  11. 개인정보 보호책임자
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
                  본 방침은 2026년 9월 30일부터 시행됩니다(이전 방침 시행일:
                  2026년 7월 24일). 내용이 변경되는 경우 본 페이지를 통해
                  고지합니다.
                </p>
              </div>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
