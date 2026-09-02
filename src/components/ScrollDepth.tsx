"use client";

import { useEffect, useRef, type ReactNode } from "react";

// 스크롤 깊이 레이어 컨테이너 (design.md §5 "스크롤 연동" — 2026-09-03 신설)
// 감싼 섹션이 화면 위로 흘러간 비율(0→1)을 CSS 변수 --sp 로 쓴다.
// 자식은 `.depth` 클래스 + `--d`(이동량, px 또는 SVG 단위)로 층을 나눈다(globals.css).
// 배경은 느리게(+), 전경은 빠르게(−). 레이어 ≤3, transform 만 건드린다.
// prefers-reduced-motion 이면 리스너를 붙이지 않는다(CSS 쪽도 transform:none).
export default function ScrollDepth({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      if (r.height <= 0) return;
      const p = Math.min(1, Math.max(0, -r.top / r.height));
      el.style.setProperty("--sp", p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section ref={ref} className={className}>
      {children}
    </section>
  );
}
