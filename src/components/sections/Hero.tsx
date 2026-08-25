import Image from "next/image";
import Button from "@/components/Button";

// 2026-08-25 홈 리디자인 시안 — 참조: vestre(시공 사진 풀블리드)·toss(하단 대형 한글 타이포)
// 원칙: 주인공은 시공 실사진 하나, 메시지 한 줄, CTA 두 개까지. 인증 칩은 TrustBar가 맡는다.
export default function Hero() {
  return (
    <section className="relative min-h-[82vh] w-full overflow-hidden bg-navy">
      <Image
        src="/products/친환경그래픽노면표시재/참조16.jpg"
        alt="퍼블릭아이디가 시공한 생태놀이 노면 그래픽 위에서 아이가 뛰어노는 모습"
        fill
        priority
        sizes="100vw"
        className="object-cover object-[24%_10%]"
      />
      {/* 하단 텍스트 가독을 위한 그라디언트 — 사진을 죽이지 않는 최소치 */}
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/30 to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto max-w-[1200px] px-5 pb-14 pt-24 sm:px-8 sm:pb-20">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-lime">
            Design for Public
          </p>
          <h1 className="mt-4 max-w-3xl break-keep text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl lg:text-[60px]">
            거리에 붙이는 디자인이
            <br />
            일상을 바꿉니다.
          </h1>
          <p className="mt-5 max-w-xl break-keep text-lg leading-relaxed text-white/80">
            친환경 노면표시부터 매달 도착하는 디자인 구독까지 — 공공과 작은
            회사의 디자인 파트너, 퍼블릭아이디.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button href="/contact" variant="arch" size="lg">
              구독 상담
            </Button>
            <a
              href="/products"
              className="inline-flex h-12 items-center justify-center rounded-full border border-white/40 px-6 text-[15px] font-semibold text-white transition hover:bg-white/10"
            >
              제품 보기
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
