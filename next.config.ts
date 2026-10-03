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
      // 2026-09-17 대표 지시 — 사내 업무 웹앱 PI-System을 /pis로. 검색 차단(메뉴·사이트맵·robots 미기재).
      { source: "/pis/:path*", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      { source: "/pis", headers: [{ key: "X-Robots-Tag", value: "noindex, nofollow" }] },
      // 2026-09-20 PI-System 「실무 도구」는 같은 주소(/pis/tools) iframe — 위 DENY·frame-ancestors 'none'을 이 경로만 같은 사이트 허용으로(뒤 항목이 덮는다)
      {
        source: "/pis/tools/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
      // 2026-09-30 아웃리치 제안서 열람 페이지(/p/<토큰>)가 같은 사이트의 /proposals/*.pdf 를 iframe 으로 넣는다 —
      // 전역 DENY·frame-ancestors 'none'이면 미리보기가 막혀 이 경로만 같은 사이트 허용으로(/pis/tools 와 같은 방식).
      {
        source: "/proposals/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
      // 2026-10-03 노란발자국 캠페인 게임(/campaign-game)이 같은 사이트의 /games/* 정적 게임을 iframe 으로 넣는다 — /proposals 와 같은 방식.
      {
        source: "/games/:path*",
        headers: [
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Content-Security-Policy", value: "frame-ancestors 'self'; object-src 'none'; base-uri 'self'; form-action 'self'" },
        ],
      },
      // 2026-09-30 public 정적 자산 캐시 — 종전엔 전부 max-age=0(재방문마다 재검증).
      // 폰트는 파일이 바뀌지 않아 immutable, 이미지·영상은 파일명에 해시가 없어 1일(+7일 swr)만.
      // ⚠️ 경로가 아니라 확장자로만 거른다 — /os·/news·/products 같은 경로 패턴은 페이지(HTML)까지 캐시한다. PDF(/proposals)는 제외.
      // 같은 경로의 사진을 교체하면 방문자에게는 최대 하루 뒤에 반영된다.
      {
        source: "/fonts/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/:file(.*\\.(?:webp|png|jpg|jpeg|gif|svg|mp4|webm))",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
    ];
  },
  async rewrites() {
    // 2026-09-28 대표 지시 — 주소는 소문자 /pis. 경로 매칭은 대소문자 무시라 여기 redirect로는 무한 반복(09-17 실측) → 대문자 변형은 src/proxy.ts가 대소문자 구분해 /pis로 308.
    // PI-System 본체는 Vercel 프로젝트 pi-contract-web(정본 Agent/영업본부/PI-계약관리시스템). 여기선 주소만 빌려준다.
    return {
      beforeFiles: [
        { source: "/pis", destination: "https://pi-contract-web.vercel.app/" },
        { source: "/pis/:path*", destination: "https://pi-contract-web.vercel.app/:path*" },
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
        // 2026-09-30 — apex(public-id.co.kr)/scan 도 www로 바로(1단). 종전엔 아래 일반 /scan 규칙이 먼저 잡혀
        // apex/scan → apex/os#scan → www/os 2단이었다. apex→www 308 자체는 맨 아래 규칙 그대로.
        source: "/scan",
        has: [{ type: "host", value: "public-id\\.co\\.kr" }],
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
