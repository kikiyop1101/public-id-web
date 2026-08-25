export const site = {
  name: "퍼블릭아이디",
  nameEn: "PUBLIC ID",
  legalName: "주식회사 퍼블릭아이디",
  tagline: "윤리적 가치를 담은 사회적기업",
  descriptor: "KIDP 종합산업디자인전문회사 (시각 · 포장 · 환경)",
  ceo: "조용민",
  bizRegNo: "413-81-06849",
  mailOrderNo: "2017-세종-0127",
  zip: "30150",
  address:
    "세종특별자치시 한누리대로 2135, 에이동 4층 1호\n(보람동, 스타힐타워)",
  tel: "070-4150-1172",
  fax: "044-868-1172",
  email: "public-id@naver.com",
  url: "https://www.public-id.co.kr",
  blog: "https://blog.naver.com/public-id",
  youtube: "https://www.youtube.com/@퍼블릭아이디",
  instagram: "https://www.instagram.com/_public.id/",
  tistory: "https://public-id.tistory.com",
  store: "https://www.public-id.co.kr/products", // 2026-08-25 스토어 통합 — 구 store 도메인은 301
  // GNB는 5개(대표 지시 2026-08-25 "메뉴 4~5개") — 나머지는 footerNav·페이지 내 링크로.
  // 순서 = 회사소개→제품→구독→실적·인증→소식 (대표 지시 2026-08-26).
  nav: [
    { label: "회사소개", en: "About", href: "/about" },
    { label: "제품", en: "Products", href: "/products" },
    { label: "구독 서비스", en: "Subscription", href: "/subscribe" },
    { label: "실적·인증", en: "Track Record", href: "/credibility" },
    { label: "소식", en: "News", href: "/news" },
  ],
  // 푸터 전용 전체 지도 — GNB에서 뺀 페이지도 여기서 전부 닿는다.
  // 순서 = GNB 골격을 따르고 부속 항목은 관련 메뉴 옆에(사업영역→회사소개 뒤, 인증·특허→실적 뒤).
  footerNav: [
    { label: "회사소개", href: "/about" },
    { label: "사업영역", href: "/work" },
    { label: "제품", href: "/products" },
    { label: "구독 서비스", href: "/subscribe" },
    { label: "실적", href: "/credibility" },
    { label: "인증·특허", href: "/credentials" },
    { label: "안전관리 지도", href: "/safety-map" },
    { label: "소식", href: "/news" },
    { label: "문의", href: "/contact" },
  ],
  stores: [
    { label: "우리회사OS (AI 자동화 템플릿)", href: "/os" },
    { label: "네이버 스마트스토어", href: "https://smartstore.naver.com/public-id" },
    {
      label: "쿠팡",
      href: "https://shop.coupang.com/publicid/129466?platform=p&source=brandstore_sdp_atf&pid=7881558209&viid=88608367140&ocid=20063148&checkBatchDelivery=true&brandId=0",
    },
    { label: "e-store 36.5 (가치장터)", href: "https://www.sepp.or.kr/store365" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
