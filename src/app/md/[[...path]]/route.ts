import { mdFor, mdPaths, mdResponse } from "@/lib/agent-md";

// AI 에이전트용 마크다운(2026-10-08) — /md, /md/products, /md/os/<slug>, /md/news/<slug>, /md/answers/<slug>.
// 사람용 주소에 Accept: text/markdown을 보내거나 <주소>.md를 열면 proxy.ts가 여기로 넘긴다. 전부 빌드 때 만든다.
export const dynamicParams = false;

export function generateStaticParams() {
  return mdPaths().map((p) => ({ path: p === "/" ? [] : p.slice(1).split("/") }));
}

export async function GET(_req: Request, { params }: { params: Promise<{ path?: string[] }> }) {
  const { path } = await params;
  const pagePath = "/" + (path ?? []).join("/");
  const body = mdFor(pagePath);
  if (!body) return new Response("Not found", { status: 404 });
  return mdResponse(body, pagePath);
}
