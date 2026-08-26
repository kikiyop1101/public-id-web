import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Container from "@/components/Container";
import SafetyMapApp from "@/components/safety-map/SafetyMapApp";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = {
  title: "안전관리 지도",
  alternates: { canonical: "/safety-map" },
  description:
    "퍼블릭아이디가 설치·관리하는 노면표시·안전표지의 전국 설치 현황과 관리기간을 지도에서 한눈에 확인하세요.",
};

export default function SafetyMapPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "안전관리 지도", path: "/safety-map" }]} />
      <PageHero
        eyebrow="Safety Map"
        title={
          <>
            설치 현황과 관리기간을
            <br />
            지도에서 한눈에
          </>
        }
        description="노란발자국·노란볼라드·안전표지 등 퍼블릭아이디가 시공하고 관리하는 전국 안전시설을 발주처·설치일·관리기간 기준으로 보여드립니다."
      />
      <section className="pb-24">
        <Container>
          <SafetyMapApp />
        </Container>
      </section>
    </>
  );
}
