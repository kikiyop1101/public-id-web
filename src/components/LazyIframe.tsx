"use client";

import { useEffect, useRef, useState } from "react";

// 화면에 가까워졌을 때만 src를 붙이는 iframe(2026-11-04 성능 H3).
// 브라우저 기본 loading="lazy"는 휴대폰에서도 화면 아래 1250~2500px 안이면 바로 받아 버려,
// /os 입체도(/embed/ai-anatomy.html, 327KB·움직이는 SVG)가 첫 로드에 실려 메인 스레드를 약 3초 잡았다(Lighthouse 모바일).
// 자리(className의 aspect)는 처음부터 잡혀 있어 붙을 때 화면이 밀리지 않는다. 번호 설명은 페이지 HTML에 따로 있어 검색·AI는 iframe 없이도 읽는다.
export default function LazyIframe({
  src,
  title,
  className,
  rootMargin = "400px 0px",
}: {
  src: string;
  title: string;
  className?: string;
  rootMargin?: string;
}) {
  const ref = useRef<HTMLIFrameElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [rootMargin]);

  return <iframe ref={ref} src={near ? src : undefined} title={title} loading="lazy" className={className} />;
}
