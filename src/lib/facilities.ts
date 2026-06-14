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
  installDate: string; // YYYY-MM-DD (설치일)
  endDate?: string; // 관리종료일 — optional; defaults to 설치일 + 1년
  quantity?: string; // 수량 (예: "볼라드 14본")
  photo?: string; // 현장 사진 URL
  note?: string;
};

export type Status = "active" | "expiring" | "expired";

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
  const d = daysLeftOf(f, now);
  if (d < 0) return "expired";
  if (d <= EXPIRING_DAYS) return "expiring";
  return "active";
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

// Fixed status colors (semantic traffic-light). The site is light-themed.
export const STATUS_META: Record<
  Status,
  { label: string; color: string; bg: string; text: string }
> = {
  active: { label: "운영중", color: "#16A34A", bg: "rgba(22,163,74,0.12)", text: "#15803D" },
  expiring: { label: "만료 임박", color: "#F59E0B", bg: "rgba(245,158,11,0.16)", text: "#B45309" },
  expired: { label: "관리 종료", color: "#DC2626", bg: "rgba(220,38,38,0.12)", text: "#B91C1C" },
};
