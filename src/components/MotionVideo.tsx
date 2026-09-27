"use client";

import { useEffect, useRef, type ComponentProps } from "react";

// 소리 없이 반복 재생되는 영상. prefers-reduced-motion: reduce면 재생하지 않고 포스터에서 멈춘다
// (디자인 정본 §5 "reduced-motion에서 전부 정지", 2026-09-27 접근성 점검 — autoPlay 속성은 이 설정을 무시한다).
export default function MotionVideo(props: Omit<ComponentProps<"video">, "autoPlay">) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      if (mq.matches) v.pause();
      else v.play().catch(() => {});
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  return <video ref={ref} {...props} />;
}
