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
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    // Canonical host = www (metadataBase/sitemap/robots/JSON-LD all use www);
    // apex previously served duplicate 200s, splitting SEO signals.
    return [
      {
        // 2026-08-25 대표 지시 — 디자인시스템 페이지를 구독 안으로 통합
        source: "/design",
        destination: "/subscribe#design-system",
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
