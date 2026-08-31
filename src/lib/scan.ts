// 우리회사OS 무료 진단 데이터 — 5영역 × 3문항(빈도·시간·방식). 점수 0~3, 영역 0~9, 총 0~45.
// 판매채널 정본 = 래피드(latpeed.com). 가격은 `PI-OS\배포판\가격안-내부용.md` §상품명 정본을 따른다(부가세 포함).

export type Area = {
  name: string
  short: string
  /** 이 영역을 AI로 바꿨을 때 주당 돌려받을 수 있는 시간의 상한(추정) */
  maxHours: number
  prescription: string
  desc: string
}

export const AREAS: Area[] = [
  {
    name: '반복 문서·행정',
    short: '문서·행정',
    maxHours: 5,
    prescription:
      '견적서·공문·안내문은 템플릿과 AI 초안으로 바꾸면 문서 1건이 10분 안으로 줄어듭니다.',
    desc: '견적서·계약서·공문·안내문 등 반복 문서 업무',
  },
  {
    name: '콘텐츠·홍보',
    short: '콘텐츠',
    maxHours: 6,
    prescription:
      '소재 발굴부터 초안까지 AI에 맡기고, 검수와 발행만 사람이 하는 구조로 바꿀 수 있습니다.',
    desc: '블로그·인스타·스토어 소식 등 홍보 콘텐츠 제작',
  },
  {
    name: '고객 응대',
    short: '고객 응대',
    maxHours: 4,
    prescription:
      '자주 오는 질문 답변과 리뷰 답글은 AI 초안이 가장 빨리 효과를 보는 영역입니다.',
    desc: '문의·리뷰·전화 등 고객 커뮤니케이션',
  },
  {
    name: '매출·판로',
    short: '매출·판로',
    maxHours: 4,
    prescription:
      '견적 3안 구성과 타겟 리스트업을 AI에 맡기면 대응 속도가 매출로 이어집니다.',
    desc: '견적 대응·제안·신규 판로 개척',
  },
  {
    name: '데이터·정리',
    short: '데이터',
    maxHours: 3,
    prescription:
      'CSV를 붙여 넣으면 월간 리포트가 나오는 구조로 바꾸면 숫자가 대표를 기다리지 않습니다.',
    desc: '매출·비용·재고 등 숫자 집계와 정리',
  },
]

export type Question = { area: number; text: string; options: string[] }

export const QUESTIONS: Question[] = [
  // ① 반복 문서·행정
  {
    area: 0,
    text: '견적서·계약서·공문 같은 문서를 얼마나 자주 만드나요?',
    options: ['거의 만들 일이 없다', '월 1~2회', '주 1~2회', '거의 매일'],
  },
  {
    area: 0,
    text: '문서 한 건을 만드는 데 보통 얼마나 걸리나요?',
    options: ['10분 이내', '30분 정도', '1시간 정도', '반나절 이상'],
  },
  {
    area: 0,
    text: '문서는 주로 어떤 방식으로 만드나요?',
    options: [
      '자동화 도구가 채워 준다',
      '템플릿을 복사해 수정한다',
      '예전 파일을 찾아 고쳐 쓴다',
      '매번 처음부터 새로 쓴다',
    ],
  },
  // ② 콘텐츠·홍보
  {
    area: 1,
    text: '홍보 콘텐츠(블로그·SNS·스토어 소식)를 올리거나, 올려야 한다고 느끼는 주기는?',
    options: ['당장은 필요 없다', '월 1~2회', '주 1~2회', '거의 매일'],
  },
  {
    area: 1,
    text: '콘텐츠 1건(글·이미지)을 만드는 데 얼마나 걸리나요?',
    options: ['30분 이내', '1시간 정도', '2~3시간', '한나절 이상이라 자주 미룬다'],
  },
  {
    area: 1,
    text: '콘텐츠 소재와 문구는 어떻게 정하나요?',
    options: [
      '자동 발행 시스템이 있다',
      'AI로 초안을 뽑고 다듬는다',
      '그때그때 검색하며 직접 쓴다',
      '막막해서 손을 못 대고 있다',
    ],
  },
  // ③ 고객 응대
  {
    area: 2,
    text: '문의·리뷰·전화 응대는 하루에 얼마나 되나요?',
    options: ['거의 없다', '하루 1~2건', '하루 5건 이상', '수시로 와서 일이 끊긴다'],
  },
  {
    area: 2,
    text: '응대에 쓰는 시간은 하루 기준 어느 정도인가요?',
    options: ['10분 이내', '30분 정도', '1시간 이상', '2시간 이상'],
  },
  {
    area: 2,
    text: '자주 오는 질문에는 어떻게 답하나요?',
    options: [
      '자동 응답이나 챗봇을 쓴다',
      '답변 템플릿을 재사용한다',
      '매번 새로 타이핑한다',
      '밀려서 놓치는 경우도 있다',
    ],
  },
  // ④ 매출·판로
  {
    area: 3,
    text: '새 판로 개척(입점·제안·영업)이 얼마나 필요한 상황인가요?',
    options: [
      '지금 판로로 충분하다',
      '조금 더 필요하다',
      '많이 필요하다',
      '매출이 걸린 급한 문제다',
    ],
  },
  {
    area: 3,
    text: '견적 요청이나 제안 기회가 왔을 때 대응까지 얼마나 걸리나요?',
    options: ['그 자리에서 바로', '당일 안에', '2~3일', '일주일 이상, 놓친 적도 있다'],
  },
  {
    area: 3,
    text: '잠재 고객·영업 기회 정보는 어떻게 관리하나요?',
    options: [
      '시스템이 자동으로 관리한다',
      '엑셀·시트에 정리한다',
      '메모·카톡에 흩어져 있다',
      '따로 관리하지 않는다',
    ],
  },
  // ⑤ 데이터·정리
  {
    area: 4,
    text: '매출·비용·재고 숫자 정리에 손이 가는 주기는?',
    options: [
      '자동으로 집계된다',
      '월 1회 몰아서 한다',
      '주 1회 이상 한다',
      '거의 매일 수기로 한다',
    ],
  },
  {
    area: 4,
    text: '월말 정산·마감에 쓰는 시간은 어느 정도인가요?',
    options: ['1시간 이내', '반나절', '하루 종일', '며칠씩 걸린다'],
  },
  {
    area: 4,
    text: '"이번 달 매출이 얼마죠?"에 바로 답할 수 있나요?',
    options: [
      '대시보드에서 바로 확인한다',
      '시트를 열어 보면 안다',
      '자료를 찾아봐야 한다',
      '정확히 모른다',
    ],
  },
]

export const MAX_TOTAL = QUESTIONS.length * 3

/** 영역별 점수(0~9) */
export function areaScores(answers: number[]): number[] {
  const s = [0, 0, 0, 0, 0]
  QUESTIONS.forEach((q, i) => {
    s[q.area] += Math.max(0, answers[i] ?? 0)
  })
  return s
}

/** 우선순위 — 점수 내림차순(동점이면 영역 순서) */
export function priorityOrder(scores: number[]): number[] {
  return [0, 1, 2, 3, 4].sort((a, b) => scores[b] - scores[a] || a - b)
}

/** 예상 절감 시간 = Σ(영역점수 / 9 × 영역 최대 절감시간) */
export function savedHours(scores: number[]): number {
  return Math.round(scores.reduce((sum, v, i) => sum + (v / 9) * AREAS[i].maxHours, 0))
}

export function verdict(total: number): { level: string; summary: string } {
  if (total >= 30)
    return {
      level: '위임 여지 매우 큼',
      summary:
        '지금 대표와 직원의 시간 상당수가 AI로 대체 가능한 반복 업무에 잡혀 있습니다. 아래 우선순위대로 하나씩만 바꿔도 체감이 큽니다.',
    }
  if (total >= 18)
    return {
      level: '위임 여지 큼',
      summary:
        '몇 개 영역에 반복 업무가 뚜렷하게 몰려 있습니다. 전부 바꾸려 하지 말고, 아래 TOP3부터 순서대로 시작하세요.',
    }
  if (total >= 9)
    return {
      level: '위임 여지 보통',
      summary:
        '업무가 비교적 정돈되어 있습니다. 점수가 높게 나온 한두 영역만 AI로 보강하면 충분합니다.',
    }
  return {
    level: '이미 잘 정돈됨',
    summary:
      '반복 업무 부담이 적은 편입니다. 지금 구조를 유지하면서, 점수가 가장 높은 영역 하나만 지켜보세요.',
  }
}

/** 판매채널 정본 = 래피드. 래피드에는 구매자용 검색이 없어(2026-08-20 실측: /search·/explore 404)
 *  반드시 상품 직링크로 보낸다 — "래피드에서 검색" 안내는 고객이 실행할 수 없다. */
export const LATPEED_URL = 'https://www.latpeed.com/products/Iwc4O'

export const SERIES = [
  {
    name: '②업무시트',
    desc: '구글시트 한 판으로 세우는 회사 운영',
    price: '99,000원',
    url: 'https://www.latpeed.com/products/RyQ0W',
  },
  {
    name: '③콘텐츠',
    desc: '인스타·유튜브·스레드 자동 발행',
    price: '290,000원',
    url: 'https://www.latpeed.com/products/UW-uP',
  },
  {
    name: '④AI 직원 5명',
    desc: '24시간 일하는 AI 팀, 승인만 대표가',
    price: '590,000원',
    url: 'https://www.latpeed.com/products/Vrm20',
  },
  {
    name: '④셀러편',
    desc: '1인 쇼핑몰 전용 AI 직원 프리셋',
    price: '590,000원',
    url: 'https://www.latpeed.com/products/OWLtA',
  },
]

/** 래피드 퍼블릭아이디 스토어 — 시리즈 전체 보기.
 *  컬렉션(`/collections/6a79…`)이 아니라 **스토어**를 쓴다 — 컬렉션엔 주력 5종만 있고
 *  스토어 목록에 39종 전부가 있다(2026-08-31 실측). 정본표 = PI-Kits\래피드-상품링크-정본.md */
export const LATPEED_COLLECTION_URL = 'https://www.latpeed.com/stores/TebXT'
