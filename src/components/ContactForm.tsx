"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { site } from "@/lib/site";

// 문의는 Web3Forms를 통해 public-id@naver.com 으로 수신됩니다.
// 키 발급(무료, 30초): https://web3forms.com 에서 public-id@naver.com 입력 → 받은 Access Key를 아래에 넣으세요.
// 키가 비어 있으면 임시로 '메일 작성창 열기'로 동작합니다.
const WEB3FORMS_ACCESS_KEY = "3ea63b3e-2e66-41da-a857-3ae8594354b7";

const field =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-[15px] text-ink outline-none transition focus:border-teal focus:ring-2 focus:ring-teal/20";

type Fields = { name: string; email: string; phone: string; message: string };
type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
  const [f, setF] = useState<Fields>({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState<Status>("idle");

  const set =
    (k: keyof Fields) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setF((p) => ({ ...p, [k]: e.target.value }));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!WEB3FORMS_ACCESS_KEY) {
      // 키 발급 전 임시 동작: 메일 작성창 열기
      const subject = encodeURIComponent(`[퍼블릭아이디 문의] ${f.name}`.trim());
      const body = encodeURIComponent(
        `이름/회사: ${f.name}\n이메일: ${f.email}\n연락처: ${f.phone}\n\n${f.message}`,
      );
      window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `[퍼블릭아이디 문의] ${f.name}`,
          from_name: f.name,
          name: f.name,
          email: f.email,
          phone: f.phone,
          message: f.message,
        }),
      });
      const data = await res.json();
      setStatus(data.success ? "sent" : "error");
    } catch {
      setStatus("error");
    }
  };

  if (status === "sent") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-3xl border border-line bg-white p-8 text-center shadow-sm sm:p-12"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-arch text-white">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-5 text-xl font-bold text-ink">문의가 접수되었습니다</h3>
        <p className="mt-2 text-ink-soft">
          빠르게 확인 후 답변드리겠습니다. 감사합니다.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-3xl border border-line bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            이름 / 회사명
          </span>
          <input
            required
            value={f.name}
            onChange={set("name")}
            className={field}
            placeholder="홍길동 / (주)○○"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-ink">
            연락처
          </span>
          <input
            value={f.phone}
            onChange={set("phone")}
            className={field}
            placeholder="010-0000-0000"
          />
        </label>
      </div>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-ink">이메일</span>
        <input
          required
          type="email"
          value={f.email}
          onChange={set("email")}
          className={field}
          placeholder="you@example.com"
        />
      </label>

      <label className="mt-4 block">
        <span className="mb-1.5 block text-sm font-medium text-ink">
          문의 내용
        </span>
        <textarea
          required
          rows={5}
          value={f.message}
          onChange={set("message")}
          className={`${field} resize-none`}
          placeholder="구독 상담 / 시공 견적 등 문의 내용을 적어주세요."
        />
      </label>

      <button
        type="submit"
        disabled={status === "sending"}
        className="mt-6 inline-flex h-12 w-full items-center justify-center rounded-full bg-arch px-8 text-[15px] font-semibold text-white shadow-lg shadow-teal/20 transition hover:-translate-y-0.5 hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
      >
        {status === "sending" ? "보내는 중…" : "문의 보내기"}
      </button>
      {status === "error" && (
        <p role="alert" className="mt-3 text-sm text-yellow-700">
          전송에 실패했습니다. 잠시 후 다시 시도하시거나 {site.email} 으로
          보내주세요.
        </p>
      )}
      <p className="mt-3 text-xs text-ink-soft">
        남겨주신 내용은 {site.email} 으로 접수됩니다.
      </p>
    </form>
  );
}
