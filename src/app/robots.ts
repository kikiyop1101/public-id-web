import type { MetadataRoute } from "next";

// AI 검색·답변엔진 크롤러를 명시 허용(AEO, 2026-09-05). 회사 요약은 /llms.txt.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "Bingbot",
  "Yeti",
];

export default function robots(): MetadataRoute.Robots {
  const disallow = ["/admin", "/api/"];
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow },
      { userAgent: AI_CRAWLERS, allow: ["/", "/llms.txt"], disallow },
    ],
    sitemap: "https://www.public-id.co.kr/sitemap.xml",
  };
}
