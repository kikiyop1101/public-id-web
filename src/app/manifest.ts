import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "퍼블릭아이디 — 디자인 구독 · 안전 시설 관리",
    short_name: "퍼블릭아이디",
    description:
      "전용 마스코트·매월 웹툰·디자인 시스템·홈페이지 제작 구독과 노면표시·안전표지 정기 시설 관리.",
    start_url: "/",
    display: "browser",
    background_color: "#ffffff",
    theme_color: "#069CBB",
    icons: [
      { src: "/icons/pui-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icons/pui-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
