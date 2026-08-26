// 사이트 전체 검색 인덱스 (2026-08-26 신설 — 대표: "페이지를 줄이긴 싫고, 찾기 쉽게").
// 페이지가 늘면 여기 한 줄을 추가한다. keywords에는 방문자가 칠 법한 말(제품명·비표준 표기·용도)을 넣는다.
export type SearchEntry = {
  label: string;
  href: string;
  group: string;
  desc: string;
  keywords: string;
  external?: boolean;
};

export const SEARCH_INDEX: SearchEntry[] = [
  // 회사소개
  { label: "회사소개", href: "/about", group: "회사소개", desc: "사회적기업 · KIDP 종합산업디자인전문회사", keywords: "퍼블릭아이디 소개 연혁 사회적기업 조용민 세종" },
  { label: "사업영역", href: "/work", group: "회사소개", desc: "노면표시 · 브랜드 콘텐츠 · 웨이파인딩 등 하는 일 전체", keywords: "사업 서비스 포트폴리오 디자인 영역" },
  { label: "3D 월드", href: "/world", group: "회사소개", desc: "스크롤로 둘러보는 퍼블릭아이디 월드", keywords: "월드 3d 소개 영상 인터랙티브" },
  // 제품
  { label: "제품 전체", href: "/products", group: "제품", desc: "친환경 제품군 5종 — 사진과 기준가", keywords: "제품 카탈로그 가격 기준가" },
  { label: "친환경 그래픽 노면표시재", href: "/products#roadmark", group: "제품", desc: "부착식 알루미늄 스티커 — 특허받은 제품, 46BPN", keywords: "노면표시 바닥 스티커 횡단보도 특허 미끄럼 도로 시공" },
  { label: "노란발자국", href: "/products#footprint", group: "제품", desc: "횡단보도 앞 보도의 안심 대기선", keywords: "노란발자국 스쿨존 어린이보호구역 대기선 등굣길" },
  { label: "친환경 그래픽 직물시트", href: "/products#fabric", group: "제품", desc: "벽면·기둥·천장을 덮는 친환경 직물시트", keywords: "직물시트 벽면 래핑 기둥 안내판" },
  { label: "노란볼라드", href: "/products#bollard", group: "제품", desc: "기존 볼라드 직물시트 드레스업 — 2023 굿디자인 선정", keywords: "노란볼라드 볼라드 드레스업 어린이보호구역 스쿨존 gd 굿디자인" },
  { label: "친환경 홍보판촉물", href: "/products#promo", group: "제품", desc: "타이벡 소재 친환경 판촉물", keywords: "판촉물 타이벡 홍보물 굿즈 기념품" },
  { label: "명화 컬렉션", href: "/products/art-fabric", group: "제품", desc: "명화 132점 — 직물시트·현수막 두 소재로 출력", keywords: "명화 그림 아트 반고흐 모네 클림트 민화 갤러리 직물시트 현수막" },
  { label: "국내외 지도 컬렉션", href: "/products/map-banner", group: "제품", desc: "전도·행정지도·세계지도 — 직물시트·현수막 두 소재로 출력", keywords: "지도 현수막 직물시트 전도 행정지도 세계지도 대동여지도 대형 출력" },
  { label: "부착 가이드 · 설치 영상", href: "/guide", group: "제품", desc: "노면표시재 셀프 부착 방법 영상", keywords: "설치 부착 시공 방법 가이드 영상 diy" },
  { label: "맞춤 견적", href: "/quote", group: "제품", desc: "규격·수량 넣고 바로 받는 견적", keywords: "견적 가격 문의 계산 주문" },
  { label: "우리회사OS (AI 자동화)", href: "/os", group: "제품", desc: "소상공인 AI 자동화 키트 — 무료 진단부터", keywords: "os ai 자동화 템플릿 키트 소상공인 진단 챗gpt" },
  { label: "AI 자동화 무료 진단", href: "/os#scan", group: "제품", desc: "우리 회사 업무 자동화 여지를 3분 만에 — 우리회사OS 안", keywords: "진단 무료진단 스캔 자가진단 진단테스트 업무진단 자동화 ai scan 3분" },
  // 구독
  { label: "구독 서비스", href: "/subscribe", group: "구독 서비스", desc: "디자인 구독 · 안전 시설 관리 구독", keywords: "구독 정기 멤버십 디자인구독" },
  { label: "디자인 시스템", href: "/design", group: "구독 서비스", desc: "색 하나 바꾸면 전부 바뀌는 정본 — 체험 데모·문서 전체", keywords: "마스코트 웹툰 로고 브랜드 디자인시스템 캐릭터 토큰 정본" },
  { label: "안전관리 지도", href: "/safety-map", group: "구독 서비스", desc: "시공한 안전시설을 지도에서 한눈에 관리", keywords: "안전지도 시설관리 지도 관리구독 발주처" },
  { label: "안전 리포트 · 제보", href: "/safety-report", group: "구독 서비스", desc: "노란발자국·노란볼라드 등 통학로 위험 지점 제보", keywords: "제보 신고 노란발자국 노란볼라드 통학로 스쿨존 안전리포트 캠페인" },
  // 실적·인증
  { label: "실적", href: "/credibility", group: "실적·인증", desc: "전국 시공 실적과 현장 사진", keywords: "실적 레퍼런스 사례 시공사진 포트폴리오" },
  { label: "인증·특허", href: "/credentials", group: "실적·인증", desc: "KIDP·사회적기업·GD 인증과 특허·성적서", keywords: "인증 특허 성적서 kidp gd 사회적기업 증빙" },
  // 소식
  { label: "소식 · 보도자료", href: "/news", group: "소식", desc: "보도자료와 활동 소식", keywords: "뉴스 보도자료 소식 언론" },
  { label: "기업 블로그", href: "/blog", group: "소식", desc: "퍼블릭아이디의 이야기와 현장 소식", keywords: "블로그 글 이야기 현장" },
  { label: "소통 게시판", href: "/board", group: "소식", desc: "누구나 자유롭게 남기는 의견·질문", keywords: "게시판 소통 의견 질문 커뮤니티 자유게시판" },
  { label: "문의하기", href: "/contact", group: "소식", desc: "상담·견적 문의 — 영업일 기준 빠른 회신", keywords: "문의 상담 연락 전화 이메일 컨택" },
  // 스토어(외부)
  { label: "네이버 스마트스토어", href: "https://smartstore.naver.com/public-id", group: "스토어", desc: "네이버에서 바로 구매", keywords: "스마트스토어 네이버 구매 쇼핑", external: true },
  { label: "네이버 블로그", href: "https://blog.naver.com/public-id", group: "스토어", desc: "네이버 블로그 최신 글", keywords: "네이버 블로그", external: true },
];

export const SEARCH_GROUPS = ["회사소개", "제품", "구독 서비스", "실적·인증", "소식", "스토어"];
