"use client";
import { useState } from "react";

type Link = { client: string; count: number; url: string };

export default function LinksTable({ links }: { links: Link[] }) {
  const [copied, setCopied] = useState<string | null>(null);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied((c) => (c === url ? null : c)), 1500);
    } catch {
      /* clipboard blocked — user can still select the link text */
    }
  };

  if (links.length === 0)
    return (
      <div className="rounded-2xl border border-line bg-cloud p-8 text-center text-sm text-ink-soft">
        아직 등록된 발주처가 없습니다. 구글 시트의{" "}
        <b className="text-ink">발주처</b> 칸을 채우면, 발주처마다 전용 링크가 여기에
        자동으로 생깁니다.
      </div>
    );

  return (
    <div className="overflow-hidden rounded-2xl border border-line">
      <div className="grid grid-cols-[1fr_auto_auto] gap-3 border-b border-line bg-cloud px-4 py-2.5 text-xs font-medium text-ink-soft">
        <span>발주처</span>
        <span>시설</span>
        <span>전용 링크</span>
      </div>
      {links.map((l) => (
        <div
          key={l.url}
          className="grid grid-cols-[1fr_auto_auto] items-center gap-3 border-b border-line px-4 py-3 last:border-b-0"
        >
          <span className="truncate text-sm font-medium text-ink">{l.client}</span>
          <span className="whitespace-nowrap text-sm text-ink-soft">{l.count}건</span>
          <span className="flex items-center gap-2">
            <a
              href={l.url}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden max-w-[260px] truncate text-xs text-teal-700 underline md:inline"
            >
              {l.url}
            </a>
            <button
              type="button"
              onClick={() => copy(l.url)}
              className="whitespace-nowrap rounded-lg border border-line px-3 py-1.5 text-xs font-medium text-ink transition hover:border-teal hover:text-teal-700"
            >
              {copied === l.url ? "복사됨 ✓" : "링크 복사"}
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}
