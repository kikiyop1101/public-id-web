"use client";

// 이미지 preload를 <link> 요소로 내는 작은 클라이언트 컴포넌트(2026-09-18).
// 서버 컴포넌트에서 react-dom preload()나 <link rel="preload">를 쓰면 RSC 페이로드에 힌트(HL) 행으로 실려,
// 그 페이지를 프리페치하는 다른 문서(/os·홈 등)에도 preload가 주입돼 "preloaded but not used" 경고가 났다.
// 클라이언트 컴포넌트는 Flight에 참조만 실리고 실제 <link>는 SSR HTML(그 페이지 head)과 그 페이지로 이동했을 때만 렌더된다.
export default function PreloadImage({
  href,
  fetchPriority,
}: {
  href: string;
  fetchPriority?: "high" | "low" | "auto";
}) {
  return <link rel="preload" as="image" href={href} fetchPriority={fetchPriority} />;
}
