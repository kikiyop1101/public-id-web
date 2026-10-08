// 서버용 사이트 검색 — /search 페이지·/md/search(에이전트용 마크다운)·WebMCP가 같은 결과를 쓴다(2026-10-08 엑사 구조 대조).
// 헤더 검색창(SearchDialog)은 첫 번들을 가볍게 두려고 SEARCH_INDEX만 쓰고, 여기는 서버에서 소식·질문 답변·우리회사OS 킷 상세까지 함께 찾는다.
import { SEARCH_INDEX } from "@/lib/search-index";
import { answers } from "@/lib/answers";
import { news } from "@/lib/news";
import { KIT_PAGES } from "@/lib/os-kit-pages";

export type SiteHit = { label: string; href: string; group: string; desc: string; external?: boolean };

const DOCS: (SiteHit & { hay: string })[] = [
  ...SEARCH_INDEX.map((e) => ({ ...e, hay: `${e.label} ${e.desc} ${e.keywords} ${e.group}` })),
  ...KIT_PAGES.map((p) => ({
    label: `우리회사OS ${p.label}`,
    href: `/os/${p.slug}`,
    group: "우리회사OS",
    desc: p.title,
    hay: `우리회사OS ${p.label} ${p.title} ${p.lead}`,
  })),
  ...answers.map((a) => ({
    label: a.question,
    href: `/answers/${a.slug}`,
    group: "질문 답변",
    desc: a.description,
    hay: `${a.question} ${a.description}`,
  })),
  ...news.map((n) => ({
    label: n.title,
    href: `/news/${n.slug}`,
    group: "소식",
    desc: n.subtitle,
    hay: `${n.title} ${n.subtitle} ${n.summary}`,
  })),
];

/** 헤더 검색과 같은 규칙 — 낱말별 AND, 띄어쓰기 무시. 라벨에 걸리면 앞으로. */
export function searchSite(q: string, limit = 12): SiteHit[] {
  const query = q.trim().toLowerCase().slice(0, 60);
  if (!query) return [];
  const tokens = query.split(/\s+/).filter(Boolean);
  const scored: { hit: SiteHit; score: number }[] = [];
  for (const d of DOCS) {
    const hay = d.hay.toLowerCase();
    const compact = hay.replace(/\s+/g, "");
    if (!tokens.every((t) => hay.includes(t) || compact.includes(t))) continue;
    const label = d.label.toLowerCase();
    const score = tokens.filter((t) => label.includes(t)).length;
    scored.push({ hit: { label: d.label, href: d.href, group: d.group, desc: d.desc, external: d.external }, score });
  }
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((s) => s.hit);
}
