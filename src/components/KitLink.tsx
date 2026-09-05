"use client";

import { track } from "@vercel/analytics";
import type { AnchorHTMLAttributes, ReactNode } from "react";

// 우리회사OS → 래피드 외부 이동 계측(2026-09-05).
// 2차 확장 리서치(08-27)가 짚은 "측정 암전"의 첫 정량 데이터 — 어느 키트 링크에서 몇 명이 넘어가는지 Vercel Analytics 이벤트로 남긴다.
type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  kit: string;
  place: "list" | "hero" | "cta" | "curator";
  children: ReactNode;
};

export default function KitLink({ kit, place, children, ...rest }: Props) {
  return (
    <a
      {...rest}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => track("os_kit_click", { kit, place })}
    >
      {children}
    </a>
  );
}
