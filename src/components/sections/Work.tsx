import Image, { getImageProps } from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
import LazyVideo from "@/components/LazyVideo";
import { cn } from "@/lib/cn";

type WorkItem = {
  img: string;
  title: string;
  desc: string;
  tag?: string;
  video?: string;
};

const works: WorkItem[] = [
  {
    img: "/work/gen-contents.png",
    video: "/work/gen-contents.mp4",
    title: "Contents",
    desc: "횡단보도 앞 안전보행, 아이들의 안전한 놀이공간, 금연표지를 비롯한 표지 등을 유도하는 노면 그래픽.",
    tag: "대표 사업",
  },
  {
    img: "/work/gen-roadmark.png",
    title: "친환경 그래픽 노면표시재",
    desc: "공공·산업 공간의 노면 그래픽. 자체 특허(제10-1974029호, 조성물·시공방법) · 국제특허 · GREENGUARD GOLD 인증 잉크.",
    tag: "특허",
  },
  {
    img: "/work/gen-wayfinding.png",
    title: "웨이파인딩 · 사인",
    desc: "공공·상업 공간을 위한 길찾기 사인 시스템과 안내 그래픽.",
  },
  {
    img: "/work/gen-banner.png",
    title: "친환경 현수막·배너 등",
    desc: "Tyvek 소재로 만드는 친환경 현수막·배너, 그리고 이를 재활용한 친환경 홍보판촉물.",
  },
  {
    img: "/work/gen-event.png",
    title: "이벤트 · 캠페인",
    desc: "축제·캠페인 현장의 사인과 바닥 그래픽.",
  },
  {
    img: "/work/gen-nationwide.png",
    title: "전국 안전 시공",
    desc: "전국 관공서·공공기관 등의 안전 노면표시를 직접 제작·설치·점검합니다.",
  },
];

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "Product",
  name: "친환경 그래픽 노면표시재",
  brand: { "@type": "Brand", name: "퍼블릭아이디" },
  manufacturer: { "@type": "Organization", name: "주식회사 퍼블릭아이디" },
  description:
    "자체 특허(제10-1974029호, 도로 노면 표시용 조성물 및 시공방법)와 국제특허(유럽특허 EP 1 677 974, EPO 등록) 기술 기반의 친환경 그래픽 노면표시재. 친환경 라텍스 잉크로 인쇄하며 GREENGUARD GOLD(UL 2818) 친환경 인증, 미끄럼저항·유해물질 불검출·방염 시험성적(KCL·SGS·KTR·KFI)을 보유. 노란발자국·노란볼라드·어린이보호구역·웨이파인딩 등에 적용.",
  category: "도로 노면표시재 / 안전표지",
  material: "친환경 라텍스 잉크",
  additionalProperty: [
    { "@type": "PropertyValue", name: "특허", value: "제10-1974029호 (도로 노면 표시용 조성물 및 시공방법, 2019)" },
    { "@type": "PropertyValue", name: "국제특허", value: "유럽특허 EP 1 677 974 (유럽특허청 등록)" },
    { "@type": "PropertyValue", name: "잉크", value: "친환경 라텍스" },
    { "@type": "PropertyValue", name: "친환경 인증", value: "GREENGUARD GOLD (UL 2818) 인증 라텍스 잉크" },
    { "@type": "PropertyValue", name: "시험성적", value: "미끄럼저항·유해물질 불검출·방염 (KCL·SGS·KTR·KFI)" },
  ],
  image: "https://www.public-id.co.kr/work/gen-nationwide.png",
  offers: {
    "@type": "Offer",
    url: "https://www.public-id.co.kr/quote",
    priceCurrency: "KRW",
    // 공개 기준가(VAT 포함) — 정확한 견적은 /quote 문의. 정본=assistant-knowledge.ts
    price: "132000",
    priceSpecification: {
      "@type": "UnitPriceSpecification",
      price: "132000",
      priceCurrency: "KRW",
      unitText: "㎡",
    },
    availability: "https://schema.org/InStock",
    seller: { "@type": "Organization", name: "주식회사 퍼블릭아이디" },
  },
};

export default function Work({ tint }: { tint?: boolean }) {
  return (
    <section id="work" className={cn("py-20 sm:py-28", tint && "bg-cloud/50")}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <Container>
        {/* 소개 문구는 /work 의 PageHero 가 맡는다 — 여기서 되풀이하지 않는다 */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 80}>
              <article className="group h-full overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal/5">
                <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
                  {w.video ? (
                    // 포스터 원본 PNG(1.9MB)를 그대로 쓰지 않고 이미지 최적화 경로(카드 폭 2배)로, 영상은 화면 가까이에서만(2026-09-27)
                    <LazyVideo
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      sources={[{ src: w.video, type: "video/mp4" }]}
                      poster={getImageProps({ src: w.img, alt: "", width: 375, height: 281 }).props.src}
                      ariaHidden
                    />
                  ) : (
                    <Image
                      src={w.img}
                      alt={w.title}
                      fill
                      sizes="(min-width:1024px) 360px, (min-width:640px) 50vw, 100vw"
                      className="object-cover transition duration-500 group-hover:scale-105"
                    />
                  )}
                  {w.tag && (
                    <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[11px] font-semibold text-teal-700">
                      {w.tag}
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h2 className="font-bold text-ink">{w.title}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {w.desc}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
