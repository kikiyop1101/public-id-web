"use client";

import { useEffect, useRef, useState } from "react";

// 아치 창 안에서 도는 실제 시공 현장 영상(2026-11-19 대표 "실제 시공 영상으로 여는 첫 화면").
// 정지 사진(SVG 창) 위에 겹쳐 두고, 첫 화면이 다 뜬 뒤에 받아 재생이 시작되면 서서히 드러낸다 — LCP는 여전히 사진이다.
// 움직임 줄이기 설정·데이터 절약 모드·화면에 안 보이는 쪽(데스크톱/모바일 아치 중 숨은 것)에서는 받지 않는다.
export default function ArchVideo({ src, className }: { src: string; className?: string }) {
  const ref = useRef<HTMLVideoElement>(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const v = ref.current;
    if (!v || v.offsetParent === null) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (conn?.saveData) return;
    const start = () => {
      v.src = src;
      v.play().catch(() => {});
    };
    if (document.readyState === "complete") {
      start();
      return;
    }
    window.addEventListener("load", start, { once: true });
    return () => window.removeEventListener("load", start);
  }, [src]);

  return (
    <video
      ref={ref}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden
      tabIndex={-1}
      onPlaying={() => setOn(true)}
      className={`${className ?? ""} transition-opacity duration-700 ${on ? "opacity-100" : "opacity-0"}`}
    />
  );
}
