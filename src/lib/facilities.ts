import type { ComponentType, SVGProps } from "react";
import { Footprint, Bollard, Sign, Sparkle, Banner, MapPin } from "@/components/icons";

export type Facility = {
  id: string;
  type: string; // 종류 (Korean label; matched to an icon below, falls back to MapPin)
  client: string; // 발주처
  name: string; // 명칭/위치
  address: string;
  lat?: number; // 주소에서 자동 변환 (geocode.ts)
  lng?: number;
  plannedDate?: string; // 설치예정일 — 아직 설치 전이면 설정 (status=planned)
  installDate: string; // YYYY-MM-DD (설치일); 설치 전이면 빈 값
  endDate?: string; // 관리종료일 — optional; defaults to 설치일 + 1년
  quantity?: string; // 수량 (예: "볼라드 14본")
  photo?: string; // 현장 사진 URL
  note?: string;
};

export type Status = "planned" | "active" | "expiring" | "expired";

// "만료 임박" window — facilities ending within this many days are flagged amber.
export const EXPIRING_DAYS = 30;

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

// Korean type label → icon. New types added later in the sheet (e.g. 현수막) fall
// back to MapPin automatically, so the data stays the single source of truth.
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

export function endDateOf(f: Facility): Date {
  if (f.endDate) return new Date(`${f.endDate}T00:00:00`);
  const d = new Date(`${f.installDate}T00:00:00`);
  d.setFullYear(d.getFullYear() + 1);
  return d;
}

export function daysLeftOf(f: Facility, now: Date): number {
  return Math.ceil((endDateOf(f).getTime() - now.getTime()) / 86_400_000);
}

export function statusOf(f: Facility, now: Date): Status {
  if (!f.installDate || !f.installDate.trim()) return "planned";
  const d = daysLeftOf(f, now);
  if (d < 0) return "expired";
  if (d <= EXPIRING_DAYS) return "expiring";
  return "active";
}

// 설치예정일까지 남은 일수(설치 전 시설용). 양수=예정, 음수=지남.
export function plannedDaysOf(f: Facility, now: Date): number | null {
  if (!f.plannedDate) return null;
  return Math.ceil(
    (new Date(`${f.plannedDate}T00:00:00`).getTime() - now.getTime()) / 86_400_000,
  );
}

export function ddayLabel(daysLeft: number): string {
  if (daysLeft < 0) return "만료";
  if (daysLeft === 0) return "D-day";
  return `D-${daysLeft}`;
}

export function fmtDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

// 상태 색 — 퍼블릭아이디 브랜드 컬러 기반.
//  pin  = 지도 마커(선명한 상징색)  ·  text = 흰 배경 위 가독 텍스트  ·  bg = pill 배경
//  운영중=청록(teal #08A0B8) · 만료임박=세이프티옐로우(#FFE000) · 관리종료=빨강(브랜드에 빨강이 없어 유지)
export const STATUS_META: Record<
  Status,
  { label: string; pin: string; text: string; bg: string }
> = {
  planned: { label: "설치 예정", pin: "#204050", text: "#204050", bg: "rgba(32,64,80,0.10)" },
  active: { label: "운영중", pin: "#08A0B8", text: "#0B6C7D", bg: "rgba(8,160,184,0.12)" },
  expiring: { label: "만료 임박", pin: "#FFE000", text: "#8A6A00", bg: "rgba(255,224,0,0.22)" },
  expired: { label: "관리 종료", pin: "#DC2626", text: "#B91C1C", bg: "rgba(220,38,38,0.12)" },
};

// 총계 등 중립 강조에 쓰는 가장 진한 브랜드색(네이비).
export const BRAND_DARK = "#204050";
