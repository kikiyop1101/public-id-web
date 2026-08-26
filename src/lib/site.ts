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
  // GNB는 5개(대표 지시 2026-08-25 "메뉴 4~5개") — 하위 페이지는 드롭다운으로 노출
  // (대표 지적 2026-08-26 "우리회사OS·안전관리지도·설치영상은 모르면 못 찾는다").
  // 순서 = 회사소개→제품→구독→실적·인증→소식 (대표 지시 2026-08-26).
  nav: [
    {
      label: "회사소개", en: "About", href: "/about",
      children: [{ label: "사업영역", href: "/work" }],
    },
    {
      label: "제품", en: "Products", href: "/products",
      children: [
        { label: "직물시트 명화", href: "/products/art-fabric" },
        { label: "현수막 지도", href: "/products/map-banner" },
        { label: "부착 가이드 · 설치 영상", href: "/guide" },
        { label: "맞춤 견적", href: "/quote" },
        { label: "우리회사OS (AI 자동화)", href: "/os" },
      ],
    },
    {
      label: "구독 서비스", en: "Subscription", href: "/subscribe",
      children: [
        { label: "디자인 시스템", href: "/subscribe#design-system" },
        { label: "안전관리 지도", href: "/safety-map" },
      ],
    },
    {
      label: "실적·인증", en: "Track Record", href: "/credibility",
      children: [{ label: "인증·특허", href: "/credentials" }],
    },
    {
      label: "소식", en: "News", href: "/news",
      children: [
        { label: "블로그", href: "/blog" },
        { label: "문의", href: "/contact" },
      ],
    },
  ],
  // 푸터 전체 지도 — GNB 5그룹 골격 그대로, GNB에서 뺀 페이지도 여기서 전부 닿는다.
  // (2026-08-26 개편: 납작한 칩 12개 → 그룹 컬럼 — 대표 "페이지는 안 줄이고 눈에 잘 들어오게")
  footerGroups: [
    {
      label: "회사소개",
      links: [
        { label: "회사소개", href: "/about" },
        { label: "사업영역", href: "/work" },
        { label: "3D 월드", href: "/world" },
      ],
    },
    {
      label: "제품",
      links: [
        { label: "제품 전체", href: "/products" },
        { label: "직물시트 명화", href: "/products/art-fabric" },
        { label: "현수막 지도", href: "/products/map-banner" },
        { label: "부착 가이드", href: "/guide" },
        { label: "맞춤 견적", href: "/quote" },
      ],
    },
    {
      label: "구독 서비스",
      links: [
        { label: "구독 안내", href: "/subscribe" },
        { label: "디자인 시스템", href: "/subscribe#design-system" },
        { label: "안전관리 지도", href: "/safety-map" },
      ],
    },
    {
      label: "실적·인증",
      links: [
        { label: "실적", href: "/credibility" },
        { label: "인증·특허", href: "/credentials" },
      ],
    },
    {
      label: "소식",
      links: [
        { label: "소식 · 보도자료", href: "/news" },
        { label: "블로그", href: "/blog" },
        { label: "문의", href: "/contact" },
      ],
    },
  ],
  stores: [
    { label: "우리회사OS (AI 자동화 템플릿)", href: "/os" },
    { label: "AI 자동화 무료 진단", href: "/os#scan" },
    { label: "네이버 스마트스토어", href: "https://smartstore.naver.com/public-id" },
    {
      label: "쿠팡",
      href: "https://shop.coupang.com/publicid/129466?platform=p&source=brandstore_sdp_atf&pid=7881558209&viid=88608367140&ocid=20063148&checkBatchDelivery=true&brandId=0",
    },
    { label: "e-store 36.5 (가치장터)", href: "https://www.sepp.or.kr/store365" },
  ],
} as const;

export type NavItem = (typeof site.nav)[number];
