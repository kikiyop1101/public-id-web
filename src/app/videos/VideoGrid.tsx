"use client";

import { useEffect, useState } from "react";
import LiteYouTube from "@/components/LiteYouTube";
import { cn } from "@/lib/cn";
import { VIDEO_CATEGORIES, type Video, type VideoCategory } from "@/lib/videos";

type Tab = "전체" | VideoCategory;
const TABS: Tab[] = ["전체", ...VIDEO_CATEGORIES];

// 탭 상태는 URL 해시(#안전·시공)에 남겨 공유·뒤로가기가 통하게 한다.
export default function VideoGrid({ videos }: { videos: Video[] }) {
  const [tab, setTab] = useState<Tab>("전체");

  // 첫 진입·뒤로가기 때 URL 해시(#안전·시공)를 탭으로 복원 — 외부 시스템(주소창) 구독 형태.
  useEffect(() => {
    const sync = () => {
      const fromHash = decodeURIComponent(window.location.hash.slice(1)) as Tab;
      if (TABS.includes(fromHash)) setTab(fromHash);
    };
    window.addEventListener("hashchange", sync);
    if (window.location.hash) window.dispatchEvent(new Event("hashchange"));
    return () => window.removeEventListener("hashchange", sync);
  }, []);

  const select = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", t === "전체" ? location.pathname : `#${t}`);
  };

  const list = tab === "전체" ? videos : videos.filter((v) => v.category === tab);

  return (
    <div>
      <div role="tablist" aria-label="영상 분류" className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const n = t === "전체" ? videos.length : videos.filter((v) => v.category === t).length;
          const active = t === tab;
          return (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => select(t)}
              className={cn(
                "inline-flex h-10 items-center gap-1.5 rounded-full border px-4 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-700 focus-visible:ring-offset-2",
                active
                  ? "border-navy bg-navy text-white"
                  : "border-line bg-white/70 text-ink-soft hover:border-teal hover:text-teal-700",
              )}
            >
              {t}
              <span className={cn("font-display text-xs", active ? "text-white/70" : "text-ink-soft/70")}>{n}</span>
            </button>
          );
        })}
      </div>

      <ul className="mt-8 grid gap-x-6 gap-y-9 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((v) => (
          <li key={v.id}>
            <LiteYouTube id={v.id} title={v.title} place="videos" />
            <p className="mt-3 break-keep text-[15px] font-bold leading-snug text-ink">{v.title}</p>
            <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-teal-700">
              {v.category}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
