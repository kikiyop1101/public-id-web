"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useState } from "react";
import type { SearchEntry } from "@/lib/search-index";

// 홈 히어로 질문창(2026-10-08) — 엑사 홈이 첫 화면에서 검색을 직접 써 보게 하는 구조를 우리 말로:
// [찾기] = 사이트 안 페이지를 바로 보여 주고(Enter → /search?q=), [AI에게 묻기] = 우측 하단 도우미가 그 질문으로 바로 답한다.
// 검색 색인(8KB)은 첫 번들에 싣지 않고 입력창을 처음 만질 때 불러온다(헤더 검색과 같은 원칙, 2026-09-28).
type Mode = "find" | "ask";

const CHIPS: { label: string; q: string }[] = [
  { label: "AI 업무 자동화", q: "AI 자동화" },
  { label: "스쿨존 안전시설", q: "스쿨존" },
  { label: "홈페이지·마스코트", q: "홈페이지" },
  { label: "견적 계산", q: "견적" },
];

function match(index: SearchEntry[], q: string): SearchEntry[] {
  const tokens = q.trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (!tokens.length) return [];
  return index
    .filter((e) => {
      const hay = `${e.label} ${e.desc} ${e.keywords} ${e.group}`.toLowerCase();
      const compact = hay.replace(/\s+/g, "");
      return tokens.every((t) => hay.includes(t) || compact.includes(t));
    })
    .slice(0, 4);
}

export default function HeroAsk() {
  const router = useRouter();
  const listId = useId();
  const [mode, setMode] = useState<Mode>("find");
  const [q, setQ] = useState("");
  const [index, setIndex] = useState<SearchEntry[] | null>(null);

  const load = () => {
    if (!index) void import("@/lib/search-index").then((m) => setIndex(m.SEARCH_INDEX));
  };
  const hits = useMemo(() => (index && mode === "find" ? match(index, q) : []), [index, mode, q]);

  const ask = (text: string) => {
    window.dispatchEvent(new CustomEvent("pi:open-assistant", { detail: { q: text } }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const text = q.trim();
    if (!text) return;
    if (mode === "ask") {
      ask(text);
      setQ("");
    } else {
      router.push(`/search?q=${encodeURIComponent(text)}`);
    }
  };

  const pickChip = (chip: string) => {
    load();
    if (mode === "ask") ask(`${chip} 알려 주세요`);
    else setQ(chip);
  };

  return (
    <div className="w-full max-w-xl">
      <div role="tablist" aria-label="질문 방식" className="inline-flex rounded-full border border-line-strong bg-white p-1">
        {(
          [
            ["find", "찾기"],
            ["ask", "AI에게 묻기"],
          ] as [Mode, string][]
        ).map(([m, label]) => (
          <button
            key={m}
            type="button"
            role="tab"
            aria-selected={mode === m}
            onClick={() => setMode(m)}
            className={
              mode === m
                ? "rounded-full bg-navy px-4 py-1.5 text-sm font-semibold text-white"
                : "rounded-full px-4 py-1.5 text-sm font-medium text-ink-soft transition hover:text-ink"
            }
          >
            {label}
          </button>
        ))}
      </div>

      {/* 자바스크립트가 없어도 /search?q= 로 간다 */}
      <form action="/search" role="search" onSubmit={submit} className="mt-3">
        <div className="flex items-center gap-2 rounded-2xl border border-line bg-white p-2 shadow-sm transition focus-within:border-teal focus-within:ring-2 focus-within:ring-teal/20">
          <svg aria-hidden viewBox="0 0 20 20" className="ml-2 h-5 w-5 shrink-0 text-ink-soft" fill="none" stroke="currentColor" strokeWidth="1.8">
            {mode === "find" ? (
              <>
                <circle cx="9" cy="9" r="6" />
                <path d="m13.5 13.5 3.5 3.5" strokeLinecap="round" />
              </>
            ) : (
              <path d="M17.5 9.6a6.9 6.9 0 0 1-7 7 7 7 0 0 1-3-.7L3 17l1.5-4.4A7 7 0 1 1 17.5 9.6z" strokeLinejoin="round" />
            )}
          </svg>
          <label htmlFor="hero-q" className="sr-only">
            {mode === "find" ? "사이트에서 찾기" : "AI 도우미에게 묻기"}
          </label>
          <input
            id="hero-q"
            name="q"
            value={q}
            maxLength={60}
            autoComplete="off"
            onFocus={load}
            onChange={(e) => setQ(e.target.value)}
            aria-controls={hits.length ? listId : undefined}
            placeholder={mode === "find" ? "무엇을 찾으세요? 예: 스쿨존 노면표시" : "무엇이든 물어보세요. 예: 노란발자국 얼마예요?"}
            className="h-11 min-w-0 flex-1 bg-transparent text-base text-ink outline-none placeholder:text-ink-soft/70"
          />
          <button
            type="submit"
            className="h-11 shrink-0 rounded-xl bg-navy px-4 text-sm font-semibold text-white transition hover:bg-teal sm:px-5"
          >
            {mode === "find" ? "찾기" : "묻기"}
          </button>
        </div>
      </form>

      {hits.length > 0 ? (
        <ul id={listId} className="mt-2 overflow-hidden rounded-2xl border border-line bg-white shadow-sm">
          {hits.map((h) => (
            <li key={h.href} className="border-b border-line last:border-b-0">
              <Link
                href={h.href}
                {...(h.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                className="flex items-baseline justify-between gap-4 px-4 py-3 transition hover:bg-cloud"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-semibold text-ink">{h.label}</span>
                  <span className="block truncate text-sm text-ink-soft">{h.desc}</span>
                </span>
                <span className="shrink-0 text-xs font-semibold text-teal-700">{h.group}</span>
              </Link>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => ask(q)}
              className="flex w-full items-center gap-2 bg-cloud/60 px-4 py-3 text-left text-sm font-semibold text-teal-700 transition hover:bg-cloud"
            >
              <span className="truncate">AI 도우미에게 ‘{q.trim()}’ 물어보기</span>
              <span aria-hidden>→</span>
            </button>
          </li>
        </ul>
      ) : (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {mode === "find" && index && q.trim() && (
            <button
              type="button"
              onClick={() => ask(q)}
              className="mr-1 text-sm font-semibold text-teal-700 transition hover:text-teal"
            >
              맞는 페이지가 없어요 — AI 도우미에게 물어보기 →
            </button>
          )}
          {CHIPS.map((c) => (
            <button
              key={c.label}
              type="button"
              onClick={() => pickChip(c.q)}
              className="rounded-full border border-line-strong bg-white px-3.5 py-1.5 text-sm font-medium text-ink-soft transition hover:border-teal hover:text-teal-700"
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
