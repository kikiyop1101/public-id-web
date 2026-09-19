import type { NextConfig } from "next";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=(), usb=()",
  },
  {
    // Partial CSP on purpose: a full default-src/script-src policy would need
    // nonces for Next's inline bootstrap scripts, which SSG cannot provide.
    key: "Content-Security-Policy",
    value:
      "frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'self'",
  },
];

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // 안전 리포트 제보 사진(클라이언트에서 압축한 JPEG 최대 3장) 업로드 여유 — 스토어 통합(2026-08-25) 이식
      bodySizeLimit: "8mb",
    },
  },
  async headers() {
    return [
      { source: "/(.*)", headers: securityHeaders },
      // 2026-09-17 대표 지시 — 사내 업무 웹앱 PI-System을 /Pis로. 검색 차단(메뉴·사이트맵·robots 미기재).
      { source: "/Pis/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/Pis", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // 2026-09-20 PI-System 「실무 도구」는 같은 주소(/Pis/tools) iframe — 위 DENY·frame-ancestors 'none'을 이 경로만 같은 사이트 허용으로(뒤 항목이 덮는다)
      {
        source: "/Pis/tools/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
    ];
  },
  async rewrites() {
    // 경로 매칭은 대소문자 무시라 /pis도 같이 열린다(소문자 리다이렉트를 넣으면 무한 반복 — 09-17 실측).
    // PI-System 본체는 Vercel 프로젝트 pi-contract-web(정본 Agent/영업본부/PI-계약관리시스템). 여기선 주소만 빌려준다.
    return {
      beforeFiles: [
        { source: "/Pis", destination: "https://pi-contract-web.vercel.app/" },
        { source: "/Pis/:path*", destination: "https://pi-contract-web.vercel.app/:path*" },
      ],
      afterFiles: [],
      fallback: [],
    };
  },
  async redirects() {
    // Canonical host = www (metadataBase/sitemap/robots/JSON-LD all use www);
    // apex previously served duplicate 200s, splitting SEO signals.
    return [
      // 2026-08-26 대표 지시 — /design 전용 페이지 복원("눌러서 다 볼 수 있던 게 없어졌다").
      // 08-25의 /design→/subscribe#design-system 301은 해제, 구독 안 요약 섹션은 유지.
      {
        // 2026-09-18 — 구 store 호스트의 /scan은 www로 바로(1단). next.config redirects가 proxy.ts(LEGACY_HOSTS 301)보다
        // 먼저 돌아 종전엔 store/scan → store/os#scan → www/os 2단이었다. 이 규칙이 아래 일반 /scan 규칙보다 앞서야 한다.
        source: "/scan",
        has: [{ type: "host", value: "(www\\.)?store\\.public-id\\.co\\.kr" }],
        destination: "https://www.public-id.co.kr/os#scan",
        permanent: true,
      },
      {
        // 2026-08-26 대표 지시 — 무료 진단(/scan)을 우리회사OS 안으로 통합.
        // 발행물·봇 캐논에 나간 /scan 링크가 있어 삭제가 아니라 301로 물린다.
        source: "/scan",
        destination: "/os#scan",
        permanent: true,
      },
      {
        source: "/:path*",
        has: [{ type: "host", value: "public-id.co.kr" }],
        destination: "https://www.public-id.co.kr/:path*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
