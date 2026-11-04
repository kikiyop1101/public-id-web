#!/usr/bin/env node
// 디자인시스템 문서(public/design-docs/**/*.html, 정적 파일)에 검색용 메타를 넣는다(2026-11-04 task H5).
//   node scripts/design-docs-meta.mjs          # 넣거나 고친다(여러 번 돌려도 같은 결과)
//   node scripts/design-docs-meta.mjs --check  # 빠진 파일만 알리고 종료 코드 1
// 설명 = 그 쪽 h1 바로 뒤 첫 문단(없으면 .hero-lead) — 문서에 이미 적힌 문장만 쓴다. 160자를 넘으면 문장 경계에서 자른다.
// canonical = https://www.public-id.co.kr/design-docs/<경로>. 문서를 볼트에서 다시 내보내면 이 스크립트를 다시 돌린다.
// 사이트맵 목록은 src/app/sitemap.ts가 public/design-docs/assets/search-index.json에서 읽는다.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const DIR = path.join(ROOT, "public", "design-docs");
const SITE = "https://www.public-id.co.kr";
const DESC_MAX = 160;
const check = process.argv.includes("--check");

const len = (s) => [...s].length;
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const text = (html) =>
  html
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();

// src/lib/seo.ts fitDescription과 같은 규칙
function fit(s) {
  if (len(s) <= DESC_MAX) return s;
  const head = [...s].slice(0, DESC_MAX).join("");
  const ends = [...head.matchAll(/[.!?。](?=\s|$)/g)].map((m) => m.index + 1);
  const cut = ends.length ? ends[ends.length - 1] : 0;
  if (cut >= DESC_MAX * 0.5) return head.slice(0, cut).trim();
  const h = [...s].slice(0, DESC_MAX - 1).join("");
  const sp = h.lastIndexOf(" ");
  return (sp > DESC_MAX * 0.6 ? h.slice(0, sp) : h).replace(/[\s,·—-]+$/, "") + "…";
}

function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) return e.name === "assets" ? [] : walk(p);
    return e.name.endsWith(".html") ? [p] : [];
  });
}

let missing = 0;
let changed = 0;
for (const file of walk(DIR)) {
  const rel = path.relative(path.join(ROOT, "public"), file).split(path.sep).join("/");
  let html = fs.readFileSync(file, "utf8");
  const lead =
    html.match(/<h1[^>]*>[\s\S]*?<\/h1>\s*<p(?:\s[^>]*)?>([\s\S]*?)<\/p>/i)?.[1] ??
    html.match(/<p class="hero-lead">([\s\S]*?)<\/p>/i)?.[1];
  if (!lead) {
    console.error(`설명 문단을 못 찾음: ${rel}`);
    missing++;
    continue;
  }
  const desc = fit(text(lead));
  const tags = `<meta name="description" content="${esc(desc)}">\n<link rel="canonical" href="${SITE}/${rel}">\n`;
  const has = /<meta name="description"/.test(html) && /<link rel="canonical"/.test(html);
  if (check) {
    if (!has) {
      console.error(`메타 없음: ${rel}`);
      missing++;
    }
    continue;
  }
  const next = html
    .replace(/<meta name="description"[^>]*>\n?/g, "")
    .replace(/<link rel="canonical"[^>]*>\n?/g, "")
    .replace(/(<\/title>\n?)/, `$1${tags}`);
  if (next !== html) {
    fs.writeFileSync(file, next);
    changed++;
  }
}
if (check) {
  if (missing) process.exit(1);
  console.log("design-docs 메타 정상");
} else {
  console.log(`design-docs ${changed}개 파일 갱신${missing ? `, ${missing}개 실패` : ""}`);
  if (missing) process.exit(1);
}
