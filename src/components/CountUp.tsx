"use client";

import { useEffect, useRef } from "react";

// 숫자 카운트업 (design.md §5 "스크롤 연동" — 2026-09-03 신설)
// SSR·JS 꺼짐·reduced-motion 에서는 최종값이 그대로 보인다.
// 뷰포트 60% 진입 시 1회만 from→to 로 오르고(ease-out, 기본 1100ms), 리렌더 없이 textContent 만 갱신한다.
export default function CountUp({
  to,
  from = 0,
  duration = 1100,
  className,
}: {
  to: number;
  from?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const t0 = performance.now();
        const tick = (t: number) => {
          const k = Math.min(1, (t - t0) / duration);
          const eased = 1 - Math.pow(1 - k, 3);
          el.textContent = String(Math.round(from + (to - from) * eased));
          if (k < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [to, from, duration]);

  return (
    <span ref={ref} className={className}>
      {to}
    </span>
  );
}
