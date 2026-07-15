"use client";

import { useState, type CSSProperties } from "react";
import { cn } from "@/lib/cn";

const PALETTES = [
  { key: "pi", label: "퍼블릭아이디 청록", primary: "#069CBB", anchor: "#16303D", accent: "#CADA1F" },
  { key: "gov", label: "공공기관 딥블루", primary: "#1D56A6", anchor: "#122A4D", accent: "#E8B10E" },
  { key: "eco", label: "친환경 그린", primary: "#2E7D4F", anchor: "#1B3D2A", accent: "#B7D34A" },
  { key: "warm", label: "웜 오렌지", primary: "#C2571B", anchor: "#4A2410", accent: "#F2C14E" },
] as const;

export default function DesignTokenDemo() {
  const [active, setActive] = useState<(typeof PALETTES)[number]>(PALETTES[0]);

  const vars = {
    "--d-primary": active.primary,
    "--d-anchor": active.anchor,
    "--d-accent": active.accent,
  } as CSSProperties;

  return (
    <div>
      <div className="flex flex-wrap gap-3" role="group" aria-label="데모 팔레트 선택">
        {PALETTES.map((p) => (
          <button
            key={p.key}
            type="button"
            aria-pressed={active.key === p.key}
            onClick={() => setActive(p)}
            className={cn(
              "inline-flex h-11 items-center gap-2 rounded-full border bg-white px-5 text-sm font-semibold text-ink transition",
              active.key === p.key
                ? "border-teal shadow-md shadow-teal/15"
                : "border-line hover:border-teal",
            )}
          >
            <span
              aria-hidden
              className="h-3.5 w-3.5 rounded-full"
              style={{ background: p.primary }}
            />
            {p.label}
          </button>
        ))}
      </div>

      <div
        className="mt-8 grid gap-5 sm:grid-cols-2"
        style={vars}
        aria-live="polite"
      >
        {/* 명함 */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="p-6">
            <div
              className="mb-4 h-1.5 rounded-full"
              style={{ background: "linear-gradient(95deg, var(--d-accent), var(--d-primary))" }}
            />
            <div className="font-extrabold" style={{ color: "var(--d-anchor)" }}>
              김퍼블 대표
            </div>
            <div className="text-xs text-ink-soft">귀사 이름 · 대표 연락처</div>
          </div>
          <div className="border-t border-line px-6 py-2 text-xs text-ink-soft">명함</div>
        </div>

        {/* 현수막 */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="p-7 text-white" style={{ background: "var(--d-anchor)" }}>
            <span
              className="mb-3 inline-block rounded-full px-3 text-xs font-bold"
              style={{ background: "var(--d-accent)", color: "var(--d-anchor)" }}
            >
              NEW
            </span>
            <div className="text-lg font-extrabold">신제품 출시 안내</div>
          </div>
          <div className="border-t border-line px-6 py-2 text-xs text-ink-soft">현수막</div>
        </div>

        {/* 홈페이지 */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="h-6 w-6 rounded" style={{ background: "var(--d-primary)" }} />
              <div className="h-2 w-8 rounded-full bg-line" />
              <div className="h-2 w-8 rounded-full bg-line" />
            </div>
            <div
              className="rounded-xl p-5 font-bold text-white"
              style={{ background: "var(--d-primary)" }}
            >
              귀사의 홈페이지
              <span
                className="mt-3 block w-fit rounded-full px-4 py-0.5 text-xs font-bold"
                style={{ background: "var(--d-accent)", color: "var(--d-anchor)" }}
              >
                자세히 보기
              </span>
            </div>
          </div>
          <div className="border-t border-line px-6 py-2 text-xs text-ink-soft">홈페이지</div>
        </div>

        {/* 안내판 */}
        <div className="overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          <div className="grid place-items-center bg-cloud p-6">
            <div
              className="w-full rounded-xl border-4 bg-white p-5 text-center font-extrabold"
              style={{ borderColor: "var(--d-primary)", color: "var(--d-anchor)" }}
            >
              안전 제일
            </div>
          </div>
          <div className="border-t border-line px-6 py-2 text-xs text-ink-soft">안내판</div>
        </div>
      </div>

      <p className="mt-5 text-sm text-ink-soft">
        위 데모의 색은 예시입니다. 실제로는 귀사의 브랜드 진단을 거쳐 색·글꼴·규칙을 함께
        정합니다.
      </p>
    </div>
  );
}
