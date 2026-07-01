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
    "세종특별자치시 한누리대로 2135, A동 401호\n(보람동 628-2, 스타힐타워1)",
  tel: "070-4150-1172",
  fax: "044-868-1172",
  email: "public-id@naver.com",
  url: "https://www.public-id.co.kr",
  blog: "https://blog.naver.com/public-id",
  youtube: "https://www.youtube.com/@public-identity",
  instagram: "https://www.instagram.com/_public.id/",
  nav: [
    { label: "구독 서비스", en: "Subscription", href: "/subscribe" },
    { label: "사업영역", en: "Work", href: "/work" },
    { label: "회사소개", en: "About", href: "/about" },
    { label: "인증·특허", en: "Credentials", href: "/credentials" },
    { label: "실적", en: "Track Record", href: "/credibility" },
    { label: "안전관리 지도", en: "Safety Map", href: "/safety-map" },
    { label: "소식", en: "News", href: "/news" },
    { label: "문의", en: "Contact", href: "/contact" },
  ],
  stores: [
    { label: "네이버 스마트스토어", href: "https://smartstore.naver.com/public-id" },
    {
      label: "쿠팡",
      href: "https://shop.coupang.com/publicid/129466?platform=p&source=brandstore_sdp_atf&pid=7881558209&viid=88608367140&ocid=20063148&checkBatchDelivery=true&brandId=0",
    },
    { label: "e-store 36.5 (가치장터)", href: "https://www.sepp.or.kr/store365" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
