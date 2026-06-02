import Link from "next/link";
import Image from "next/image";
import Container from "@/components/Container";
import Reveal from "@/components/Reveal";
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
    desc: "공공·산업 공간의 노면 그래픽. 자재 특허 · 설치·시공 특허 · GREENGUARD GOLD.",
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

const clients = [
  "세종특별자치시 · 서울특별시 · 서초구청 · 경기도청 · 경기남부경찰청 · 국립세종수목원 등 다수 관공서·지방자치단체",
  "유니세프 한국위원회 · 세이브더칠드런 등 다수 NGO 단체",
  "스타벅스 · 현대자동차 · 유한양행 · 에버랜드 등 다수 기업",
];

export default function Work({
  moreHref,
  tint,
}: {
  moreHref?: string;
  tint?: boolean;
}) {
  return (
    <section id="work" className={cn("py-20 sm:py-28", tint && "bg-cloud/50")}>
      <Container>
        <Reveal className="max-w-2xl">
          <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
            Our Work
          </p>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">
            검증된 산업디자인이,
            <br className="hidden sm:block" /> 디자인 구독의 토대입니다
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-ink-soft">
            노면표시부터 도시 사인까지.
            <br />
            공공 안전 디자인 분야에서 검증된 퍼블릭아이디가 함께 성장할 파트너를
            찾습니다.
            <br />
            GD 디자인 어워드 수상 경력을 보유한 종합산업디자인전문회사의 디자인
            전문성을 구독형 서비스로 제공합니다.
          </p>
          {moreHref && (
            <Link
              href={moreHref}
              className="link-underline mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700"
            >
              사업영역 전체 보기 <span aria-hidden>→</span>
            </Link>
          )}
        </Reveal>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {works.map((w, i) => (
            <Reveal key={w.title} delay={(i % 3) * 80}>
              <article className="group h-full overflow-hidden rounded-2xl border border-line bg-white transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-teal/5">
                <div className="relative aspect-[4/3] overflow-hidden bg-cloud">
                  {w.video ? (
                    <video
                      className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      src={w.video}
                      poster={w.img}
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-hidden="true"
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
                  <h3 className="font-bold text-ink">{w.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {w.desc}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-14">
          <p className="text-center text-sm font-medium text-ink-soft">
            함께한 곳
          </p>
          <ul className="mx-auto mt-4 max-w-3xl space-y-2 text-center">
            {clients.map((c) => (
              <li
                key={c}
                className="text-sm font-semibold leading-relaxed text-navy/75"
              >
                {c}
              </li>
            ))}
          </ul>
        </Reveal>
      </Container>
    </section>
  );
}
