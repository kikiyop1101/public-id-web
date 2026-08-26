"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { SEARCH_INDEX, SEARCH_GROUPS, type SearchEntry } from "@/lib/search-index";

// 사이트 전체 검색 (2026-08-26 — 대표: "메뉴·페이지 줄이긴 싫고 찾기 쉽게").
// 빈 입력 = 전체 페이지 지도(그룹별), 입력 시 = 라벨·설명·키워드 부분일치 필터.
// 열기: 헤더 버튼 · Ctrl/Cmd+K · '/'. 닫기: Esc·바깥 클릭. 이동: ↑↓ + Enter.
// 패널은 열릴 때만 마운트 — 상태가 매번 새로 시작하므로 리셋 이펙트가 필요 없다.
export default function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  if (!open) return null;
  return <SearchPanel onClose={onClose} />;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return SEARCH_INDEX;
    // "머라고 써도" 잡히게(2026-08-26 대표 질문 후 보강):
    // ①단어별 AND — "AI 진단"처럼 떨어져 있어도 각 단어가 어디든 있으면 매칭
    // ②띄어쓰기 무시 — "무료진단"도 "무료 진단"에 매칭
    const tokens = query.split(/\s+/).filter(Boolean);
    return SEARCH_INDEX.filter((e) => {
      const hay = `${e.label} ${e.desc} ${e.keywords} ${e.group}`.toLowerCase();
      const hayCompact = hay.replace(/\s+/g, "");
      return tokens.every((t) => hay.includes(t) || hayCompact.includes(t));
    });
  }, [q]);

  const grouped = useMemo(() => {
    const flat: SearchEntry[] = [];
    const groups = SEARCH_GROUPS.map((g) => {
      const items = results
        .filter((e) => e.group === g)
        .map((entry) => {
          flat.push(entry);
          return { entry, idx: flat.length - 1 };
        });
      return { group: g, items };
    }).filter((g) => g.items.length > 0);
    return { groups, flat };
  }, [results]);

  const go = useCallback(
    (entry: SearchEntry) => {
      onClose();
      if (entry.external) {
        window.open(entry.href, "_blank", "noopener,noreferrer");
      } else {
        router.push(entry.href);
      }
    },
    [onClose, router],
  );

  // 마운트 시 포커스 + 바디 스크롤 잠금
  useEffect(() => {
    const raf = requestAnimationFrame(() => inputRef.current?.focus());
    document.body.style.overflow = "hidden";
    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    const { flat } = grouped;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActive((a) => Math.min(a + 1, flat.length - 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActive((a) => Math.max(a - 1, 0));
      } else if (e.key === "Enter" && flat[active]) {
        e.preventDefault();
        go(flat[active]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [grouped, active, go, onClose]);

  // 활성 항목이 스크롤 밖으로 나가면 따라간다
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-idx="${active}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [active]);

  return (
    <div
      className="fixed inset-0 z-[70] flex items-start justify-center bg-navy/40 px-4 pt-[12vh] backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="사이트 검색"
    >
      <div
        className="flex max-h-[70vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 border-b border-line px-4">
          <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4 shrink-0 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="9" cy="9" r="6" />
            <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
          </svg>
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => {
              setQ(e.target.value);
              setActive(0);
            }}
            placeholder="페이지 · 제품 · 서비스 검색  (예: 노란발자국, 견적, 인증)"
            className="h-12 w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-soft/60"
            aria-label="검색어"
          />
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-md px-1.5 py-0.5 font-display text-[11px] font-semibold uppercase tracking-wider text-ink-soft transition hover:text-ink"
          >
            esc
          </button>
        </div>
        <div ref={listRef} className="overflow-y-auto overscroll-contain p-2">
          {grouped.flat.length === 0 && (
            <p className="px-3 py-8 text-center text-sm text-ink-soft">
              &lsquo;{q}&rsquo; 결과가 없습니다 — 문의하기에서 직접 물어보셔도 됩니다.
            </p>
          )}
          {grouped.groups.map((g) => (
            <div key={g.group} className="mb-1">
              <p className="px-3 pb-1 pt-3 font-display text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">
                {g.group}
              </p>
              {g.items.map(({ entry, idx }) => (
                <button
                  key={`${entry.href}-${entry.label}`}
                  type="button"
                  data-idx={idx}
                  onClick={() => go(entry)}
                  onMouseEnter={() => setActive(idx)}
                  className={`flex w-full items-baseline justify-between gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                    idx === active ? "bg-cloud" : ""
                  }`}
                >
                  <span className="min-w-0">
                    <span className="block truncate text-[15px] font-semibold text-ink">
                      {entry.label}
                      {entry.external && (
                        <span aria-hidden className="ml-1 text-xs text-ink-soft">↗</span>
                      )}
                    </span>
                    <span className="block truncate text-xs text-ink-soft">{entry.desc}</span>
                  </span>
                  <span aria-hidden className={`shrink-0 text-sm text-teal-700 transition ${idx === active ? "opacity-100" : "opacity-0"}`}>
                    →
                  </span>
                </button>
              ))}
            </div>
          ))}
        </div>
        <p className="border-t border-line px-4 py-2 text-[11px] text-ink-soft">
          ↑↓ 이동 · Enter 열기 · 빈 검색창은 전체 페이지 지도입니다
        </p>
      </div>
    </div>
  );
}
