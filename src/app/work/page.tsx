import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Work from "@/components/sections/Work";

export const metadata: Metadata = {
  title: "사업영역",
  alternates: { canonical: "/work" },
  description:
    "노란발자국, 친환경 그래픽 노면표시재, 어린이보호구역·CPTED, 웨이파인딩, 친환경 현수막까지 — 퍼블릭아이디의 공공안전 디자인.",
};

export default function WorkPage() {
  return (
    <>
      <PageHero
        eyebrow="Our Work"
        title={
          <>
            공공의 안전을
            <br />
            디자인합니다
          </>
        }
        description="노면표시부터 도시 사인까지. 사람을 먼저 생각하는 공공디자인으로 더 안전한 거리를 만듭니다."
      />
      <Work />
    </>
  );
}
