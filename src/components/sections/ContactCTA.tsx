import Container from "@/components/Container";
import Button from "@/components/Button";
import { site } from "@/lib/site";

// 2026-08-26 업그레이드 — 아치 밴드 유지하되 글자·버튼을 네이비로 반전.
// 흰 글자는 라임 구간에서 대비가 무너진다(WCAG 미달) — 네이비는 전 구간 판독됨.
// 참조: vestre(노랑 면 + 검정 글자를 시그니처로 쓰는 같은 논리).
export default function ContactCTA() {
  return (
    <section className="relative overflow-hidden bg-arch">
      <Container className="flex flex-col items-center gap-6 py-16 text-center sm:py-20">
        <h2 className="max-w-2xl break-keep text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">
          안전한 거리도, 우리 브랜드도
          <br />
          상담 한 번이면 시작됩니다
        </h2>
        <p className="max-w-2xl break-keep text-navy/80">
          상담은 무료입니다. 문의를 남겨주시면 영업일 기준 빠르게 답변드립니다 —
          전국 어디든 시공합니다.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Button href="/contact" variant="navy">
            상담·견적 문의
          </Button>
          <a
            href={`tel:${site.tel}`}
            className="inline-flex h-12 items-center justify-center rounded-full border border-navy/50 px-6 text-[15px] font-semibold text-navy transition hover:bg-navy hover:text-white"
          >
            전화 {site.tel}
          </a>
        </div>
      </Container>
    </section>
  );
}
