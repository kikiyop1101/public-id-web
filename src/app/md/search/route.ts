import type { NextRequest } from "next/server";
import { mdResponse, mdSearch } from "@/lib/agent-md";

// 사이트 검색 결과를 마크다운으로 — /search?q= 에 Accept: text/markdown을 보내면 proxy.ts가 여기로 넘긴다(WebMCP도 이 주소를 쓴다).
export function GET(req: NextRequest) {
  const q = (req.nextUrl.searchParams.get("q") ?? "").slice(0, 60);
  return mdResponse(mdSearch(q), `/search?q=${encodeURIComponent(q)}`);
}
