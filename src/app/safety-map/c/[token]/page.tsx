import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SafetyMapApp from "@/components/safety-map/SafetyMapApp";

// 발주처 전용 링크는 검색엔진에 노출되지 않도록 noindex.
export const metadata: Metadata = {
  title: "발주처 전용 안전시설 현황",
  robots: { index: false, follow: false },
};

export default async function ClientSafetyMapPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  return (
    <>
      <PageHero
        eyebrow="Safety Map"
        title={
          <>
            발주처 전용
            <br />
            안전시설 현황
          </>
        }
        description="귀 기관에 설치된 퍼블릭아이디 안전시설의 위치와 관리기간을 한눈에 확인하실 수 있습니다."
      />
      <section className="pb-24">
        <Container>
          <SafetyMapApp token={token} />
        </Container>
      </section>
    </>
  );
}
