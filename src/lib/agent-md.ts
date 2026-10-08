// AI 에이전트용 마크다운 — 같은 주소를 `Accept: text/markdown`으로 부르거나 /md/<경로>·<경로>.md로 열면 이 글이 나간다(2026-10-08).
// 근거: 엑사(exa.ai)가 홈을 Accept: text/markdown·/index.md로 내주고, Claude Code 등은 이 헤더를 보낸다(Vercel·Cloudflare 가이드).
// 사실은 화면과 같은 정본(llms.txt·products.ts·os-kits.ts·news.json·answers.json)에서만 조립한다 — 여기서 새 문구를 짓지 않는다.
// 빌드 때 만들 주소 목록은 mdPaths()가 정본이다. proxy.ts의 MD_PATH(경로 판정)는 엣지 번들을 가볍게 두려고 따로 둔다 — 둘을 같이 고친다.
import fs from "node:fs";
import path from "node:path";
import { site } from "@/lib/site";
import { PRODUCTS } from "@/lib/products";
import { KITS, KIT_GROUPS, ALL_IN_ONE, formatPrice, priceLabel } from "@/lib/os-kits";
import { KIT_PAGES, getKitPage } from "@/lib/os-kit-pages";
import { news, getNews } from "@/lib/news";
import { answers, getAnswer } from "@/lib/answers";
import { searchSite } from "@/lib/site-search";

const url = (p: string) => `${site.url}${p === "/" ? "" : p}`;
const cell = (s: string) => s.replace(/\|/g, "\\|").replace(/\n/g, " ");

/** 모든 마크다운 문서 머리 — 어디서 왔고 사람용 원문이 어디인지 */
function head(title: string, pagePath: string): string {
  return `# ${title}\n\n> 출처: ${site.legalName}(${site.nameEn}) 공식 홈페이지 · 원문 ${url(pagePath)} · 회사 요약 ${site.url}/llms.txt\n`;
}

function mdHome(): string {
  const llms = fs.readFileSync(path.join(process.cwd(), "public", "llms.txt"), "utf8");
  const recent = news
    .slice(0, 5)
    .map((n) => `- [${n.title}](${url(`/news/${n.slug}`)}) — ${n.subtitle}`)
    .join("\n");
  return `${llms.trimEnd()}\n\n## 최근 소식\n${recent}\n`;
}

function mdProducts(): string {
  const body = PRODUCTS.map((p) => {
    const lines = [`## ${p.name}`, "", `${p.tagline}. ${p.summary}`, ""];
    if (p.basePrice) lines.push(`- 가격: ${p.basePrice}`);
    for (const pt of p.points) lines.push(`- ${pt.text}`);
    lines.push(`- 자세히: ${url(p.anchor)}`);
    return lines.join("\n");
  }).join("\n\n");
  return `${head("퍼블릭아이디 제품", "/products")}
가격은 모두 기준가(VAT 포함)이며 정확한 견적은 규격·수량·현장 조건에 따라 문의로 안내합니다. 견적 시뮬레이터 ${url("/estimate")} · 맞춤 견적 ${url("/quote")} · 전화 ${site.tel}

${body}
`;
}

function mdOsHub(): string {
  const groups = KIT_GROUPS.map((g) => {
    const rows = KITS.filter((k) => k.group === g.key).map((k) => {
      const page = KIT_PAGES.find((p) => p.kit === k);
      const list = k.listPrice > k.price ? ` (정가 ${formatPrice(k.listPrice)}원)` : "";
      return `| ${cell(`${k.no}${k.name}`)} | ${cell(k.tagline)} | ${priceLabel(k.price)}${list} | ${page ? url(`/os/${page.slug}`) : url("/os")} |`;
    });
    return `## ${g.title} — ${g.desc}\n\n| 킷 | 하는 일 | 가격(부가세 포함) | 상세 |\n|---|---|---|---|\n${rows.join("\n")}`;
  }).join("\n\n");
  return `${head("우리회사OS — 기업 맞춤형 AI 업무 자동화 키트", "/os")}
견적서·홍보 글·문의 답변·월말 마감 같은 반복 업무를 AI에 맡기는 실행 키트 ${KITS.length}종입니다. 설치 없이 내려받아 더블클릭으로 쓰고, 결과물에는 구매한 회사 이름이 들어갑니다. AI 구독료(ChatGPT·Claude 등)는 별도입니다.

- 올인원 키트(기업 맞춤형 AI 운영체제): ${formatPrice(ALL_IN_ONE.price)}원(부가세 포함) — 구독 상담 ${url("/contact")}로만 판매
- 3분 무료 진단: ${url("/os#scan")}

${groups}
`;
}

function mdKit(slug: string): string | null {
  const p = getKitPage(slug);
  if (!p) return null;
  const { price, listPrice } = p.kit;
  const lines = [
    head(`우리회사OS ${p.label} — ${p.h1}`, `/os/${p.slug}`),
    p.lead,
    "",
    `- 가격: ${priceLabel(price)}${listPrice > price ? ` (정가 ${formatPrice(listPrice)}원)` : ""} · 부가세 포함${p.note ? ` · ${p.note}` : ""}`,
    `- 구매: ${p.kit.url}`,
  ];
  if (p.members?.length) {
    lines.push("", "## 구성 킷", ...p.members.map((m) => `- [${m.label}](${url(`/os/${m.slug}`)}) — ${m.title}`));
  } else {
    if (p.features.length) lines.push("", "## 덜어 주는 일", ...p.features.map(([t, d]) => `- **${t}** — ${d}`));
    if (p.needs.length) lines.push("", "## 준비물", ...p.needs.map((n) => `- ${n}`));
    if (p.steps.length) lines.push("", "## 사용 흐름", ...p.steps.map(([t, d], i) => `${i + 1}. **${t}** — ${d}`));
  }
  if (p.faq.length) lines.push("", "## 자주 묻는 질문", ...p.faq.flatMap((f) => [`### ${f.q}`, f.a]));
  return lines.join("\n") + "\n";
}

function mdNews(slug: string): string | null {
  const n = getNews(slug);
  if (!n) return null;
  const body = n.body.map((para) => (para.startsWith("### ") ? `\n${para}` : para)).join("\n\n");
  return `${head(n.title, `/news/${n.slug}`)}
**${n.subtitle}**

${body}
`;
}

function mdAnswer(slug: string): string | null {
  const a = getAnswer(slug);
  if (!a) return null;
  const t = a.table;
  const table = [
    `| ${t.columns.map(cell).join(" | ")} |`,
    `|${t.columns.map(() => "---").join("|")}|`,
    ...t.rows.map((r) => `| ${r.map(cell).join(" | ")} |`),
  ].join("\n");
  const ours = a.ours.items.map((it, i) => `${a.ours.ordered ? `${i + 1}.` : "-"} **${it.title}** — ${it.text}`).join("\n");
  const faq = a.faq.map((f) => `### ${f.q}\n${f.a}`).join("\n\n");
  const actions = a.actions.map((x) => `- [${x.label}](${url(x.href)})`).join("\n");
  return `${head(a.question, `/answers/${a.slug}`)}
${a.answer}

## ${t.title}

${table}

## ${a.ours.title}

${ours}

## 자주 묻는 질문

${faq}

## 다음 행동

${actions}
`;
}

/** 검색 결과 — /search?q= 를 마크다운으로(동적) */
export function mdSearch(q: string): string {
  const hits = searchSite(q, 12);
  const list = hits.length
    ? hits.map((h) => `- [${h.label}](${h.external ? h.href : url(h.href)}) — ${h.group} · ${h.desc}`).join("\n")
    : `- 맞는 페이지가 없습니다. 회사 요약 ${site.url}/llms.txt 또는 문의 ${url("/contact")} · 전화 ${site.tel}`;
  return `${head(`퍼블릭아이디 사이트 검색: ${q || "(빈 검색어)"}`, `/search?q=${encodeURIComponent(q)}`)}
${list}
`;
}

/** 빌드 때 미리 만드는 마크다운 주소(사람용 경로 기준). /search는 동적이라 뺀다. */
export function mdPaths(): string[] {
  return [
    "/",
    "/products",
    "/os",
    ...KIT_PAGES.map((p) => `/os/${p.slug}`),
    ...news.map((n) => `/news/${n.slug}`),
    ...answers.map((a) => `/answers/${a.slug}`),
  ];
}

/** 사람용 경로 → 마크다운. 없는 경로면 null */
export function mdFor(pagePath: string): string | null {
  if (pagePath === "/") return mdHome();
  if (pagePath === "/products") return mdProducts();
  if (pagePath === "/os") return mdOsHub();
  const m = pagePath.match(/^\/(os|news|answers)\/([^/]+)$/);
  if (!m) return null;
  const slug = decodeURIComponent(m[2]);
  if (m[1] === "os") return mdKit(slug);
  if (m[1] === "news") return mdNews(slug);
  return mdAnswer(slug);
}

export function mdResponse(body: string, pagePath: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      Vary: "Accept",
      "X-Robots-Tag": "noindex",
      Link: `<${url(pagePath)}>; rel="canonical"`,
    },
  });
}
