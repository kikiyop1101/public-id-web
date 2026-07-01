import { createElement, type ComponentType, type SVGProps } from "react";
import { Footprint, Bollard, Sign, Sparkle, Banner, MapPin } from "@/components/icons";

export type Facility = {
  id: string;
  type: string; // 종류
  client: string; // 발주처
  name: string; // 명칭/위치
  address: string;
  lat?: number; // 주소에서 자동 변환 (geocode.ts)
  lng?: number;
  plannedDate?: string; // 설치예정일 — 설치 전이면 설정
  installDate: string; // 설치일 (설치 전이면 빈 값)
  maintenancePeriod?: string; // 유지보수기간 ("1년", "6개월" 등) — 있으면 관리중 대상
  endDate?: string; // 관리종료일 — 유지보수기간 미입력 시 폴백 종료일
  demolishedDate?: string; // 철거완료일 — 있으면 철거 완료
  quantity?: string;
  photo?: string;
  note?: string;
};

// 라이프사이클: 설치 예정 → 설치 완료 → 관리중 → 관리 종료 → 철거 완료
export type Status = "planned" | "installed" | "managed" | "ended" | "demolished";

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const TYPE_ICON: Record<string, Icon> = {
  "노란발자국": Footprint,
  "노란볼라드": Bollard,
  "안전 및 안내표지": Sign,
  "안전·안내표지": Sign,
  "단기표지(축제·행사)": Sparkle,
  "현수막": Banner,
};

export function typeIcon(type: string): Icon {
  return TYPE_ICON[type.trim()] ?? MapPin;
}

// 시설 종류 → 아이콘을 렌더하는 안정적 컴포넌트. typeIcon 결과를 render 중
// 지역 변수(<Icon/>)로 바인딩하지 않아 react-hooks/static-components 규칙을 만족한다.
export function TypeIcon({
  type,
  ...props
}: { type: string } & SVGProps<SVGSVGElement>) {
  return createElement(typeIcon(type), props);
}

// "1년"=12, "6개월"=6, "1년 6개월"=18 → 개월수
function parsePeriodMonths(s?: string): number | null {
  if (!s) return null;
  let months = 0;
  let matched = false;
  const y = s.match(/(\d+)\s*년/);
  if (y) {
    months += parseInt(y[1], 10) * 12;
    matched = true;
  }
  const mo = s.match(/(\d+)\s*(개월|달|월)/);
  if (mo) {
    months += parseInt(mo[1], 10);
    matched = true;
  }
  return matched ? months : null;
}

// 관리(유지보수) 종료일: 유지보수기간 우선(설치일+기간), 없으면 관리종료일.
export function maintenanceEnd(f: Facility): Date | null {
  const months = parsePeriodMonths(f.maintenancePeriod);
  if (months != null && f.installDate && f.installDate.trim()) {
    const d = new Date(`${f.installDate}T00:00:00`);
    d.setMonth(d.getMonth() + months);
    return d;
  }
  if (f.endDate && f.endDate.trim()) return new Date(`${f.endDate}T00:00:00`);
  return null;
}

export function statusOf(f: Facility, now: Date): Status {
  if (f.demolishedDate && f.demolishedDate.trim()) return "demolished";
  if (!f.installDate || !f.installDate.trim()) return "planned";
  const end = maintenanceEnd(f);
  if (!end) return "installed";
  return now.getTime() <= end.getTime() ? "managed" : "ended";
}

// 관리(유지보수) 잔여일 — 관리중 카운트다운용. 관리 대상이 아니면 NaN.
export function daysLeftOf(f: Facility, now: Date): number {
  const end = maintenanceEnd(f);
  if (!end) return NaN;
  return Math.ceil((end.getTime() - now.getTime()) / 86_400_000);
}

// 설치예정일까지 남은 일수(설치 전 시설용).
export function plannedDaysOf(f: Facility, now: Date): number | null {
  if (!f.plannedDate) return null;
  return Math.ceil(
    (new Date(`${f.plannedDate}T00:00:00`).getTime() - now.getTime()) / 86_400_000,
  );
}

export function ddayLabel(daysLeft: number): string {
  if (Number.isNaN(daysLeft)) return "";
  if (daysLeft < 0) return "종료";
  if (daysLeft === 0) return "D-day";
  return `D-${daysLeft}`;
}

export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 상태 색 — 퍼블릭아이디 브랜드 컬러(상태당 1색).
//  설치예정=네이비 · 설치완료=라임 · 관리중=청록 · 관리종료=빨강 · 철거완료=세이프티옐로우
//  pin = 지도 마커(선명)  ·  text = 흰 배경 가독 텍스트  ·  bg = pill 배경
export const STATUS_META: Record<
  Status,
  { label: string; pin: string; text: string; bg: string }
> = {
  planned: { label: "설치 예정", pin: "#16303D", text: "#16303D", bg: "rgba(32,64,80,0.10)" },
  installed: { label: "설치 완료", pin: "#CADA1F", text: "#5E6E00", bg: "rgba(200,216,32,0.22)" },
  managed: { label: "관리중", pin: "#069CBB", text: "#0B6C7D", bg: "rgba(8,160,184,0.12)" },
  ended: { label: "관리 종료", pin: "#DC2626", text: "#B91C1C", bg: "rgba(220,38,38,0.12)" },
  demolished: { label: "철거 완료", pin: "#FFD200", text: "#8A6A00", bg: "rgba(255,224,0,0.22)" },
};

// 총계 등 중립 강조에 쓰는 가장 진한 브랜드색(네이비).
export const BRAND_DARK = "#16303D";
