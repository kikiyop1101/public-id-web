import type { Metadata } from "next";
import { headers } from "next/headers";
import { createAdminClient } from "@/lib/supabase/admin";

// 아웃리치 제안서 열람 페이지 — 메일의 "제안서 웹으로 보기" 링크가 도착하는 곳.
// 토큰별 방문(click)을 기록한다. 검색엔진 비노출(noindex) + 무작위 토큰이라 사실상 비공개.
export const metadata: Metadata = {
  title: "제안서 열람 — 주식회사 퍼블릭아이디",
  robots: { index: false, follow: false },
};
export const dynamic = "force-dynamic";

const DOCS = {
  a: { file: "/proposals/safety-care.pdf", label: "안전시설관리 구독 제안서" },
  b: { file: "/proposals/design-subscription.pdf", label: "디자인구독 제안서" },
} as const;

export default async function ProposalPage({
  params,
  searchParams,
}: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ d?: string }>;
}) {
  const { token } = await params;
  const { d } = await searchParams;
  const h = await headers();
  // 기록 실패가 열람을 막지 않도록 결과는 확인만 하지 않는다(supabase-js는 throw하지 않음)
  await createAdminClient()
    .from("outreach_events")
    .insert({ token: token.slice(0, 64), kind: "click", ua: (h.get("user-agent") ?? "").slice(0, 300) });

  const doc = d === "b" ? DOCS.b : DOCS.a;
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <p className="text-sm font-semibold tracking-widest text-[#069CBB]">PROPOSAL</p>
      <h1 className="mt-2 text-2xl font-bold text-[#16303D]">{doc.label}</h1>
      <p className="mt-2 text-[15px] text-[#57636b]">
        보내드린 제안서 원문입니다. 현장 실측·상담은 무료이니, 메일 회신 또는 070-4150-1172로 편하게 연락 주세요.
      </p>
      <div className="mt-6 overflow-hidden rounded-2xl border border-[#e4eaeb]">
        <iframe src={doc.file} title={doc.label} className="h-[75vh] w-full" />
      </div>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={doc.file} download className="rounded-full bg-[#16303D] px-6 py-3 text-sm font-semibold text-white">
          제안서 PDF 내려받기
        </a>
        <a href="/proposals/company-profile.pdf" download className="rounded-full border border-[#e4eaeb] px-6 py-3 text-sm font-semibold text-[#16303D]">
          회사소개서 내려받기
        </a>
      </div>
      <p className="mt-8 text-xs text-[#8a959b]">
        주식회사 퍼블릭아이디 · 인증 사회적기업(제2020-227호) · public-id.co.kr
      </p>
    </main>
  );
}
