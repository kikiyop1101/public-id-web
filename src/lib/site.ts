export const site = {
  name: "퍼블릭아이디",
  nameEn: "PUBLIC ID",
  legalName: "주식회사 퍼블릭아이디",
  tagline: "윤리적 가치를 담은 사회적기업",
  descriptor: "KIDP 종합산업디자인전문회사 (시각 · 제품 · 환경)",
  ceo: "조용민",
  bizRegNo: "413-81-06849",
  mailOrderNo: "2017-세종-0127",
  zip: "30150",
  address:
    "세종특별자치시 한누리대로 2135, 에이동 401호\n(보람동, 스타힐타워Ⅰ)",
  tel: "070-4150-1172",
  fax: "044-868-1172",
  email: "public-id@naver.com",
  url: "https://www.public-id.co.kr",
  blog: "https://blog.naver.com/public-id",
  youtube: "https://www.youtube.com/@퍼블릭아이디",
  instagram: "https://www.instagram.com/_public.id/",
  tistory: "https://public-id.tistory.com",
  kakao: "https://pf.kakao.com/_jxoGrX", // 카카오톡 채널 '퍼블릭아이디'(2026-09-12 개설, 09-30 공개 설정)
  boim: "https://boim.io", // 보임 — 퍼블릭아이디가 운영하는 AI 에이전트용 업체 찾기(2026-10-07 대표 "1,2 해" — 외부 언급)
  designShare: "https://public-greensign.com", // 디자인 시안 사이트 — 보낸 시안이 레퍼런스로 쌓이는 곳(2026-11-18 대표 "우리 홈페이지에도 이 페이지 연결될 수 있게")
  // GNB는 5개(대표 지시 2026-08-25 "메뉴 4~5개"), 순서 = 회사소개→제품→구독 서비스→실적·인증→소식(대표 지시 2026-08-26).
  // 2026-11-17 다이어트(대표 "페이지가 너무 많은 느낌 — 필요 없는 부분은 삭제해도"): 하위 27줄 → 19줄.
  //  · 합친 쪽은 그 쪽 안의 자리(#)로 잇는다 — 사업영역 = /about#work, 인증·특허 = /credibility#credentials,
  //    견적 시뮬레이터 = /quote#simulator, 보도자료 = /news. 옛 주소는 next.config.ts 301.
  //  · 게임·진단·웹툰·제보는 헤더에서 내리고 푸터 '체험·참여' 묶음과 홈 PlayStrip에서 닿는다(방문 기록상 헤더가 아니라 홈·영상 댓글에서 들어온다).
  nav: [
    {
      label: "회사소개", en: "About", href: "/about",
      children: [
        { label: "사업영역", href: "/about#work" },
        { label: "3D 월드", href: "/world" },
      ],
    },
    {
      // 제품 메뉴 = /products 페이지 구성 그대로(제품 5종 → 출력 컬렉션 2종 → 가이드 → 견적)
      // — 대표 지적 2026-08-26 "제품이 메뉴와 하단 구성이 맞질 않아".
      label: "제품", en: "Products", href: "/products",
      children: [
        { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
        { label: "노란발자국", href: "/products#footprint" },
        { label: "친환경 그래픽 직물시트", href: "/products#fabric" },
        { label: "노란볼라드", href: "/products#bollard" },
        { label: "친환경 홍보판촉물", href: "/products#promo" },
        { label: "명화 컬렉션", href: "/products/art-fabric" },
        { label: "국내외 지도 컬렉션", href: "/products/map-banner" },
        { label: "부착 가이드 · 설치 영상", href: "/guide" },
        { label: "맞춤 견적 · 시뮬레이터", href: "/quote" },
      ],
    },
    {
      label: "구독 서비스", en: "Subscription", href: "/subscribe",
      children: [
        { label: "우리회사OS (AI 자동화)", href: "/os" }, // 2026-09-17 대표 지시 — 제품 메뉴에서 구독 메뉴로 이동 · 09-19 주종목이라 맨 위로
        { label: "디자인 구독", href: "/subscribe" },
        { label: "디자인 시스템", href: "/design" },
        { label: "안전관리 지도", href: "/safety-map" },
      ],
    },
    {
      label: "실적·인증", en: "Track Record", href: "/credibility",
      children: [{ label: "인증·특허", href: "/credibility#credentials" }],
    },
    {
      label: "소식", en: "News", href: "/news",
      children: [
        { label: "보도자료", href: "/news" },
        { label: "블로그", href: "/blog" },
        { label: "영상관", href: "/videos" },
      ],
    },
  ],
  // 푸터 전체 지도 — 헤더에 없는 쪽도 여기서 전부 닿는다(검색 = src/lib/search-index.ts).
  footerGroups: [
    {
      label: "회사소개",
      links: [
        { label: "회사소개", href: "/about" },
        { label: "사업영역", href: "/about#work" },
        { label: "실적", href: "/credibility" },
        { label: "인증·특허", href: "/credibility#credentials" },
        { label: "3D 월드", href: "/world" },
      ],
    },
    {
      label: "제품",
      links: [
        { label: "제품 전체", href: "/products" },
        { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
        { label: "노란발자국", href: "/products#footprint" },
        { label: "친환경 그래픽 직물시트", href: "/products#fabric" },
        { label: "노란볼라드", href: "/products#bollard" },
        { label: "친환경 홍보판촉물", href: "/products#promo" },
        { label: "명화 컬렉션", href: "/products/art-fabric" },
        { label: "국내외 지도 컬렉션", href: "/products/map-banner" },
        { label: "부착 가이드", href: "/guide" },
        { label: "맞춤 견적 · 시뮬레이터", href: "/quote" },
      ],
    },
    {
      label: "구독 서비스",
      links: [
        { label: "우리회사OS (AI 자동화)", href: "/os" },
        { label: "AI 자동화 무료 진단", href: "/os#scan" },
        { label: "디자인 구독", href: "/subscribe" },
        { label: "디자인 시스템", href: "/design" },
        { label: "안전관리 지도", href: "/safety-map" },
      ],
    },
    {
      label: "체험·참여",
      links: [
        { label: "숨은 위험 찾기 (게임)", href: "/safety-game" },
        { label: "노란발자국 캠페인 (게임)", href: "/campaign-game" },
        { label: "우리 동네 안전 점수", href: "/safety-score" },
        { label: "웹툰", href: "/webtoon" },
        { label: "안전 리포트 · 제보", href: "/safety-report" },
      ],
    },
    {
      label: "소식",
      links: [
        { label: "소식 · 보도자료", href: "/news" },
        { label: "블로그", href: "/blog" },
        { label: "영상관", href: "/videos" },
        { label: "질문 답변", href: "/answers" },
        { label: "문의", href: "/contact" },
      ],
    },
  ],
  // 바깥 판매 채널만(2026-11-17 — 사이트 안 주소 /os·/os#scan 은 푸터 '구독 서비스' 묶음으로 옮겼다)
  stores: [
    { label: "네이버 스마트스토어", href: "https://smartstore.naver.com/public-id" },
    {
      label: "쿠팡",
      href: "https://shop.coupang.com/publicid/129466?platform=p&source=brandstore_sdp_atf&pid=7881558209&viid=88608367140&ocid=20063148&checkBatchDelivery=true&brandId=0",
    },
    { label: "e-store 36.5 (가치장터)", href: "https://www.sepp.or.kr/store365" },
  ],
} as const;
