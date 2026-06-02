import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import Subscription from "@/components/sections/Subscription";
import HowItWorks from "@/components/sections/HowItWorks";
import Pricing from "@/components/sections/Pricing";

export const metadata: Metadata = {
  title: "구독 서비스",
  alternates: { canonical: "/subscribe" },
  description:
    "전용 마스코트·매월 웹툰·디자인 시스템 구독과 노면표시·안전표지 정기 시설 관리. 소상공인부터 지자체까지 맞춤 구독으로.",
};

export default function SubscribePage() {
  return (
    <>
      <PageHero
        eyebrow="Subscription"
        title={
          <>
            구독으로 완성하는
            <br />
            디자인과 안전
          </>
        }
        description="디자인 팀이 없어도 매달 새로운 브랜드 콘텐츠를, 노면표시·안전표지는 시공부터 정기 관리까지. 필요한 만큼만 합리적으로 이용하세요."
      />
      <Subscription pricing />
      <HowItWorks />
      <Pricing />
    </>
  );
}
