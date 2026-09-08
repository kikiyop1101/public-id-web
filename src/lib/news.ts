// 소식·보도자료 콘텐츠 — 데이터 정본은 src/content/news.json (배열, 최신이 맨 앞).
// 2026-09-08 대표 지시: 홈페이지 소식 탭을 윤결이 주 3건 자동 게시한다(리서치 포함).
//   게시 파이프라인 = 시스템\Agent\콘텐츠본부\보도자료\publisher\news_publish.py (검증→JSON 선두 삽입→빌드→커밋→push).
//   게시물에 날짜는 넣지 않는다(대표 확정 2026-09-08 — 종전 "연도까지만"도 폐지). 정렬 = 배열 순서.
// 사실은 정본(BRAND_CONSTANTS) 준수. 본문은 플레인 텍스트(마크다운 굵게 없음). "### "로 시작하는 문단은 소제목으로 렌더.
import data from "@/content/news.json";

export type NewsItem = {
  slug: string;
  title: string;
  subtitle: string;
  summary: string;
  body: string[];
  /** 게시물 종류 — 없으면 보도자료 */
  kind?: "보도자료" | "소식";
};

export const news: NewsItem[] = data as NewsItem[];

export function getNews(slug: string): NewsItem | undefined {
  return news.find((n) => n.slug === slug);
}

export function newsKind(n: NewsItem): string {
  return n.kind ?? "보도자료";
}
