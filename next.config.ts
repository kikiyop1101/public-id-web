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
  async headers() {
    return [{ source: "/(.*)", headers: securityHeaders }];
  },
  async redirects() {
    // Canonical host = www (metadataBase/sitemap/robots/JSON-LD all use www);
    // apex previously served duplicate 200s, splitting SEO signals.
    return [
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
