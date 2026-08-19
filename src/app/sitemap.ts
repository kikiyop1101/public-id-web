import type { MetadataRoute } from "next";

const base = "https://www.public-id.co.kr";
const routes = ["", "/subscribe", "/work", "/guide", "/about", "/credentials", "/credibility", "/contact", "/news", "/safety-map"];

export default function sitemap(): MetadataRoute.Sitemap {
  // 빌드(배포) 시각 기준 최종수정일 — AI 검색 신선도 신호(Perplexity·네이버 Cue:).
  const lastModified = new Date();
  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified,
    changeFrequency: "monthly",
    priority: route === "" ? 1 : 0.8,
  }));
}
