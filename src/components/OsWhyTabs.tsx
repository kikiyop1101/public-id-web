"use client";

import { useState } from "react";

// 우리회사OS "왜" 탭 — 목표(돈)·효율(흩어진 도구 → 한 판) 두 갈래(2026-09-17, hyperez Skein OS 구조 참고).
// 수치 탭은 두지 않는다: 판매 실적·고객 성과 데이터가 아직 없어 지어낸 숫자가 된다.
const TABS = [
  { key: "goal", label: "Goal" },
  { key: "efficiency", label: "Efficiency" },
] as const;

type Key = (typeof TABS)[number]["key"];

function Check() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-teal-700" aria-hidden="true">
      <path d="M3 8.5l3 3 7-7" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function Cross() {
  return (
    <svg viewBox="0 0 16 16" className="mt-1 size-4 shrink-0 text-ink-soft/70" aria-hidden="true">
      <path d="M4 4l8 8M12 4l-8 8" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function OsWhyTabs() {
  const [tab, setTab] = useState<Key>("goal");

  return (
    <div className="mt-12 grid gap-10 lg:grid-cols-[200px_1fr] lg:gap-16">
      <div role="tablist" aria-label="우리회사OS가 이루려는 것" className="flex gap-6 lg:flex-col lg:gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            role="tab"
            type="button"
            aria-selected={tab === t.key}
            onClick={() => setTab(t.key)}
            className={`font-display border-b-2 pb-2 text-left text-lg font-semibold transition lg:py-3 ${
              tab === t.key ? "border-ink text-ink" : "border-transparent text-ink-soft hover:text-ink"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {tab === "goal" ? (
        <div role="tabpanel">
          <h3 className="text-ink text-xl font-bold sm:text-2xl">
            대표가 매출에 쓰는 시간을 늘리고, 새는 돈을 줄입니다
          </h3>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="border-line rounded-2xl border bg-white p-6 sm:p-8">
              <p className="text-teal-700 text-sm font-semibold">시간</p>
              <p className="text-ink mt-3 text-lg font-bold">반복 업무를 사람 손에서 뺍니다</p>
              <p className="text-ink-soft mt-3 text-[15px] leading-relaxed">
                견적서 조립, 독촉 문안, 월말 마감, 아침 브리핑처럼 매주 같은 모양으로 돌아오는 일을
                킷이 맡습니다. 대표와 직원은 고르고 확인하고 보내는 일만 합니다.
              </p>
            </div>
            <div className="border-line rounded-2xl border bg-white p-6 sm:p-8">
              <p className="text-teal-700 text-sm font-semibold">비용</p>
              <p className="text-ink mt-3 text-lg font-bold">도구마다 붙던 월 요금을 걷어 냅니다</p>
              <p className="text-ink-soft mt-3 text-[15px] leading-relaxed">
                업무마다 따로 쓰던 월 구독 대신, 한 번 받은 키트를 회사 안에서 계속 씁니다. 따로 드는
                돈은 이미 쓰시는 AI 구독(ChatGPT·Claude)과 ④AI 직원용 작은 서버뿐입니다.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div role="tabpanel">
          <h3 className="text-ink text-xl font-bold sm:text-2xl">
            흩어진 기록을 한 판으로 모으고, 옮겨 적는 일을 없앱니다
          </h3>
          <div className="mt-8 grid items-stretch gap-4 md:grid-cols-[1fr_auto_1fr]">
            <div className="border-line rounded-2xl border bg-white p-6 sm:p-8">
              <p className="text-ink-soft text-sm font-semibold">AS-IS</p>
              <div className="mt-5 flex flex-wrap gap-2">
                {["엑셀 파일 여러 개", "카톡 대화방", "메모장", "월 구독 도구", "머릿속 기억"].map((t) => (
                  <span key={t} className="bg-paper text-ink-soft rounded-full px-3 py-1.5 text-sm">
                    {t}
                  </span>
                ))}
              </div>
              <ul className="mt-6 space-y-3 text-[15px]">
                {[
                  "같은 거래처 정보를 파일마다 다시 적습니다",
                  "마감·회신 대기가 사람 기억에만 있습니다",
                  "ChatGPT에 물을 때마다 회사 설명부터 다시 합니다",
                ].map((t) => (
                  <li key={t} className="text-ink-soft flex gap-2.5">
                    <Cross />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="text-ink-soft hidden items-center justify-center md:flex" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-6">
                <path d="M4 12h15m-5-5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div className="border-teal-700/40 rounded-2xl border bg-white p-6 sm:p-8">
              <p className="text-teal-700 text-sm font-semibold">TO-BE</p>
              <p className="mt-5">
                <span className="bg-arch inline-flex rounded-full px-4 py-1.5 text-sm font-semibold text-white">
                  우리회사OS
                </span>
              </p>
              <p className="text-ink-soft mt-3 text-sm">회사 기록 한 판 위에서 킷과 AI 직원이 일합니다</p>
              <ul className="mt-6 space-y-3 text-[15px]">
                {[
                  "거래처·견적·일정·재고를 구글시트 한 판에 모읍니다",
                  "킷이 그 기록을 읽어 문서·리포트를 만듭니다",
                  "AI 직원이 할 일을 올리고, 대표는 승인만 합니다",
                ].map((t) => (
                  <li key={t} className="text-ink flex gap-2.5">
                    <Check />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
