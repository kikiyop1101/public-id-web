import type { Metadata } from "next";
import { site } from "./site";

// 페이지 메타데이터 공용 빌더 (2026-09-08 전체 감사).
// 배경: Next는 openGraph를 "병합"이 아니라 "통째 교체"한다.
//  - 페이지가 openGraph를 안 쓰면 루트 layout의 og:title/description(홈 문구)이 그대로 상속됐고(23개 페이지),
//  - 페이지가 openGraph를 쓰면 layout의 og:image·siteName·locale이 통째로 사라졌다(/os·/news/*·/blog/* 등 6개).
// 여기서 canonical + 완전한 openGraph를 한 번에 만들어 두 문제를 동시에 막는다. twitter는 layout에서 og를 자동 상속한다.

export type OgImage = { url: string; width?: number; height?: number; alt?: string };

export const DEFAULT_OG_IMAGE: OgImage = {
  url: "/og.png",
  width: 1200,
  height: 630,
  alt: "퍼블릭아이디 — 디자인 구독 · 안전 시설 관리",
};

// 검색 결과에 잘리지 않는 길이(2026-11-04 task H5 — scripts/seo-audit.mjs가 같은 기준으로 검사한다).
// 소식·킷처럼 데이터에서 자동으로 만드는 쪽은 글이 길어질 수 있어 여기서 한 번에 맞춘다. 화면의 h1·본문은 그대로다.
export const TITLE_MAX = 60;
export const DESC_MAX = 160;
const TITLE_SUFFIX = ` | ${site.name}`;
const len = (s: string) => [...s].length;

/** 제목 — "제목 | 퍼블릭아이디"가 60자를 넘으면 ① 회사명 꼬리 없이 제목만 ② 그래도 넘으면 "…"·" — " 앞 앞절 + 꼬리 ③ 낱말 경계에서 자른다 */
export function fitTitle(title: string): Metadata["title"] {
  if (len(title) + len(TITLE_SUFFIX) <= TITLE_MAX) return title;
  if (len(title) <= TITLE_MAX) return { absolute: title };
  const lead = title.split(/…| — |: /)[0].trim();
  if (lead && lead !== title && len(lead) + len(TITLE_SUFFIX) <= TITLE_MAX) return lead;
  return { absolute: clip(title, TITLE_MAX) };
}

/** 설명 — 160자를 넘으면 그 안에서 끝나는 마지막 문장까지(문장이 너무 짧게 남으면 낱말 경계에서 "…") */
export function fitDescription(desc: string): string {
  const s = desc.replace(/\s+/g, " ").trim();
  if (len(s) <= DESC_MAX) return s;
  const head = [...s].slice(0, DESC_MAX).join("");
  const ends = [...head.matchAll(/[.!?。](?=\s|$)/g)].map((m) => (m.index ?? 0) + 1);
  const cut = ends.length ? ends[ends.length - 1] : 0;
  if (cut >= DESC_MAX * 0.5) return head.slice(0, cut).trim();
  return clip(s, DESC_MAX);
}

function clip(s: string, max: number): string {
  const head = [...s].slice(0, max - 1).join("");
  const sp = head.lastIndexOf(" ");
  return (sp > max * 0.6 ? head.slice(0, sp) : head).replace(/[\s,·—-]+$/, "") + "…";
}

export function pageMeta(opts: {
  /** 문자열이면 layout 템플릿("%s | 퍼블릭아이디")이 붙는다. 홈처럼 그대로 쓰려면 { absolute }. */
  title: string | { absolute: string };
  description: string;
  /** 루트 상대경로("/about"). canonical과 og:url에 쓴다. */
  path: string;
  /** 생략하면 title(+" | 퍼블릭아이디")을 쓴다. 이미 회사명이 들어 있으면 붙이지 않는다. */
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "website" | "article";
  images?: OgImage[];
  robots?: Metadata["robots"];
  /** AI 에이전트용 마크다운 판이 있는 페이지(src/lib/agent-md.ts) — <link rel="alternate" type="text/markdown">를 단다 */
  markdown?: boolean;
}): Metadata {
  const plainTitle = typeof opts.title === "string" ? opts.title : opts.title.absolute;
  const ogTitle =
    opts.ogTitle ?? (plainTitle.includes(site.name) ? plainTitle : `${plainTitle} | ${site.name}`);
  const description = fitDescription(opts.description);
  return {
    title: typeof opts.title === "string" ? fitTitle(opts.title) : opts.title,
    description,
    alternates: {
      canonical: opts.path,
      ...(opts.markdown ? { types: { "text/markdown": opts.path === "/" ? "/md" : `/md${opts.path}` } } : {}),
    },
    openGraph: {
      type: opts.ogType ?? "website",
      locale: "ko_KR",
      siteName: site.name,
      url: opts.path,
      title: ogTitle,
      description: fitDescription(opts.ogDescription ?? opts.description),
      images: opts.images ?? [DEFAULT_OG_IMAGE],
    },
    ...(opts.robots ? { robots: opts.robots } : {}),
  };
}
