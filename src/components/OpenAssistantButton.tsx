'use client'

// 우측 하단 플로팅 '제품·견적 도우미'를 페이지 본문에서 여는 버튼.
// Assistant.tsx가 "pi:open-assistant" 이벤트를 수신한다.
export default function OpenAssistantButton({ className }: { className?: string }) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('pi:open-assistant'))}
      className={
        className ??
        'inline-flex h-11 items-center gap-2 rounded-full bg-teal-700 px-5 text-sm font-semibold text-white transition hover:bg-teal-800'
      }
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.6-.8L3 21l1.8-5.4A8.5 8.5 0 1 1 21 11.5z" />
      </svg>
      도우미에게 바로 물어보기
    </button>
  )
}
