// "숨은 위험 찾기" 장면·핫스팟 정본 (2026-09-08 체류시간 기획안 1순위).
// 좌표는 이미지 기준 %(x, y = 중심, rx, ry = 타원 반경). 장면 이미지 = public/safety-game/scene-<id>.webp
// (1920px 데스크톱 · -m 960px 모바일 · -thumb 640px). 원본 PNG = 시스템-외부보관/content-images/safety-game/.
// 카피 규칙(AGENTS.md): 노면표시재 = 부착식 알루미늄 스티커, 노란발자국 = 보도 위 횡단 대기 공간 표시, 인증 단정 금지.

export type Hazard = {
  id: string;
  x: number;
  y: number;
  rx: number;
  ry: number;
  title: string;
  why: string;
  fix: string;
  product: { label: string; href: string };
};

export type Scene = {
  id: "school" | "apartment" | "factory";
  name: string;
  eyebrow: string;
  intro: string;
  audience: string;
  hazards: Hazard[];
};

export const GAME_SECONDS = 60;

export const SCENES: Scene[] = [
  {
    id: "school",
    name: "학교 앞 횡단보도",
    eyebrow: "Scene 01 · 어린이보호구역",
    intro: "등굣길 스쿨존 사거리입니다. 아이들이 매일 건너는 길에서 위험 8곳을 찾아보세요.",
    audience: "학교·교육청·지자체 담당자, 학부모",
    hazards: [
      {
        id: "wait",
        x: 26, y: 50, rx: 7, ry: 11,
        title: "대기 지점 표시가 없는 보도",
        why: "어디서 기다려야 하는지 표시가 없어 아이들이 차도 바로 앞까지 나와 섭니다. 우회전 차량이 가장 늦게 보는 자리입니다.",
        fix: "보도 위 안전한 대기 지점에 노란발자국을 부착해 \"여기서 기다려요\"를 눈으로 알려 줍니다. 페인트가 아니라 부착식이라 반나절 시공으로 끝납니다.",
        product: { label: "노란발자국", href: "/products#footprint" },
      },
      {
        id: "bollard",
        x: 47, y: 66, rx: 4, ry: 9,
        title: "기울어지고 갈라진 볼라드",
        why: "차량 진입을 막아야 할 볼라드가 파손되면 보행자 보호 기능이 사라지고, 모서리에 아이가 다치기도 합니다.",
        fix: "기존 볼라드를 교체하지 않고 시인성 높은 직물시트로 감싸는 노란볼라드 드레스업으로 \"여기는 아이들 자리\"를 멀리서도 보이게 합니다.",
        product: { label: "노란볼라드", href: "/products#bollard" },
      },
      {
        id: "car",
        x: 44, y: 33, rx: 8, ry: 7,
        title: "횡단보도 위 불법 주정차",
        why: "횡단보도를 막은 차량은 운전자와 아이 모두의 시야를 가립니다. 어린이보호구역 주정차 위반은 범칙금이 가중됩니다.",
        fix: "노면에 주정차 금지 그래픽과 안내표지를 세트로 부착해 \"세우면 안 되는 자리\"를 바닥과 눈높이 두 곳에서 알립니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "faded",
        x: 53, y: 52, rx: 10, ry: 7,
        title: "지워져 가는 횡단보도 선",
        why: "흰 선이 마모되면 야간·우천 시 운전자가 횡단보도를 늦게 인지합니다. 도색은 몇 달이면 이렇게 됩니다.",
        fix: "인쇄된 알루미늄 박판 스티커 방식의 노면표시재로 선명한 그래픽을 오래 유지합니다. 미끄럼저항 46BPN으로 보행에도 안전합니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "sign",
        x: 76, y: 31, rx: 7, ry: 11,
        title: "녹슬고 기울어진 안내표지",
        why: "표지가 기울면 운전자 눈높이에서 벗어나 어린이보호구역이라는 사실 자체가 전달되지 않습니다.",
        fix: "노후 표지는 교체하고, 기둥·펜스에는 직물시트 안내 그래픽을 더해 구간 전체가 한눈에 읽히게 합니다.",
        product: { label: "친환경 그래픽 직물시트", href: "/products#fabric" },
      },
      {
        id: "scooter",
        x: 55, y: 71, rx: 11, ry: 7,
        title: "보도를 막은 킥보드와 자전거",
        why: "보도가 막히면 아이들이 차도로 내려가 돌아갑니다. 통학로에서 가장 흔한 위험입니다.",
        fix: "보도 바닥에 보행 통로와 주차 구역 그래픽을 부착해 놓을 자리와 걷는 자리를 나눕니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "puddle",
        x: 63, y: 83, rx: 15, ry: 9,
        title: "막힌 배수구와 물웅덩이",
        why: "낙엽으로 막힌 배수구 앞은 비 오면 미끄럽고, 아이들은 웅덩이를 피하려다 차도로 나갑니다.",
        fix: "정기 점검 항목에 배수구·보도 상태를 넣어 관리합니다. 안전시설관리 구독은 시공 후 1년 동안 이런 점검을 책임집니다.",
        product: { label: "안전시설관리 구독", href: "/subscribe" },
      },
      {
        id: "truck",
        x: 90, y: 42, rx: 10, ry: 15,
        title: "모퉁이 시야를 가린 트럭",
        why: "교차로 모퉁이에 선 대형 차량은 횡단보도로 들어서는 아이를 운전자가 볼 수 없게 만듭니다.",
        fix: "모퉁이 노면에 정차 금지 구역을 그래픽으로 표시하고, 통학로 안전 점검 리포트로 관리 주체에 알립니다.",
        product: { label: "안전 리포트 · 제보", href: "/safety-report" },
      },
    ],
  },
  {
    id: "apartment",
    name: "아파트 단지 주차장",
    eyebrow: "Scene 02 · 생활권 보행안전",
    intro: "놀이터와 주차장이 붙어 있는 단지 안길입니다. 어른 눈높이에서는 안 보이는 위험 8곳을 찾아보세요.",
    audience: "아파트 관리사무소·입주자대표회의, 지자체 주거복지 담당",
    hazards: [
      {
        id: "child",
        x: 36, y: 41, rx: 6, ry: 8,
        title: "주차 차량 사이로 뛰어나온 아이",
        why: "차 사이에서 튀어나오는 아이는 운전자에게 마지막 순간에야 보입니다. 단지 내 사고의 가장 흔한 형태입니다.",
        fix: "주차 구역 앞 노면에 \"잠깐 멈춤\" 그래픽과 보행 통로를 부착해 아이도 운전자도 멈출 자리를 알게 합니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "stroller",
        x: 25, y: 68, rx: 9, ry: 10,
        title: "보행로를 점령한 주차로 차도에 내려선 유모차",
        why: "보행로 위 주차는 유모차·휠체어를 차도로 밀어냅니다. 단지 안이라 속도가 낮아도 사각지대가 많습니다.",
        fix: "보행로 바닥에 연속된 보행 그래픽을 부착하면 \"여기는 걷는 길\"이 분명해져 주차 자체가 줄어듭니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "gate",
        x: 51, y: 57, rx: 5, ry: 7,
        title: "차도로 바로 열리는 놀이터 출입문",
        why: "놀이터에서 뛰어나오면 바로 차가 다니는 길입니다. 문 앞에 멈춤 표시나 완충 공간이 없습니다.",
        fix: "출입문 앞 노면에 노란발자국으로 대기 지점을 만들고, 문에는 직물시트로 \"차 조심\" 그래픽을 부착합니다.",
        product: { label: "노란발자국", href: "/products#footprint" },
      },
      {
        id: "stairs",
        x: 60, y: 29, rx: 6, ry: 8,
        title: "물이 흘러내리는 현관 계단",
        why: "미끄럼 방지 처리가 없는 젖은 계단은 낙상 사고의 단골 지점입니다. 특히 노인·어린이에게 위험합니다.",
        fix: "계단 코에 미끄럼 저항이 있는 노면표시재 그래픽을 부착해 발 디딜 자리를 눈으로 보이게 합니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "hydrant",
        x: 84, y: 37, rx: 7, ry: 6,
        title: "소화전 앞 주차",
        why: "화재 시 소방차가 소화전을 쓸 수 없습니다. 소화전 5m 이내 주정차는 법으로 금지됩니다.",
        fix: "소화전 앞 노면에 주정차 금지 구역을 그래픽으로 부착해 표지판을 못 봐도 바닥에서 읽히게 합니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "bins",
        x: 87, y: 58, rx: 8, ry: 6,
        title: "쓰러진 자전거와 넘치는 분리수거함",
        why: "보행로를 막은 적치물은 보행자를 차도로 내몰고, 야간에는 걸려 넘어지는 원인이 됩니다.",
        fix: "분리수거 구역과 자전거 거치 구역을 바닥 그래픽으로 나누고, 관리 규정을 직물시트 안내판으로 붙입니다.",
        product: { label: "친환경 그래픽 직물시트", href: "/products#fabric" },
      },
      {
        id: "scooter",
        x: 65, y: 68, rx: 6, ry: 9,
        title: "보도 위를 달리는 배달 이륜차",
        why: "보도 주행 이륜차는 보행자, 특히 아이와 노인을 뒤에서 덮칩니다. 단지 안에서는 단속도 어렵습니다.",
        fix: "단지 입구와 보도 시작점에 이륜차 진입 금지 노면 그래픽과 안내표지를 세트로 부착합니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "manhole",
        x: 84, y: 86, rx: 8, ry: 6,
        title: "뚜껑이 열린 맨홀",
        why: "열린 맨홀은 추락 사고로 직결됩니다. 작업 중 표시가 없으면 야간에 특히 위험합니다.",
        fix: "작업 구역 임시 표시용 안전표지와 바닥 그래픽을 갖추고, 정기 점검으로 방치를 막습니다.",
        product: { label: "안전시설관리 구독", href: "/subscribe" },
      },
    ],
  },
  {
    id: "factory",
    name: "산업단지 공장 마당",
    eyebrow: "Scene 03 · 사업장 안전",
    intro: "물류 상하차가 이뤄지는 공장 마당입니다. 산업재해로 이어지는 위험 8곳을 찾아보세요.",
    audience: "제조·물류 사업장 안전관리자, 산업단지 관리기관",
    hazards: [
      {
        id: "forklift",
        x: 24, y: 68, rx: 10, ry: 13,
        title: "보행 통로 없이 지게차 옆을 걷는 작업자",
        why: "지게차와 보행자 동선이 겹치면 후진·선회 때 충돌합니다. 지게차 사고는 사업장 중대재해 상위 원인입니다.",
        fix: "바닥에 보행 통로와 지게차 동선을 색으로 나눈 그래픽을 부착합니다. 페인트와 달리 마모 후 부분 교체가 쉽습니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "exit",
        x: 43, y: 52, rx: 8, ry: 13,
        title: "비상구를 막은 적재물",
        why: "비상구 앞 적재는 화재 시 대피로를 막습니다. 점검 때마다 가장 많이 지적되는 항목입니다.",
        fix: "비상구 앞 바닥에 적재 금지 구역 그래픽을 부착하고, 문에는 비상구 안내 직물시트를 붙여 습관을 바꿉니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "oil",
        x: 59, y: 58, rx: 7, ry: 6,
        title: "바닥의 기름 유출",
        why: "기름 위에서는 사람도 지게차도 미끄러집니다. 즉시 처리와 함께 재발 지점 표시가 필요합니다.",
        fix: "드럼 보관 구역을 바닥 그래픽으로 지정하고, 미끄럼 주의 안전표지를 함께 부착합니다.",
        product: { label: "안전표지", href: "/products#roadmark" },
      },
      {
        id: "cable",
        x: 46, y: 87, rx: 13, ry: 6,
        title: "통로를 가로지르는 전선",
        why: "발목 높이의 케이블은 걸려 넘어지는 사고와 피복 손상 감전 위험을 함께 만듭니다.",
        fix: "케이블 통과 지점을 정하고 바닥에 주의 그래픽을 부착합니다. 통로 그래픽이 있으면 케이블이 통로를 가로지르지 않게 됩니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "load",
        x: 70, y: 52, rx: 7, ry: 13,
        title: "매달린 화물 아래의 작업자",
        why: "크레인 화물 아래는 어떤 경우에도 서면 안 되는 자리입니다. 안전모 없이 서 있어 더 위험합니다.",
        fix: "크레인 작업 반경을 바닥 그래픽으로 표시하고 보호구 착용 안전표지를 작업 위치에 부착합니다.",
        product: { label: "안전표지", href: "/products#roadmark" },
      },
      {
        id: "stack",
        x: 80, y: 62, rx: 6, ry: 19,
        title: "무너지기 직전의 적재물",
        why: "높이 쌓인 불안정한 적재물은 작은 진동에도 쓰러져 옆 작업자를 덮칩니다.",
        fix: "적재 높이 한계선을 벽면 직물시트 그래픽으로 표시하고 적재 구역을 바닥에 구획합니다.",
        product: { label: "친환경 그래픽 직물시트", href: "/products#fabric" },
      },
      {
        id: "reverse",
        x: 92, y: 38, rx: 6, ry: 10,
        title: "후진하는 트럭 뒤의 작업자",
        why: "트럭 후방은 운전자가 볼 수 없는 사각지대입니다. 유도자 없이 서 있으면 끼임 사고로 이어집니다.",
        fix: "상하차 구역 바닥에 차량 정지선과 보행 금지 구역을 그래픽으로 부착해 서면 안 되는 자리를 정합니다.",
        product: { label: "친환경 그래픽 노면표시재", href: "/products#roadmark" },
      },
      {
        id: "extinguisher",
        x: 94, y: 75, rx: 5, ry: 7,
        title: "드럼 뒤에 가려진 소화기",
        why: "소화기는 눈에 띄고 손이 바로 닿아야 합니다. 물건에 가려진 소화기는 없는 것과 같습니다.",
        fix: "소화기 위치를 바닥 그래픽과 벽면 안전표지로 표시하고 그 앞 적재 금지 구역을 정합니다.",
        product: { label: "안전표지", href: "/products#roadmark" },
      },
    ],
  },
];

export function gradeFor(found: number, total: number): { label: string; note: string } {
  if (found === total) return { label: "안전지킴이 1급", note: "위험을 전부 찾았습니다. 현장 점검을 맡겨도 되는 눈입니다." };
  if (found >= total - 2) return { label: "안전지킴이 2급", note: "대부분 찾았습니다. 놓친 항목이 실제 현장에서 가장 자주 방치되는 곳입니다." };
  if (found >= total / 2) return { label: "안전지킴이 3급", note: "절반 이상 찾았습니다. 해설을 읽고 한 번 더 도전해 보세요." };
  return { label: "예비 안전지킴이", note: "처음이라면 자연스러운 결과입니다. 자유 모드로 천천히 찾아보세요." };
}
