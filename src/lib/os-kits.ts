// 우리회사OS 시리즈 — 소개 허브(/os)용 정본.
// 2026-09-16 기준: 래피드 스토어 38종(무료 ①진단 1 + 유료 실행 키트 26 + 업종 패키지 6 + 미니 5). 이 배열이 38종 전부다.
//   별도 상품이던 "0원 무료점검"(래피드 Sp-3I)은 ①진단(0원)으로 통합돼 없다.
// 가격 정본 = `Agent\관리본부\PI-Kits\상품-정본.json`(정가·런칭가, 전 상품 부가세 포함 표기) · 근거 `PI-OS\배포판\가격안-내부용.md`.
// 2026-09-16 가격 복귀(대표 확정): 09-09 "실행 킷 29,000 단일가·패키지 99,000" 개편을 되돌려 이전 사다리로 —
//   ①진단 0원 · 입문 49,000/79,000 · 실무 99,000/149,000 · 고가치 129,000/199,000 · ④AI 직원 5명·④셀러편 590,000/890,000.
//   러닝코스트 공개·후기단(0원·5명)·④ AI 설치형 설명은 유지.
// 래피드 링크 정본 = `Agent\관리본부\PI-Kits\래피드-상품링크-정본.md`(2026-08-20 실측).
// ⚠️ 래피드에는 구매자용 검색이 없다 — 반드시 직링크로 보낸다.

export type Kit = {
  /** 시리즈 번호 표기 (①~㉙ · 미니①~⑤ · 팩①~⑥) */
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
  group: '시작' | '운영' | '콘텐츠' | '영업·매출' | '숫자·재고' | '패키지' | '미니'
}

export const KITS: Kit[] = [
  {
    no: '①',
    name: '진단',
    tagline: '뭘 AI에 맡길지, 1시간 만에 우선순위 리포트',
    price: 0,
    listPrice: 0,
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
    tagline: 'AI가 설치하는 24시간 AI 팀, 승인만 대표가',
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
  {
    no: '⑬',
    name: '수금독촉',
    tagline: '미수금 목록 한 장으로 독촉 문안 3단계',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/4pVCd',
    group: '영업·매출',
  },
  {
    no: '⑭',
    name: '예약관리',
    tagline: '확인·리마인드·노쇼 문자 자동 조립',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/-hN_r',
    group: '운영',
  },
  {
    no: '⑮',
    name: '지원사업 매칭',
    tagline: '정부 지원사업 적격 판정 + 신청서 초안',
    price: 129000,
    listPrice: 199000,
    url: 'https://www.latpeed.com/products/hA68h',
    group: '영업·매출',
  },
  {
    no: '⑯',
    name: '메일함 정리',
    tagline: '받은 메일 자동 분류 + 답장 초안',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/hhXoZ',
    group: '운영',
  },
  {
    no: '⑰',
    name: 'FAQ응대',
    tagline: '같은 문의 답변 초안 자동',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/80Dh8',
    group: '운영',
  },
  {
    no: '⑱',
    name: '증빙정리',
    tagline: '부가세 신고 전 증빙 대사, 반나절이 20분으로',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/MmQm4',
    group: '숫자·재고',
  },
  {
    no: '⑲',
    name: '채용도우미',
    tagline: '공고문과 지원서 정리표',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/8zunm',
    group: '운영',
  },
  {
    no: '⑳',
    name: '거래명세서',
    tagline: '납품기록으로 명세서·발행대장·재고차감 한 번에',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/pyhWA',
    group: '숫자·재고',
  },
  {
    no: '㉒',
    name: '성적통지문',
    tagline: '성적표 한 장으로 학생별 통지문·학부모 문구',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/zX33_',
    group: '운영',
  },
  {
    no: '㉓',
    name: '재고대장',
    tagline: '입출고 기록으로 현재고·회전율·장기재고 한 장에',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/YZKyy',
    group: '숫자·재고',
  },
  {
    no: '㉔',
    name: '반품사유 집계',
    tagline: '반품 사유가 Top3 원인과 수정 제안으로',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/syLHN',
    group: '숫자·재고',
  },
  {
    no: '㉙',
    name: '재방문 리마인드',
    tagline: '주기 넘긴 단골 명단과 문자 문구 자동',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/S0bCF',
    group: '영업·매출',
  },
  {
    no: '㉚',
    name: 'AI 회사맥락',
    tagline: '회사 규칙·사람별 성향·업무 경험을 AI가 읽는 세 칸으로',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/e9QUl',
    group: '운영',
  },
  {
    no: '㉛',
    name: '자금 달력',
    tagline: '급여날·세금날 잔액을 90일 앞서 봅니다',
    price: 129000,
    listPrice: 199000,
    url: 'https://www.latpeed.com/products/bUleC',
    group: '숫자·재고',
  },
  {
    no: '㉜',
    name: '알바 근태·주휴수당',
    tagline: '출퇴근 기록으로 주휴수당·임금명세서',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/RUnjO',
    group: '운영',
  },
  {
    no: '㉝',
    name: '계약서 사전 점검',
    tagline: '서명 전에 빠진 조항·불리한 조항 점검',
    price: 99000,
    listPrice: 149000,
    url: 'https://www.latpeed.com/products/l7sW8',
    group: '영업·매출',
  },
  {
    no: '㉕',
    name: '고정지출 점검',
    tagline: '카드·통장 내역에서 매달 새는 구독료를 한 장에',
    price: 49000,
    listPrice: 79000,
    url: 'https://www.latpeed.com/products/RLDcF',
    group: '숫자·재고',
  },
  {
    no: '팩①',
    name: '예약업 패키지',
    tagline: '미용실·학원·병의원·공방 반복 업무 5종 묶음',
    price: 190000,
    listPrice: 290000,
    url: 'https://www.latpeed.com/products/BuSPB',
    group: '패키지',
  },
  {
    no: '팩②',
    name: '매장 패키지',
    tagline: '카페·식당·소매점 종이 일과 숫자 일 5종 묶음',
    price: 145000,
    listPrice: 220000,
    url: 'https://www.latpeed.com/products/hm5d0',
    group: '패키지',
  },
  {
    no: '팩③',
    name: '사무 B2B 패키지',
    tagline: '견적→수금→마감, 거래처 업무 5종 묶음',
    price: 280000,
    listPrice: 420000,
    url: 'https://www.latpeed.com/products/_KkM2',
    group: '패키지',
  },
  {
    no: '팩④',
    name: '셀러 라이트 패키지',
    tagline: '1인 셀러 반복 업무 5종 묶음',
    price: 260000,
    listPrice: 390000,
    url: 'https://www.latpeed.com/products/0EA02',
    group: '패키지',
  },
  {
    no: '팩⑤',
    name: '학원·교습소 패키지',
    tagline: '성적통지·보강예약·학부모 문자·소개서 한 묶음',
    price: 190000,
    listPrice: 290000,
    url: 'https://www.latpeed.com/products/teYWp',
    group: '패키지',
  },
  {
    no: '팩⑥',
    name: '도소매·유통 패키지',
    tagline: '거래명세서부터 월말마감까지 한 규격 한 바퀴',
    price: 260000,
    listPrice: 390000,
    url: 'https://www.latpeed.com/products/MGecn',
    group: '패키지',
  },
]

export const KIT_GROUPS: { key: Kit['group']; title: string; desc: string }[] = [
  { key: '시작', title: '여기서 시작', desc: '뭘 먼저 바꿔야 할지부터 정합니다' },
  { key: '운영', title: '회사 운영', desc: '흩어진 업무를 한 판으로 세웁니다' },
  { key: '콘텐츠', title: '콘텐츠·홍보', desc: '올려야 하는 걸 알지만 미루던 일' },
  { key: '영업·매출', title: '영업·매출', desc: '대응 속도가 곧 매출이 되는 자리' },
  { key: '숫자·재고', title: '숫자·재고', desc: '숫자가 대표를 기다리지 않게' },
  { key: '패키지', title: '업종 패키지', desc: '내 업종에 필요한 킷만 묶어 한 번에' },
  { key: '미니', title: '미니 5종', desc: '한 장이면 끝나는 일들 — 전 종 9,900원' },
]

/** 올인원 키트 — 업종 패키지를 뺀 판매 상품 전부를 겹침 없이 한 묶음(대표 확정 2026-09-17).
 *  런칭가 없음 · 5,500,000원 부가세 포함 고정가(09-18 대표: 킷을 계속 채워 할인율을 올린다 — 재검토는 낱개 정가 합 1,000만 원 넘을 때).
 *  래피드·크몽 등록은 대표 지시로 보류 — 구독 상담(/contact)으로만 판매한다. 정본 = 볼트 PI-Kits\상품-정본.json(PI-Pack-All) */
export const ALL_IN_ONE = {
  price: 5500000,
}
export const ALL_IN_ONE_MEMBERS = KITS.filter((k) => k.group !== '패키지')
/** 올인원 할인율(%, 정수) = 1 − 올인원가 ÷ 구성 킷 낱개 정가 합. 킷이 늘면 자동으로 오른다. 1 미만이면 화면에 할인을 적지 않는다(09-18). */
export const ALL_IN_ONE_LIST_SUM = ALL_IN_ONE_MEMBERS.reduce((s, k) => s + k.listPrice, 0)
export const ALL_IN_ONE_DISCOUNT = Math.floor((1 - ALL_IN_ONE.price / ALL_IN_ONE_LIST_SUM) * 100)

/** 래피드 퍼블릭아이디 스토어 — 우리회사OS 전 상품이 보이는 목록(2026-08-31 실측, 09-16 무료점검 통합으로 38종) */
export const LATPEED_STORE_URL = 'https://www.latpeed.com/stores/TebXT'

/** 우리회사OS 무료 멤버(0원·월 1회 레터·신규 킷 선공개) — 2026-08-31 개설, 09-09 대표 결정으로 /os 노출 */
export const LATPEED_MEMBERSHIP_URL = 'https://www.latpeed.com/memberships/6a621ed13abdc26c1c23f412'

/** 첫 후기단 5명(실행 키트 8종 0원·1주 안에 래피드 후기 한 줄) — 2026-09-09 개설, 09-18 8종·1주·래피드 후기로 개편 */
export const LATPEED_REVIEWERS_URL = 'https://www.latpeed.com/products/cOCO5'

export function formatPrice(n: number): string {
  return n.toLocaleString('ko-KR')
}

/** 가격 표기 — 0원 상품(①진단)은 "무료", 나머지는 "49,000원" */
export function priceLabel(n: number): string {
  return n === 0 ? '무료' : `${formatPrice(n)}원`
}
