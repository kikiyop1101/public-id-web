// 신인도(Track Record) 데이터 — 금액 미포함, 건수/거래처수/비율만.
// 출처: 경영본부 매출대시보드 build_aggregates.py → credibility.json (사람 검토 후 반영).
// ⚠️ 이 파일에는 매출 금액·단가를 절대 넣지 않는다(저장소 공개). 수치는 매출장 실거래 기준.

export const credibility = {
  period: "2019–2025",
  yearsActive: 7,
  totalProjects: 961,
  totalClients: 278,
  publicOrgs: 129,
  repeatRatePct: 24.8,
  // 연도별 누적(성장 곡선용) — 금액 아님, 건수/거래처 수
  years: [2019, 2020, 2021, 2022, 2023, 2024, 2025],
  cumulativeProjects: [104, 250, 403, 600, 754, 908, 961],
  cumulativeClients: [42, 90, 138, 184, 214, 263, 278],
  // 사업영역 구성(건수 비중 %) — 공개 표시명(BRAND_CONSTANTS 정본)
  lineDistribution: [
    { label: "친환경 현수막·배너 / 직물시트", pct: 30.3 },
    { label: "친환경 그래픽 노면표시재", pct: 23.5 },
    { label: "사인·웨이파인딩·표지 시스템", pct: 20.1 },
    { label: "홍보판촉물 · 도서", pct: 6.8 },
    { label: "디자인 용역·구독", pct: 2.8 },
    { label: "기타 맞춤 제작", pct: 16.5 },
  ],
  // 고객 구성(건수 비중 %)
  segmentMix: [
    { label: "공공기관·지자체 (B2G)", pct: 63.3 },
    { label: "기업 (B2B)", pct: 24.7 },
    { label: "비영리·기타", pct: 12.1 },
  ],
} as const;

export type Credibility = typeof credibility;
