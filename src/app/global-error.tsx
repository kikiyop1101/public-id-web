"use client"; // 루트 layout에서 난 오류용 — 자기 html·body를 그리고 전역 CSS가 없으므로 모양은 인라인으로

// 2026-10-22 프론트엔드 패턴(에러 경계): layout 자체가 깨져도 흰 화면 대신 안내와 다시 시도 단추. 색은 globals.css 토큰 값(paper·ink·ink-soft·teal-700)
export default function GlobalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  console.error(error);
  return (
    <html lang="ko">
      <body style={{ margin: 0, minHeight: "100dvh", display: "grid", placeItems: "center", background: "#f1f1f0", color: "#0F172A", fontFamily: "Pretendard, system-ui, sans-serif", wordBreak: "keep-all" }}>
        <title>퍼블릭아이디 — 잠시 문제가 생겼습니다</title>
        <main style={{ padding: "24px 16px", textAlign: "center" }}>
          <h1 style={{ margin: 0, fontSize: 24 }}>화면을 불러오지 못했습니다</h1>
          <p style={{ margin: "12px 0 28px", color: "#57636b" }}>잠시 뒤 다시 시도해 주세요.</p>
          <button
            type="button"
            onClick={() => retry()}
            style={{ height: 48, padding: "0 28px", border: 0, borderRadius: 999, background: "#0b6c7d", color: "#fff", fontSize: 15, fontWeight: 600, cursor: "pointer" }}
          >
            다시 시도
          </button>
        </main>
      </body>
    </html>
  );
}
