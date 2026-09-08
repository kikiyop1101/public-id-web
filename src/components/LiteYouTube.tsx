"use client";

import { useState, type KeyboardEvent } from "react";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/cn";

// 유튜브 파사드(facade) — 2026-09-08 신설.
// 대표: "영상을 걸고 싶은데 무거울까봐 못 걸었다." 표준 iframe은 클릭 전에 수백 KB 스크립트와
// 여러 연결을 끌어오지만, 파사드는 썸네일 1장(lazy)과 재생 버튼만 그리고 **클릭한 순간에만**
// youtube-nocookie iframe을 삽입한다. 페이지에 47편을 깔아도 초기 무게는 썸네일뿐이다.
type Props = {
  id: string;
  title: string;
  /** 계측용 위치(홈 스트립·영상관·제품 등) */
  place: string;
  /** 세로 쇼츠(9:16) */
  vertical?: boolean;
  className?: string;
};

export default function LiteYouTube({ id, title, place, vertical, className }: Props) {
  const [playing, setPlaying] = useState(false);

  const play = () => {
    if (playing) return;
    setPlaying(true);
    track("video_play", { id, place });
  };
  const onKey = (e: KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      play();
    }
  };

  const ratio = vertical ? "aspect-[9/16]" : "aspect-video";

  if (playing) {
    return (
      <div className={cn("relative w-full overflow-hidden rounded-2xl bg-navy", ratio, className)}>
        <iframe
          className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={play}
      onKeyDown={onKey}
      aria-label={`재생: ${title}`}
      className={cn(
        "group relative block w-full overflow-hidden rounded-2xl bg-navy text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
        ratio,
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
        alt=""
        loading="lazy"
        decoding="async"
        className={cn(
          "absolute inset-0 h-full w-full object-cover transition duration-500 motion-reduce:transition-none",
          vertical ? "scale-[1.02]" : "scale-[1.35] group-hover:scale-[1.38]",
        )}
      />
      <span
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-navy/60 via-navy/0 to-navy/0"
      />
      <span
        aria-hidden
        className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/95 text-teal-700 shadow-lg transition duration-300 group-hover:scale-110 group-hover:bg-white motion-reduce:transition-none"
      >
        <svg viewBox="0 0 24 24" className="ml-1 h-6 w-6" fill="currentColor">
          <path d="M8 5v14l11-7z" />
        </svg>
      </span>
    </button>
  );
}
