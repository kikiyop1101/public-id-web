import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import Button from "@/components/Button";
import { Check } from "@/components/icons";
import { cn } from "@/lib/cn";

const tiers = [
  {
    name: "Basic",
    tagline: "1인 · 소상공인 시작용",
    price: "1,100,000원",
    period: "/ 년",
    features: [
      "전용 마스코트 1종",
      "월 1편 웹툰",
      "기본 로고 · 컬러 가이드",
      "SNS 프로필 키트",
    ],
    renew: "월 88,000원",
    highlight: false,
  },
  {
    name: "Standard",
    tagline: "성장하는 브랜드 · 회사",
    price: "4,000,000원",
    period: "/ 년",
    features: [
      "디자인 시스템",
      "마스코트 + 표정·포즈 변형",
      "월 1편 웹툰",
      "DTC Ads · SNS·홍보용 템플릿",
      "월 1회 디자인 요청",
      "디자인 원본 파일 제공",
    ],
    renew: "월 99,000원",
    highlight: true,
  },
  {
    name: "Premium",
    tagline: "안전 관리까지 결합",
    price: "맞춤 견적",
    period: "/ 년",
    features: [
      "Standard 전체 포함",
      "전담 디자이너 배정",
      "디자인 요청 우선 대응",
      "전용 관리 App & 유지보수",
      "노면표시 · 안전 시설 정기 관리",
    ],
    renew: "맞춤 견적",
    highlight: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="bg-cloud py-20 sm:py-28">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Plans
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            브랜드 규모에 맞는 구독 플랜
          </h2>
          <p className="mt-4 text-lg text-ink-soft">
            연 단위 구독 플랜입니다. 1년 이후에는 합리적인 월 요금으로 연장할 수
            있습니다.
          </p>
        </Reveal>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, idx) => (
            <Reveal key={t.name} delay={idx * 80}>
              <article
                className={cn(
                  "relative flex h-full flex-col rounded-3xl border bg-white p-8",
                  t.highlight
                    ? "border-teal shadow-xl shadow-teal/10"
                    : "border-line",
                )}
              >
                {t.highlight && (
                  <span className="absolute -top-3 left-8 rounded-full bg-arch px-3 py-1 text-xs font-semibold text-white">
                    인기
                  </span>
                )}
                <h3 className="font-display text-xl font-bold text-ink">
                  {t.name}
                </h3>
                <p className="mt-1 text-sm text-ink-soft">{t.tagline}</p>
                <p className="mt-5 text-2xl font-extrabold text-ink">
                  {t.price}
                  <span className="ml-1 text-sm font-medium text-ink-soft">
                    {t.period}
                  </span>
                </p>
                <ul className="mt-6 flex-1 space-y-3">
                  {t.features.map((f) => (
                    <li key={f} className="flex gap-2.5 text-sm text-ink">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                      {f}
                    </li>
                  ))}
                </ul>
                <div className="mt-6 rounded-xl border border-line bg-cloud/70 p-4">
                  <div className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-semibold text-ink">1년 이후 월 연장</span>
                    <span className="font-bold text-teal-700">{t.renew}</span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-soft">
                    최초 1년 구독이 끝난 다음 달부터 적용됩니다.
                  </p>
                </div>
                <div className="mt-6">
                  <Button
                    href="/contact"
                    variant={t.highlight ? "arch" : "outline"}
                    className="w-full"
                  >
                    상담 신청
                  </Button>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
