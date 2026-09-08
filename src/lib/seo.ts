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
}): Metadata {
  const plainTitle = typeof opts.title === "string" ? opts.title : opts.title.absolute;
  const ogTitle =
    opts.ogTitle ?? (plainTitle.includes(site.name) ? plainTitle : `${plainTitle} | ${site.name}`);
  return {
    title: opts.title,
    description: opts.description,
    alternates: { canonical: opts.path },
    openGraph: {
      type: opts.ogType ?? "website",
      locale: "ko_KR",
      siteName: site.name,
      url: opts.path,
      title: ogTitle,
      description: opts.ogDescription ?? opts.description,
      images: opts.images ?? [DEFAULT_OG_IMAGE],
    },
    ...(opts.robots ? { robots: opts.robots } : {}),
  };
}
