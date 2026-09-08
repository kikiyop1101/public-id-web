"use client";

import { useEffect, useState } from "react";
import LiteYouTube from "@/components/LiteYouTube";
import { cn } from "@/lib/cn";
import { VIDEO_CATEGORIES, isLive, type Video, type VideoCategory } from "@/lib/videos";

type Tab = "롱폼 설명영상" | "쇼츠 전체" | VideoCategory;
const TABS: Tab[] = ["롱폼 설명영상", "쇼츠 전체", ...VIDEO_CATEGORIES];

function matches(v: Video, t: Tab): boolean {
  if (t === "롱폼 설명영상") return v.kind === "long";
  if (t === "쇼츠 전체") return v.kind === "short";
  return v.category === t;
}

// 탭 상태는 URL 해시(#쇼츠 전체)에 남겨 공유·뒤로가기가 통하게 한다. 기본 탭 = 롱폼(체류 효과 최대).
export default function VideoGrid({ videos }: { videos: Video[] }) {
  const [tab, setTab] = useState<Tab>("롱폼 설명영상");
  // 예약 공개 롱폼은 브라우저 시각 기준으로 자동 노출(서버 빌드 시각에 묶이지 않게 클라이언트에서 판정).
  const [now, setNow] = useState(0);

  useEffect(() => {
    const sync = () => {
      const fromHash = decodeURIComponent(window.location.hash.slice(1)) as Tab;
      if (TABS.includes(fromHash)) setTab(fromHash);
    };
    window.addEventListener("hashchange", sync);
    if (window.location.hash) window.dispatchEvent(new Event("hashchange"));
    const id = requestAnimationFrame(() => setNow(Date.now()));
    return () => {
      window.removeEventListener("hashchange", sync);
      cancelAnimationFrame(id);
    };
  }, []);

  const select = (t: Tab) => {
    setTab(t);
    history.replaceState(null, "", t === "롱폼 설명영상" ? location.pathname : `#${t}`);
  };

  // now=0(첫 렌더)일 땐 예약분을 숨긴다 — 공개 전 영상은 유튜브가 재생을 막아 회색 화면만 뜬다.
  const live = videos.filter((v) => isLive(v, now || 0));
  const list = live.filter((v) => matches(v, tab));

  return (
    <div>
      <div role="tablist" aria-label="영상 분류" className="flex flex-wrap gap-2">
        {TABS.map((t) => {
          const n = live.filter((v) => matches(v, t)).length;
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
              {v.kind === "long" ? `설명영상 · ${v.series}` : `쇼츠 · ${v.category}`}
            </p>
          </li>
        ))}
      </ul>
      {tab === "롱폼 설명영상" && (
        <p className="mt-8 text-xs leading-relaxed text-ink-soft">
          시리즈마다 1편(개요)·2편(가격·사례)·3편(화이트보드 3분 정리)으로 이어집니다. 예약 공개 영상은 공개 시각에 자동으로 나타납니다.
        </p>
      )}
    </div>
  );
}
