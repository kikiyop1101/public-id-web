import { mdFor, mdPaths } from "@/lib/agent-md";

// /llms-full.txt — 마크다운 문서 전부(회사 요약·제품·우리회사OS 킷·소식·질문 답변)를 한 파일로(2026-10-08).
// 짧은 요약은 /llms.txt(손으로 다듬는 정본), 이 파일은 빌드 때 데이터에서 자동으로 만든다.
export const dynamic = "force-static";

export function GET() {
  const body = mdPaths()
    .map((p) => mdFor(p))
    .filter((s): s is string => Boolean(s))
    .join("\n\n---\n\n");
  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
