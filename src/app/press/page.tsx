import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import PageHero from "@/components/PageHero";
import NewsListSection from "@/components/NewsListSection";
import { site } from "@/lib/site";
import { news, newsKind } from "@/lib/news";
import BreadcrumbLd from "@/components/BreadcrumbLd";

// 보도자료 탭 — 2026-09-08 대표 "소식 탭에 보도자료 탭을 따로". 데이터는 news.json에서 kind=보도자료만.
const press = news.filter((n) => newsKind(n) === "보도자료");

export const metadata: Metadata = pageMeta({
  title: "보도자료",
  description:
    "㈜퍼블릭아이디 보도자료. 친환경 그래픽 노면표시재·노란발자국·안전시설관리 구독·디자인구독 등 언론 배포 자료를 모았습니다.",
  path: "/press",
});

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "퍼블릭아이디 보도자료",
  itemListElement: press.map((n, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: n.title,
    url: `${site.url}/news/${n.slug}`,
  })),
};

export default function PressPage() {
  return (
    <>
      <BreadcrumbLd
        trail={[
          { name: "소식", path: "/news" },
          { name: "보도자료", path: "/press" },
        ]}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        eyebrow="Press"
        title={
          <>
            퍼블릭아이디
            <br />
            보도자료
          </>
        }
        description="언론에 배포한 보도자료 전문을 모았습니다. 취재·자료 요청은 문의로 부탁드립니다."
      />
      <NewsListSection items={press} active="press" />
    </>
  );
}
