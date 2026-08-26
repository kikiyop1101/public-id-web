import Image from "next/image";
import Link from "next/link";
import Container from "@/components/Container";

// 2026-08-25 홈 리디자인 시안 — 참조: pentagram(풀블리드 작품 캐러셀+문장형 헤딩)·snøhetta(이미지 스트립)
// 실적을 텍스트 목록이 아니라 "작품"으로 보여준다. 캡션은 제품명 + 공간 유형(협력기관 일반화 — 캡션 표준).
const WORKS = [
  {
    src: "/products/친환경그래픽노면표시재-노란발자국/참조28.jpg",
    title: "노란발자국 · 안심 대기선",
    place: "횡단보도 앞 보도",
    scope: "친환경 노면표시재 부착 시공 — 보행 대기공간 표시",
    w: 1440,
    h: 1080,
  },
  {
    src: "/products/친환경그래픽노면표시재/참조13.jpg",
    title: "생태놀이 노면 그래픽",
    place: "공원 광장",
    scope: "놀이 그래픽 디자인 + 노면표시재 부착 시공",
    w: 1440,
    h: 1080,
  },
  {
    src: "/products/친환경그래픽직물시트/참조00-0.jpg",
    title: "노란볼라드 드레스업",
    place: "어린이보호구역",
    scope: "기존 볼라드에 직물시트 부착 — 안전시설관리 구독 항목",
    w: 773,
    h: 580,
  },
  {
    src: "/products/친환경그래픽노면표시재/참조20.jpg",
    title: "바닥 웨이파인딩",
    place: "수목원 · 공공시설",
    scope: "방향 안내 바닥 사인 디자인 + 부착 시공",
    w: 3840,
    h: 2880,
  },
  {
    src: "/products/친환경홍보판촉물/참조01.jpg",
    title: "타이벡 친환경 판촉물",
    place: "전시 · 캠페인",
    scope: "친환경 타이벡 소재 홍보물 디자인 · 제작",
    w: 773,
    h: 580,
  },
];

export default function ShowcaseStrip() {
  return (
    <section className="overflow-hidden bg-white">
      <Container className="pt-20 sm:pt-28">
        <p className="font-display text-sm font-semibold uppercase tracking-[0.18em] text-teal-700">
          Public Works
        </p>
        <h2 className="mt-3 max-w-3xl break-keep text-3xl font-extrabold leading-[1.2] tracking-tight text-ink sm:text-4xl">
          우리는 <span className="text-teal-700">안전과 브랜드</span>를
          <br className="sm:hidden" /> 거리 위에 디자인합니다.
        </h2>
      </Container>
      {/* 가로 스크롤 스트립 — 화면 밖으로 살짝 잘리게 두어 "더 있다"를 몸으로 알린다.
          2026-08-26 업그레이드: 카드 확대(460→560px)·캡션에 공간 유형을 라벨로 승격
          (리서치: 시공업 신뢰는 현장 사진의 크기·현장감이 만든다 — 엣지투엣지에 가깝게). */}
      <div className="mt-10 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-6 sm:px-8 lg:px-[max(2rem,calc((100vw-1200px)/2))]">
        {WORKS.map((wk) => (
          <figure
            key={wk.src}
            className="group w-[84vw] shrink-0 snap-start overflow-hidden rounded-2xl border border-line bg-cloud shadow-sm sm:w-[560px]"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden">
              <Image
                src={wk.src}
                alt={`${wk.title} — ${wk.place}`}
                fill
                sizes="(max-width: 640px) 84vw, 560px"
                className="object-cover transition duration-500 group-hover:scale-[1.03]"
              />
            </div>
            <figcaption className="px-5 py-4">
              <span className="flex items-baseline justify-between gap-3">
                <span className="break-keep font-bold text-ink">{wk.title}</span>
                <span className="shrink-0 rounded-full border border-line bg-white/70 px-3 py-1 text-xs font-semibold text-ink-soft">
                  {wk.place}
                </span>
              </span>
              <span className="mt-1.5 block break-keep text-sm leading-relaxed text-ink-soft">
                {wk.scope}
              </span>
            </figcaption>
          </figure>
        ))}
        {/* 마지막 칸 — 실적 전체로 */}
        <Link
          href="/credibility"
          className="flex w-[60vw] shrink-0 snap-start items-center justify-center rounded-2xl border border-line bg-navy text-center transition hover:bg-teal-700 sm:w-[300px]"
        >
          <span className="px-6 text-lg font-bold leading-relaxed text-white">
            시공 실적
            <br />
            전부 보기 →
          </span>
        </Link>
      </div>
    </section>
  );
}
