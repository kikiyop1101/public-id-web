import type { Metadata } from "next";
import PageHero from "@/components/PageHero";
import NewsListSection from "@/components/NewsListSection";
import { site } from "@/lib/site";
import { news } from "@/lib/news";
import BreadcrumbLd from "@/components/BreadcrumbLd";

export const metadata: Metadata = {
  title: "소식",
  alternates: { canonical: "/news" },
  description:
    "퍼블릭아이디의 소식과 보도자료. 친환경 그래픽 노면표시재, 어린이보호구역 노란발자국, 배리어프리 안내표지, 사회적기업 우선구매 등 안전 디자인 활동을 전합니다.",
};

// 목록 페이지는 ItemList — 개별 NewsArticle 스키마는 /news/[slug]에서 낸다(중복 마크업 방지).
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "퍼블릭아이디 소식",
  itemListElement: news.map((n, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: n.title,
    url: `${site.url}/news/${n.slug}`,
  })),
};

export default function NewsPage() {
  return (
    <>
      <BreadcrumbLd trail={[{ name: "소식", path: "/news" }]} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <PageHero
        eyebrow="News"
        title={
          <>
            퍼블릭아이디
            <br />
            소식
          </>
        }
        description="안전이 되는 디자인을 현장에서 만들어 온 이야기. 보도자료와 활동 소식을 전합니다."
      />
      <NewsListSection items={news} active="all" />
    </>
  );
}
