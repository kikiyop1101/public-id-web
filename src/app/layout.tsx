import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Assistant from "@/components/Assistant";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";

const pretendard = localFont({
  src: "./fonts/PretendardVariable.woff2",
  variable: "--font-pretendard",
  display: "swap",
  weight: "100 900",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-poppins",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.public-id.co.kr"),
  alternates: { canonical: "/" },
  title: {
    default: "퍼블릭아이디 | 디자인 구독 · 안전 시설 관리",
    template: "%s | 퍼블릭아이디",
  },
  description:
    "디자인 팀이 없어도 괜찮습니다. 퍼블릭아이디는 전용 마스코트, 매월 웹툰, 디자인 시스템을 구독으로 제공하고, 노면표시·안전표지의 정기 시설 관리까지 함께하는 KIDP 종합산업디자인전문회사이자 인증 사회적기업입니다.",
  keywords: [
    "퍼블릭아이디",
    "디자인 구독",
    "마스코트 제작",
    "월별 웹툰",
    "브랜드 디자인",
    "노면표시",
    "안전표지",
    "사회적기업",
    "종합산업디자인전문회사",
    "세종 디자인",
  ],
  openGraph: {
    type: "website",
    locale: "ko_KR",
    siteName: "퍼블릭아이디",
    title: "퍼블릭아이디 | 디자인 구독 · 안전 시설 관리",
    description:
      "전용 마스코트부터 매월 웹툰, 디자인 시스템까지 — 구독으로 완성하는 우리 브랜드.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "퍼블릭아이디 — 디자인 구독 · 안전 시설 관리",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "퍼블릭아이디 | 디자인 구독 · 안전 시설 관리",
    description:
      "전용 마스코트부터 매월 웹툰, 디자인 시스템까지 — 구독으로 완성하는 우리 브랜드.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "퍼블릭아이디 — 디자인 구독 · 안전 시설 관리",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#organization`,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: `${site.url}/logo.png`,
    image: `${site.url}/og.png`,
    description:
      "전용 마스코트·매월 웹툰·디자인 시스템 구독과 친환경 그래픽 노면표시재 기반 노면표시·안전표지 정기 시설 관리를 제공하는 KIDP 종합산업디자인전문회사이자 인증 사회적기업.",
    foundingDate: "2017",
    founder: { "@type": "Person", name: site.ceo },
    telephone: site.tel,
    faxNumber: site.fax,
    email: site.email,
    address: {
      "@type": "PostalAddress",
      postalCode: site.zip,
      addressRegion: "세종특별자치시",
      streetAddress: "한누리대로 2135, 에이동 4층 1호 (보람동, 스타힐타워)",
      addressCountry: "KR",
    },
    areaServed: "KR",
    knowsAbout: [
      "친환경 그래픽 노면표시재",
      "노란발자국",
      "노란볼라드",
      "디자인구독 서비스",
      "마스코트 제작",
      "웹툰",
      "안전시설관리",
      "웨이파인딩",
      "어린이보호구역 디자인",
      "CPTED",
      "친환경 직물시트",
      "듀폰 타이벡 홍보판촉물",
      "공공디자인",
    ],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "디자인 구독 플랜",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Basic",
          price: "1100000",
          priceCurrency: "KRW",
          description:
            "전용 마스코트·월 1편 웹툰·기본 로고/컬러 가이드·SNS 프로필 키트 (연)",
        },
        {
          "@type": "Offer",
          name: "Standard",
          price: "4000000",
          priceCurrency: "KRW",
          description:
            "디자인 시스템·마스코트 변형·월 1편 웹툰·SNS 템플릿·월 1회 디자인 요청·원본 제공 (연)",
        },
        {
          "@type": "Offer",
          name: "Premium",
          description:
            "Standard 전체 + 전담 디자이너 + 노면표시·안전시설 정기 관리 (맞춤 견적)",
        },
      ],
    },
    sameAs: [
      site.blog,
      site.youtube,
      site.instagram,
      ...site.stores.map((s) => s.href),
    ],
  };

  return (
    <html lang="ko" className={`${pretendard.variable} ${poppins.variable}`}>
      <body className="min-h-dvh bg-paper text-ink antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
          }}
        />
        <noscript>
          <style>{`.reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-navy focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
        >
          본문 바로가기
        </a>
        <Header />
        <main id="main">{children}</main>
        <Footer />
        <Assistant />
        {/* 방문자 측정 — 어느 경로로 들어와 어디서 이탈하는지 실측(2026-08-20 신설). 쿠키 없음. */}
        <Analytics />
      </body>
    </html>
  );
}
