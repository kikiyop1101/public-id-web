// 우리회사OS 시리즈 — 소개 허브(/os)용 정본.
// 2026-08-21 실측: 래피드 스토어 21종(무료점검 1 + 실행 키트 15 + 미니 5). 이 배열은 유료 키트 20종.
// 상품명·가격 정본 = `Agent\관리본부\PI-OS\배포판\가격안-내부용.md`(전 상품 부가세 포함 표기).
// 래피드 링크 정본 = `Agent\관리본부\PI-Kits\래피드-상품링크-정본.md`(2026-08-20 실측).
// ⚠️ 래피드에는 구매자용 검색이 없다 — 반드시 직링크로 보낸다.

export type Kit = {
  /** 시리즈 번호 표기 (①~⑫) */
  no: string
  /** 짧은 이름 — 목록 제목 */
  name: string
  /** 한 줄 설명 — 등록 상품명의 부제 */
  tagline: string
  /** 런칭가(부가세 포함) */
  price: number
  /** 정가(부가세 포함) */
  listPrice: number
  url: string
  /** 이 킷이 덜어 주는 일 */
  group: '시작' | '운영' | '콘텐츠' | '영업·매출' | '숫자·재고' | '미니'
}

export const KITS: Kit[] = [
  {
    no: '①',
    name: '진단',
    tagline: '뭘 AI에 맡길지, 1시간 만에 우선순위 리포트',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/Iwc4O',
    group: '시작',
  },
  {
    no: '②',
    name: '업무시트',
    tagline: '구글시트 한 판으로 세우는 회사 운영',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/RyQ0W',
    group: '운영',
  },
  {
    no: '④',
    name: 'AI 직원 5명',
    tagline: '24시간 일하는 AI 팀, 승인만 대표가',
    price: 590000,
    listPrice: 890000,
    url: 'https://www.latpeed.com/products/Vrm20',
    group: '운영',
  },
  {
    no: '④',
    name: '셀러편',
    tagline: '1인 쇼핑몰 전용 AI 직원 프리셋',
    price: 590000,
    listPrice: 890000,
    url: 'https://www.latpeed.com/products/OWLtA',
    group: '운영',
  },
  {
    no: '③',
    name: '콘텐츠',
    tagline: '인스타·유튜브·스레드 자동 발행',
    price: 290000,
    listPrice: 490000,
    url: 'https://www.latpeed.com/products/UW-uP',
    group: '콘텐츠',
  },
  {
    no: '③',
    name: '블로그편',
    tagline: '검색이 좋아하는 블로그 원고, 구조부터 자동 조립',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/UDqyq',
    group: '콘텐츠',
  },
  {
    no: '③',
    name: '쇼츠편',
    tagline: '쇼츠 대본·자막(SRT) 자동 생성, 촬영만 하세요',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/tdmPs',
    group: '콘텐츠',
  },
  {
    no: '⑤',
    name: '상세페이지',
    tagline: '질문표만 채우면 상세페이지가 조립됩니다',
    price: 129000,
    listPrice: 199000,
    url: 'https://www.latpeed.com/products/XnBHK',
    group: '콘텐츠',
  },
  {
    no: '⑥',
    name: '리뷰답글',
    tagline: '리뷰 100개, 답글 초안은 1분',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/3X9ij',
    group: '영업·매출',
  },
  {
    no: '⑦',
    name: '회의록',
    tagline: '녹취 붙여넣으면 회의록·할일·후속메일 3종',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/OugBl',
    group: '운영',
  },
  {
    no: '⑧',
    name: '견적3안',
    tagline: '상담 메모가 A/B/C 견적서 3장으로',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/OT3HP',
    group: '영업·매출',
  },
  {
    no: '⑨',
    name: '월말마감',
    tagline: '매출·비용 CSV로 끝내는 월간 마감 리포트',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/KIqPT',
    group: '숫자·재고',
  },
  {
    no: '⑩',
    name: '사장브리핑',
    tagline: '출근 전 3분, 오늘의 경보와 할 일',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/gu2rm',
    group: '숫자·재고',
  },
  {
    no: '⑪',
    name: '리드발굴',
    tagline: '뉴스 신호로 찾는 B2G·B2B 영업 타겟',
    price: 129000,
    listPrice: 199000,
    url: 'https://www.latpeed.com/products/ldrwX',
    group: '영업·매출',
  },
  {
    no: '⑫',
    name: '발주경보',
    tagline: '품절 나기 전에 발주 시점을 알려 드립니다',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/TIq9w',
    group: '숫자·재고',
  },
  {
    no: '미니①',
    name: '한장소개',
    tagline: '우리 회사 소개, 한 장으로 정리',
    price: 9900,
    listPrice: 19900,
    url: 'https://www.latpeed.com/products/5VDre',
    group: '미니',
  },
  {
    no: '미니②',
    name: '안내문',
    tagline: '휴무·가격 변경 안내문을 바로 작성',
    price: 9900,
    listPrice: 19900,
    url: 'https://www.latpeed.com/products/UN10C',
    group: '미니',
  },
  {
    no: '미니③',
    name: '고객문자',
    tagline: '예약 확인·리뷰 요청 문자 문구 세트',
    price: 9900,
    listPrice: 19900,
    url: 'https://www.latpeed.com/products/pp5Vo',
    group: '미니',
  },
  {
    no: '미니④',
    name: '가격표',
    tagline: '메뉴판·가격표를 보기 좋게 한 장으로',
    price: 9900,
    listPrice: 19900,
    url: 'https://www.latpeed.com/products/vcbZw',
    group: '미니',
  },
  {
    no: '미니⑤',
    name: '마진계산',
    tagline: '팔수록 손해인 품목을 숫자로 확인',
    price: 9900,
    listPrice: 19900,
    url: 'https://www.latpeed.com/products/ijSDg',
    group: '미니',
  },
]

export const KIT_GROUPS: { key: Kit['group']; title: string; desc: string }[] = [
  { key: '시작', title: '여기서 시작', desc: '뭘 먼저 바꿔야 할지부터 정합니다' },
  { key: '운영', title: '회사 운영', desc: '흩어진 업무를 한 판으로 세웁니다' },
  { key: '콘텐츠', title: '콘텐츠·홍보', desc: '올려야 하는 걸 알지만 미루던 일' },
  { key: '영업·매출', title: '영업·매출', desc: '대응 속도가 곧 매출이 되는 자리' },
  { key: '숫자·재고', title: '숫자·재고', desc: '숫자가 대표를 기다리지 않게' },
  { key: '미니', title: '미니 5종', desc: '한 장이면 끝나는 일들 — 전 종 9,900원' },
]

/** 래피드 퍼블릭아이디 스토어 — 21종 전부가 보이는 목록(2026-08-21 실측) */
export const LATPEED_STORE_URL = 'https://www.latpeed.com/stores/TebXT'

export function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR')
}
