// "우리 동네 안전 점수" 진단 — 문항·채점·등급 정본 (2026-09-08 신설, 홈페이지 체류시간 기획 3안).
// 근거: 행정안전부 어린이 통학로 현장점검 분야 중 교통안전·보행환경 항목(보도·횡단보도·볼라드·노면표시·표지·주정차·조명·관리)을
// 담당자가 현장에서 눈으로 판정할 수 있는 8문항으로 옮겼다. 처방(fix)의 제품 사실은 products.ts·assistant-knowledge.ts 범위 안에서만 쓴다.
// 점수: 선택지 pts 0~3 × 문항 weight → 100점 환산. weight 합 = 100/3 이 되도록 정규화하지 않고, 아래 toScore()에서 (합 / 최대합) × 100.

export type Choice = {
  label: string
  /** 0(위험)~3(양호) */
  pts: 0 | 1 | 2 | 3
  /** 선택지 근거 한 줄 */
  why: string
}

export type Fix = {
  title: string
  body: string
  href: string
  cta: string
}

export type Question = {
  id: string
  /** 결과 차트 축 라벨(짧게) */
  axis: string
  title: string
  hint: string
  /** 문항 비중(합 100) */
  weight: number
  choices: Choice[]
  fix: Fix
}

export const QUESTIONS: Question[] = [
  {
    id: 'wait',
    axis: '대기 지점',
    title: '횡단보도 앞 보도에 "여기서 기다려요"가 표시되어 있나요?',
    hint: '아이들이 신호를 기다리는 자리가 보도 위에 그림·색으로 표시되어 있는지 봅니다.',
    weight: 16,
    choices: [
      { label: '표시가 없고, 아이들이 차도 끝까지 나와 서 있어요', pts: 0, why: '대기 위치가 없으면 발끝이 차도에 걸쳐 운전자가 아이를 늦게 봅니다.' },
      { label: '표시가 있었지만 지워져 잘 안 보여요', pts: 1, why: '마모된 표시는 있어도 아이들이 따르지 않습니다.' },
      { label: '노란발자국 같은 대기 표시가 선명하게 있어요', pts: 3, why: '보도 위 대기 공간이 그림으로 보이면 아이들이 스스로 물러서 기다립니다.' },
    ],
    fix: {
      title: '노란발자국으로 대기 공간을 그려 주세요',
      body: '횡단보도 앞 보도에 붙이는 노란발자국은 아이들이 신호를 기다릴 자리를 그림으로 알려 줍니다. 페인트가 아니라 인쇄된 알루미늄 박판 스티커라 시공이 빠르고, 기준가 전면형 600,000원~부터 시작합니다.',
      href: '/products#footprint',
      cta: '노란발자국 보기',
    },
  },
  {
    id: 'bollard',
    axis: '볼라드',
    title: '횡단보도 입구의 볼라드는 어떤 상태인가요?',
    hint: '차량 진입을 막는 볼라드가 있는지, 부러지거나 기울지 않았는지, 멀리서도 눈에 띄는지 봅니다.',
    weight: 12,
    choices: [
      { label: '볼라드가 없거나 부러진 채 방치되어 있어요', pts: 0, why: '차량이 보도로 올라올 수 있는 상태입니다.' },
      { label: '있지만 색이 바래고 기울어 눈에 잘 안 띄어요', pts: 1, why: '어두운 색·낡은 볼라드는 야간·우천 시 보행자도 부딪힙니다.' },
      { label: '있고 상태는 괜찮지만 회색이라 눈에 띄지 않아요', pts: 2, why: '기능은 하지만 어린이보호구역이라는 신호를 주지 못합니다.' },
      { label: '노란색 등으로 눈에 띄고 상태도 양호해요', pts: 3, why: '시인성 높은 볼라드는 운전자와 아이 모두에게 경계를 알립니다.' },
    ],
    fix: {
      title: '기존 볼라드에 노란볼라드 드레스업',
      body: '새로 설치하지 않고 기존 볼라드에 노란 직물시트를 감싸 어린이보호구역 시인성을 높입니다. 2023 굿디자인(GD)에 선정된 방식이고, 안전시설관리 구독으로 정기 관리도 이어집니다.',
      href: '/products#bollard',
      cta: '노란볼라드 보기',
    },
  },
  {
    id: 'marking',
    axis: '노면표시',
    title: '횡단보도 흰 선과 노면표시가 선명하게 보이나요?',
    hint: '낮에 10m 떨어져서 봤을 때 횡단보도·정지선·어린이보호구역 노면 문구가 또렷한지 봅니다.',
    weight: 14,
    choices: [
      { label: '선이 거의 지워져 어디가 횡단보도인지 헷갈려요', pts: 0, why: '운전자가 횡단보도를 인식하지 못하면 정지 자체가 늦어집니다.' },
      { label: '군데군데 벗겨져 얼룩덜룩해요', pts: 1, why: '부분 마모는 비 오는 날 시인성이 크게 떨어집니다.' },
      { label: '대체로 보이지만 최근 재도색 시기는 모르겠어요', pts: 2, why: '보이는 동안은 괜찮지만 언제 다시 칠할지 정해져 있지 않습니다.' },
      { label: '선명하고 정기적으로 관리되고 있어요', pts: 3, why: '노면표시는 정해진 주기로 살펴야 유지됩니다.' },
    ],
    fix: {
      title: '친환경 그래픽 노면표시재로 빠르게 되살리기',
      body: '도색 대신 인쇄된 알루미늄 박판을 붙이는 방식이라 반나절이면 시공되고 철거 시 끈적임이 남지 않습니다. 미끄럼저항 46BPN으로 서울시 보도포장 기준(45 이상)을 충족하며 기준가 132,000원/㎡입니다.',
      href: '/products#roadmark',
      cta: '노면표시재 보기',
    },
  },
  {
    id: 'sign',
    axis: '안내표지',
    title: '어린이보호구역 안내표지는 잘 보이는 상태인가요?',
    hint: '표지판이 녹슬거나 기울지 않았는지, 나뭇가지·현수막에 가려지지 않았는지 봅니다.',
    weight: 10,
    choices: [
      { label: '표지판이 없거나 쓰러져 있어요', pts: 0, why: '보호구역 시작을 운전자가 알 수 없습니다.' },
      { label: '있지만 녹슬고 기울거나 나뭇가지에 가려요', pts: 1, why: '가려진 표지는 없는 것과 같습니다.' },
      { label: '보이긴 하는데 색이 바래 눈에 덜 띄어요', pts: 2, why: '퇴색한 표지는 야간·역광에서 먼저 사라집니다.' },
      { label: '깨끗하고 멀리서도 또렷해요', pts: 3, why: '표지가 또렷해야 서행 구간이 시작됩니다.' },
    ],
    fix: {
      title: '어린이보호구역 안전표지 교체·보강',
      body: '주정차금지·어린이보호구역 등 규격별 안전표지를 제작합니다. 기존 안내판은 직물시트로 감싸 새것처럼 교체할 수도 있습니다(기준가 132,000원/㎡ 기준 규격별).',
      href: '/products#roadmark',
      cta: '안전표지 문의',
    },
  },
  {
    id: 'parking',
    axis: '주정차',
    title: '등하굣길에 횡단보도 근처 불법 주정차가 얼마나 있나요?',
    hint: '아침 8시 전후로 횡단보도 앞뒤 5m 안에 세워 둔 차량이 있는지, 아이들 시야를 가리는지 봅니다.',
    weight: 14,
    choices: [
      { label: '거의 매일 횡단보도 바로 앞에 차가 서 있어요', pts: 0, why: '주정차 차량은 아이의 키 높이 시야를 완전히 가립니다.' },
      { label: '가끔 있고, 보도 위에 올라온 차도 봐요', pts: 1, why: '보도 주차는 아이들을 차도로 내려보냅니다.' },
      { label: '단속 구간이라 드물지만 표시가 흐려요', pts: 2, why: '단속만으로는 부족하고 눈에 보이는 경계가 필요합니다.' },
      { label: '주정차금지 표시가 선명하고 실제로 비어 있어요', pts: 3, why: '노면·표지·단속이 함께 있을 때 지켜집니다.' },
    ],
    fix: {
      title: '주정차금지 노면표시와 표지로 경계 만들기',
      body: '횡단보도 앞뒤에 주정차금지 노면표시재와 안전표지를 붙이면 운전자가 정차 전에 알아봅니다. 붙이는 방식이라 기존 아스팔트·보도블록 위에 바로 시공됩니다.',
      href: '/products#roadmark',
      cta: '노면표시재 보기',
    },
  },
  {
    id: 'night',
    axis: '야간 시인성',
    title: '해가 진 뒤에도 횡단보도와 아이들이 잘 보이나요?',
    hint: '가로등이 켜지는지, 노면표시와 볼라드가 헤드라이트에 반사되는지 봅니다. 겨울 하교 시간이 기준입니다.',
    weight: 12,
    choices: [
      { label: '어둡고 반사되는 것이 없어요', pts: 0, why: '야간 보행 사고는 운전자가 늦게 보는 데서 시작됩니다.' },
      { label: '가로등은 있지만 노면·볼라드는 어두워요', pts: 1, why: '위에서 비추는 빛만으로는 낮은 시설물이 묻힙니다.' },
      { label: '반사 시설은 있는데 일부가 빛을 잃었어요', pts: 2, why: '반사 성능은 시간이 지나면 떨어지므로 점검이 필요합니다.' },
      { label: '조명·반사 시설이 모두 살아 있어요', pts: 3, why: '밤에도 낮과 같은 경계가 유지됩니다.' },
    ],
    fix: {
      title: '야간에도 보이는 노면·볼라드로',
      body: '밝은 색 노면표시재와 노란볼라드는 헤드라이트 아래에서 경계를 드러냅니다. 야간 시인성은 시간이 지나며 떨어지므로 안전시설관리 구독으로 주기적으로 살피는 것이 좋습니다.',
      href: '/subscribe',
      cta: '안전시설관리 구독 보기',
    },
  },
  {
    id: 'obstacle',
    axis: '보도 장애물',
    title: '보도 위에 아이들 길을 막는 것이 있나요?',
    hint: '적재물·공유 킥보드·자전거·공사 자재·입간판이 보도를 차지해 아이들이 차도로 내려가는지 봅니다.',
    weight: 10,
    choices: [
      { label: '보도가 막혀 아이들이 차도로 걸어요', pts: 0, why: '보도를 잃은 아이는 차와 같은 면을 걷게 됩니다.' },
      { label: '자주 막히지만 비켜 갈 틈은 있어요', pts: 1, why: '틈을 지나며 균형을 잃는 사고가 잦습니다.' },
      { label: '가끔 킥보드 정도가 놓여 있어요', pts: 2, why: '보행 통로가 대체로 확보된 상태입니다.' },
      { label: '보행 통로가 항상 비어 있어요', pts: 3, why: '보도가 온전히 보도로 쓰이고 있습니다.' },
    ],
    fix: {
      title: '보행 통로를 바닥에 그려 두기',
      body: '보도 위에 보행 통로·적재 금지 구역을 노면 그래픽으로 표시하면 상인과 이용자가 스스로 비웁니다. 적재 문제가 반복되면 안전 리포트로 지점을 남겨 두세요.',
      href: '/safety-report',
      cta: '위험 지점 제보하기',
    },
  },
  {
    id: 'manage',
    axis: '정기 관리',
    title: '이 통학로를 누가, 얼마나 자주 점검하는지 알고 있나요?',
    hint: '점검 주체(학교·지자체·업체)와 주기가 정해져 있는지, 시공 뒤 관리 약속이 있는지 봅니다.',
    weight: 12,
    choices: [
      { label: '누가 점검하는지 몰라요', pts: 0, why: '주체가 없으면 시설은 설치된 날부터 낡기만 합니다.' },
      { label: '민원이 들어오면 그때 고쳐요', pts: 1, why: '사고가 난 뒤에 고치는 방식입니다.' },
      { label: '연 1회 정도 점검한다고 들었어요', pts: 2, why: '주기는 있지만 계절 변화(장마·겨울)를 따라가기엔 깁니다.' },
      { label: '주체와 주기가 정해져 있고 기록이 남아요', pts: 3, why: '기록이 남는 관리가 시설 수명을 지킵니다.' },
    ],
    fix: {
      title: '시공 후 1년 동안 책임지고 관리하는 구독',
      body: '안전시설관리 구독은 노면·표지의 디자인·시공·정기 관리를 하나로 묶습니다. 시공 후 1년 동안 책임지고 관리하며, 점검 이력은 안전관리 지도에서 확인할 수 있습니다.',
      href: '/subscribe',
      cta: '안전시설관리 구독 보기',
    },
  },
]

export const TOTAL_WEIGHT = QUESTIONS.reduce((s, q) => s + q.weight, 0) // 100
const MAX_PTS = 3

/** 답(choice index 배열) → 0~100 점수 */
export function toScore(answers: (number | null)[]): number {
  let sum = 0
  QUESTIONS.forEach((q, i) => {
    const a = answers[i]
    if (a === null || a === undefined) return
    sum += (q.choices[a].pts / MAX_PTS) * q.weight
  })
  return Math.round((sum / TOTAL_WEIGHT) * 100)
}

/** 문항별 0~100 (차트용) */
export function axisScores(answers: (number | null)[]): number[] {
  return QUESTIONS.map((q, i) => {
    const a = answers[i]
    if (a === null || a === undefined) return 0
    return Math.round((q.choices[a].pts / MAX_PTS) * 100)
  })
}

export type Grade = {
  key: 'safe' | 'care' | 'warn' | 'urgent'
  label: string
  /** 담당자용 한 줄(과장 없이) */
  note: string
}

export function toGrade(score: number): Grade {
  if (score >= 90) return { key: 'safe', label: '안심 통학로', note: '지금 상태를 유지하는 관리 주기만 정하면 됩니다.' }
  if (score >= 70) return { key: 'care', label: '관리 필요', note: '낮은 항목 두세 곳만 보강하면 안심 구간이 됩니다.' }
  if (score >= 50) return { key: 'warn', label: '위험 신호', note: '아이들이 매일 지나는 자리이니 이번 분기 안에 손보는 것을 권합니다.' }
  return { key: 'urgent', label: '즉시 점검 권장', note: '기본 시설부터 비어 있습니다. 현장 점검을 먼저 요청하세요.' }
}

export const STORAGE_KEY = 'pi-safety-score-v1'
