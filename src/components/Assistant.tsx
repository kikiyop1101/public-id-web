"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Msg = { role: "user" | "assistant"; content: string };

const GREETING: Msg = {
  role: "assistant",
  content:
    "안녕하세요! 퍼블릭아이디 도우미예요. 어떤 공간에 어떤 게 필요하신가요? (예: 어린이보호구역 보행안전, 주차장 노면표시, 브랜드 디자인 구독) 맞는 제품과 대략 견적을 알려드릴게요.",
};

// **굵게** 마크다운만 가볍게 굵은 글씨로 렌더(말풍선에 별표가 그대로 보이지 않게).
function renderText(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((p, i) =>
    p.startsWith("**") && p.endsWith("**") ? (
      <strong key={i} className="font-semibold">
        {p.slice(2, -2)}
      </strong>
    ) : (
      <span key={i}>{p}</span>
    ),
  );
}

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([GREETING]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, open, loading]);

  // 열릴 때 입력창으로 포커스 이동 + Esc로 닫기
  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [open]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    const next: Msg[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);
    try {
      let convo = next.filter((_, i) => i > 0); // 인사말 제외
      if (convo.length > 11) convo = convo.slice(-11);
      if (convo[0]?.role === "assistant") convo = convo.slice(1); // user 메시지로 시작
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: convo }),
      });
      const data = (await res.json()) as { reply?: string; error?: string };
      const reply =
        res.ok && data.reply ? data.reply : data.error ?? "잠시 후 다시 시도해 주세요.";
      setMessages((m) => [...m, { role: "assistant", content: reply }]);
    } catch {
      setMessages((m) => [
        ...m,
        { role: "assistant", content: "연결이 불안정해요. 070-4150-1172 로 문의해 주세요." },
      ]);
    } finally {
      setLoading(false);
    }
  }

  function onKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && !e.nativeEvent.isComposing) {
      e.preventDefault();
      send();
    }
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="제품·견적 도우미 열기"
        className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-800"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.8-5.4A8.5 8.5 0 1 1 21 11.5z" />
        </svg>
        제품·견적 도우미
      </button>
    );
  }

  const inquiryMsgs = messages.filter((_, i) => i > 0);
  const inquiryHref =
    inquiryMsgs.length === 0
      ? "/contact"
      : "/contact?msg=" +
        encodeURIComponent(
          (
            "[홈페이지 도우미 상담 내용]\n\n" +
            inquiryMsgs
              .map((m) => (m.role === "user" ? "· 문의: " : "· 도우미: ") + m.content)
              .join("\n\n")
          ).slice(0, 1500),
        );

  return (
    <div
      role="dialog"
      aria-label="퍼블릭아이디 도우미"
      className="fixed bottom-5 right-5 z-50 flex h-[min(560px,80vh)] w-[min(380px,calc(100vw-2.5rem))] flex-col overflow-hidden rounded-2xl border border-line bg-white shadow-2xl"
    >
      <header className="flex items-center justify-between gap-2 bg-teal-700 px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">퍼블릭아이디 도우미</p>
          <p className="text-[11px] text-white/70">제품 추천 · 대략 견적 안내</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="닫기" className="rounded-md p-1 transition hover:bg-white/15">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      </header>

      <div ref={scrollRef} role="log" aria-live="polite" aria-label="대화 내용" className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m, i) => (
          <div key={i} className={m.role === "user" ? "flex justify-end" : "flex justify-start"}>
            <p
              className={
                "max-w-[85%] whitespace-pre-wrap rounded-2xl px-3.5 py-2 text-[13px] leading-relaxed " +
                (m.role === "user" ? "bg-teal-700 text-white" : "bg-neutral-100 text-ink")
              }
            >
              {renderText(m.content)}
            </p>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <p className="rounded-2xl bg-neutral-100 px-3.5 py-2 text-[13px] text-ink-soft">답변 작성 중…</p>
          </div>
        )}
      </div>

      <div className="border-t border-line px-3 py-2.5">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={onKey}
            aria-label="도우미에게 보낼 메시지"
            placeholder="어떤 게 필요하세요?"
            className="min-w-0 flex-1 rounded-full border border-line px-3.5 py-2 text-[13px] text-ink outline-none focus:border-teal-600"
          />
          <button
            type="button"
            onClick={send}
            disabled={loading || !input.trim()}
            aria-label="보내기"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-teal-700 text-white transition hover:bg-teal-800 disabled:opacity-40"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="m22 2-7 20-4-9-9-4z" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-center text-[11px] text-ink-soft">
          정확한 견적·상담은{" "}
          <Link href={inquiryHref} className="font-medium text-teal-700 underline">
            {inquiryMsgs.length ? "이 대화로 문의하기" : "문의하기"}
          </Link>
          {" · ☎ "}
          <a href="tel:070-4150-1172" className="text-teal-700">070-4150-1172</a>
        </p>
      </div>
    </div>
  );
}
