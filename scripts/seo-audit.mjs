#!/usr/bin/env node
// SEO·AEO 구조 점검(2026-11-04, task H5) — 빌드 결과(.next)를 `next start`로 띄워 실제 HTML을 읽고 검사한다.
//
//   npm run build && node scripts/seo-audit.mjs            # 빌드 결과를 임시 포트로 띄워 검사
//   node scripts/seo-audit.mjs --base http://localhost:3000 # 이미 떠 있는 서버를 검사
//   node scripts/seo-audit.mjs --json out.json              # 결과를 JSON으로도 저장
//
// 검사 항목(문제가 하나라도 있으면 종료 코드 1):
//  1. 깨진 내부 링크 — 모든 공개 쪽의 <a href>(같은 사이트)가 200(또는 200으로 끝나는 리다이렉트)인지, #앵커가 대상 쪽에 있는지
//  2. 사이트맵 — 색인 대상 쪽(noindex 아님·canonical=자기 주소)이 sitemap.xml에 다 있는지, 사이트맵 주소가 전부 200·색인 대상인지
//     일부러 뺀 쪽은 아래 SITEMAP_EXCLUDED에 이유와 함께 적는다(표로 출력)
//  3. JSON-LD — 문법 오류, @context, 형식별 필수 칸, 빈 값("", null, [])
//  4. 제목 ≤60자·설명 ≤160자, 빠진 제목·설명·canonical, 같은 제목·설명 중복
//  5. llms-full.txt·/md — 마크다운 판 목록이 현재 쪽(우리회사OS 킷·소식·질문 답변)과 일치하는지, public/llms.txt 링크가 살아 있는지
//
// 외부 제출(IndexNow·서치콘솔)은 하지 않는다. 네트워크는 로컬 서버에만 붙는다.
import { spawn, spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const SITE = "https://www.public-id.co.kr";
const TITLE_MAX = 60;
const DESC_MAX = 160;

// 사이트맵에 일부러 넣지 않는 쪽 — [경로 패턴, 이유]. 여기 없는데 사이트맵에도 없고 색인 대상이면 "빠짐"으로 잡는다.
const SITEMAP_EXCLUDED = [
  [/^\/admin(\/|$)/, "관리자 화면 — robots.txt Disallow·noindex"],
  [/^\/search$/, "사이트 검색 결과 — noindex(검색 결과 쪽 색인 금지)"],
  [/^\/board\/[^/]+$/, "게시판 개별 글 — 무검수 UGC라 noindex(2026-08-26 대표 위임 판단)"],
  [/^\/p\/[^/]+$/, "아웃리치 제안서 열람(토큰 주소) — noindex·비공개"],
  [/^\/safety-map\/c\/[^/]+$/, "발주처 전용 링크(토큰 주소) — noindex·비공개"],
  [/^\/safety-map\/links$/, "발주처 링크 관리 화면 — noindex"],
  [/^\/pis(\/|$)/, "사내 업무 웹앱 PI-System(외부 프로젝트 rewrite) — X-Robots-Tag noindex"],
];
// 동적 경로 중 빌드 때 목록을 알 수 없는 것 — 사이트맵은 런타임에 DB에서 채운다(검사 대상 아님).
const RUNTIME_ONLY = [
  [/^\/blog\/\[slug\]$/, "자체 블로그 글 — Supabase 게시분을 sitemap.ts가 런타임에 추가"],
  [/^\/board\/\[id\]$/, "게시판 글 — noindex"],
  [/^\/p\/\[token\]$/, "제안서 열람 — noindex"],
  [/^\/safety-map\/c\/\[token\]$/, "발주처 전용 링크 — noindex"],
];
// 이 서버가 아니라 외부로 넘어가는 주소(rewrite) — 링크 검사에서 뺀다.
const EXTERNAL_PREFIX = [/^\/pis(\/|$)/];

const args = process.argv.slice(2);
const argVal = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};

// ───────────────────────── 서버 ─────────────────────────
async function startServer() {
  const port = 3900 + Math.floor(Math.random() * 90);
  const bin = path.join(ROOT, "node_modules", ".bin", process.platform === "win32" ? "next.cmd" : "next");
  const child = spawn(bin, ["start", "-p", String(port)], {
    cwd: ROOT,
    env: { ...process.env, NODE_ENV: "production" },
    stdio: ["ignore", "pipe", "pipe"],
    shell: process.platform === "win32",
  });
  child.stderr.on("data", () => {});
  // 윈도는 shell로 띄운 next가 child.kill()로 안 꺼진다(중간 셸만 꺼짐) → 프로세스 트리째
  const stop = () => (process.platform === "win32" ? spawnSync("taskkill", ["/pid", String(child.pid), "/T", "/F"]) : child.kill());
  const base = `http://localhost:${port}`;
  for (let i = 0; i < 120; i++) {
    try {
      const r = await fetch(`${base}/robots.txt`);
      if (r.ok) return { base, stop };
    } catch {}
    await new Promise((r) => setTimeout(r, 500));
  }
  stop();
  throw new Error("next start가 60초 안에 뜨지 않았습니다 — 먼저 npm run build");
}

// ───────────────────────── HTML 도우미 ─────────────────────────
const decode = (s) =>
  s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&#x2F;/g, "/");
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}=(?:"([^"]*)"|'([^']*)')`, "i"));
  return m ? decode(m[1] ?? m[2]) : null;
};
const charLen = (s) => [...s].length;

/** <head>만(본문 속 SVG <title> 등을 피하려고) */
function headOf(html) {
  const i = html.indexOf("</head>");
  return i >= 0 ? html.slice(0, i) : html;
}

function parsePage(html) {
  const head = headOf(html);
  const title = (head.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [])[1];
  const metas = [...head.matchAll(/<meta\s[^>]*>/gi)].map((m) => m[0]);
  const meta = (key, val) => metas.find((t) => attr(t, key)?.toLowerCase() === val);
  const desc = meta("name", "description");
  const robots = meta("name", "robots");
  const links = [...head.matchAll(/<link\s[^>]*>/gi)].map((m) => m[0]);
  const canonical = links.find((t) => attr(t, "rel") === "canonical");
  const mdAlt = links.find((t) => attr(t, "rel") === "alternate" && attr(t, "type") === "text/markdown");
  const ld = [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)].map((m) => m[1]);
  // 본문 링크 — <a href>만(리소스·preload 제외)
  const hrefs = [...html.matchAll(/<a\s[^>]*>/gi)].map((m) => attr(m[0], "href")).filter(Boolean);
  const ids = new Set([...html.matchAll(/\sid=(?:"([^"]+)"|'([^']+)')/g)].map((m) => decode(m[1] ?? m[2])));
  return {
    title: title != null ? decode(title.trim()) : null,
    description: desc ? attr(desc, "content") : null,
    robots: robots ? attr(robots, "content") : null,
    canonical: canonical ? attr(canonical, "href") : null,
    markdownAlt: mdAlt ? attr(mdAlt, "href") : null,
    ld,
    hrefs,
    ids,
  };
}

// ───────────────────────── JSON-LD ─────────────────────────
// 형식별 필수 칸(구글 리치 결과 필수 + schema.org 핵심). 경로 표기: "a|b" = 둘 중 하나.
const REQUIRED = {
  Organization: ["name", "url"],
  LocalBusiness: ["name", "url", "address", "telephone"],
  WebSite: ["name", "url"],
  WebPage: ["name|headline"],
  CollectionPage: ["name|headline"],
  Product: ["name", "offers|review|aggregateRating"],
  Offer: ["price|priceSpecification", "priceCurrency|priceSpecification"],
  AggregateOffer: ["lowPrice", "priceCurrency"],
  FAQPage: ["mainEntity"],
  Question: ["name", "acceptedAnswer"],
  Answer: ["text"],
  Article: ["headline", "image", "datePublished", "author"],
  NewsArticle: ["headline", "image", "datePublished", "author"],
  BlogPosting: ["headline", "image", "datePublished", "author"],
  BreadcrumbList: ["itemListElement"],
  ListItem: ["position"],
  VideoObject: ["name", "description", "thumbnailUrl", "uploadDate"],
  ItemList: ["itemListElement"],
  HowTo: ["name", "step"],
  HowToStep: ["text|itemListElement"],
  Service: ["name"],
  Event: ["name", "startDate", "location"],
  SearchAction: ["target", "query-input"],
  Person: ["name"],
  PostalAddress: ["addressCountry"],
  SoftwareApplication: ["name", "offers|aggregateRating"],
  VideoGame: ["name"],
  Game: ["name"],
  ImageObject: ["contentUrl|url"],
};

function checkLd(raw, where, problems, types) {
  let data;
  try {
    data = JSON.parse(raw);
  } catch (e) {
    problems.push({ kind: "jsonld-syntax", page: where, detail: e.message });
    return;
  }
  const roots = Array.isArray(data) ? data : [data];
  for (const r of roots) {
    if (!r || typeof r !== "object") continue;
    if (!r["@context"]) problems.push({ kind: "jsonld-context", page: where, detail: `${r["@type"] ?? "?"}에 @context 없음` });
  }
  const walk = (node, trail, parentKey) => {
    if (Array.isArray(node)) {
      if (node.length === 0) problems.push({ kind: "jsonld-empty", page: where, detail: `${trail} = []` });
      node.forEach((n, i) => walk(n, `${trail}[${i}]`, parentKey));
      return;
    }
    if (node === null || node === undefined) {
      problems.push({ kind: "jsonld-empty", page: where, detail: `${trail} = null` });
      return;
    }
    if (typeof node === "string") {
      if (node.trim() === "") problems.push({ kind: "jsonld-empty", page: where, detail: `${trail} = ""` });
      return;
    }
    if (typeof node === "number" && !Number.isFinite(node)) {
      problems.push({ kind: "jsonld-empty", page: where, detail: `${trail} = ${node}` });
      return;
    }
    if (typeof node !== "object") return;
    if (node["@graph"]) walk(node["@graph"], `${trail}.@graph`, "@graph");
    const tlist = [].concat(node["@type"] ?? []);
    for (const t of tlist) {
      types.add(t);
      const req = REQUIRED[t];
      // @id만 있는 참조 노드는 건너뛴다
      const isRef = Object.keys(node).every((k) => k === "@id" || k === "@type");
      if (!req || isRef) continue;
      // ListItem: BreadcrumbList 안에선 name·item(마지막은 item 생략 가능), ItemList 안에선 item|url|name
      let reqs = req;
      // Offer 가격 칸은 상품·서비스의 offers일 때만 필수(구글 상품 리치 결과 기준). 회사 OfferCatalog의 "맞춤 견적" 항목처럼
      // 목록 안 Offer는 schema.org상 필수 칸이 없다 — 없는 가격을 지어 넣지 않는다.
      if (t === "Offer" && parentKey !== "offers") continue;
      if (t === "ListItem") reqs = parentKey === "breadcrumb" ? ["position", "name|item"] : ["position", "item|url|name"];
      for (const r of reqs) {
        const ok = r.split("|").some((k) => node[k] !== undefined && node[k] !== null && node[k] !== "");
        if (!ok) problems.push({ kind: "jsonld-required", page: where, detail: `${t}(${trail}) 필수 칸 ${r} 없음` });
      }
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === "@graph" || k === "@type" || k === "@context") continue;
      const nextKey = tlist.includes("BreadcrumbList") && k === "itemListElement" ? "breadcrumb" : k;
      walk(v, `${trail}.${k}`, nextKey);
    }
  };
  walk(data, "$", "");
}

// ───────────────────────── 쪽 목록 ─────────────────────────
function routeInventory() {
  const appPaths = JSON.parse(fs.readFileSync(path.join(ROOT, ".next/app-path-routes-manifest.json"), "utf8"));
  const prerender = JSON.parse(fs.readFileSync(path.join(ROOT, ".next/prerender-manifest.json"), "utf8"));
  const prerendered = Object.keys(prerender.routes);
  const pages = new Set();
  const runtimeOnly = [];
  for (const [file, route] of Object.entries(appPaths)) {
    if (!file.endsWith("/page")) continue;
    if (route.startsWith("/_")) continue;
    if (!route.includes("[")) {
      pages.add(route);
      continue;
    }
    const re = new RegExp("^" + route.replace(/\[\[?\.\.\.[^\]]+\]\]?/g, ".*").replace(/\[[^\]]+\]/g, "[^/]+") + "$");
    const hits = prerendered.filter((p) => re.test(p));
    if (hits.length) hits.forEach((p) => pages.add(p));
    else runtimeOnly.push(route);
  }
  const mdPrerendered = prerendered
    .filter((p) => p === "/md" || p.startsWith("/md/"))
    .map((p) => (p === "/md" ? "/" : p.slice(3)));
  return { pages: [...pages].sort(), runtimeOnly, mdPrerendered };
}

// ───────────────────────── 메인 ─────────────────────────
async function main() {
  if (!fs.existsSync(path.join(ROOT, ".next/prerender-manifest.json"))) {
    console.error("빌드 결과가 없습니다 — 먼저 npm run build");
    process.exit(2);
  }
  const given = argVal("--base");
  const server = given ? { base: given.replace(/\/$/, ""), stop: () => {} } : await startServer();
  const { base } = server;
  const problems = [];
  const toLocal = (u) => (u.startsWith(SITE) ? u.slice(SITE.length) || "/" : u);

  try {
    const inv = routeInventory();

    // robots.txt
    const robotsTxt = await (await fetch(`${base}/robots.txt`)).text();
    const disallows = [...robotsTxt.matchAll(/^Disallow:\s*(\S+)/gim)].map((m) => m[1]);

    // sitemap.xml
    const smXml = await (await fetch(`${base}/sitemap.xml`)).text();
    const sitemap = [...smXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toLocal(decode(m[1])));
    const sitemapSet = new Set(sitemap);
    if (sitemap.length !== sitemapSet.size) problems.push({ kind: "sitemap-dup", page: "/sitemap.xml", detail: "중복 주소" });

    // 각 쪽 가져오기
    const pageInfo = new Map();
    const fetchPage = async (p) => {
      if (pageInfo.has(p)) return pageInfo.get(p);
      const res = await fetch(base + encodeURI(decodeURI(p)), { redirect: "manual" });
      const ct = res.headers.get("content-type") || "";
      const xRobots = res.headers.get("x-robots-tag") || "";
      const info = { status: res.status, location: res.headers.get("location"), html: ct.includes("text/html"), xRobots };
      if (info.html && res.status === 200) Object.assign(info, parsePage(await res.text()));
      else await res.arrayBuffer().catch(() => {});
      pageInfo.set(p, info);
      return info;
    };

    const seeds = new Set([...inv.pages, ...sitemap]);
    for (const p of seeds) await fetchPage(p);

    // 링크로만 닿는 쪽도 따라간다(같은 사이트 HTML, 한 단계씩)
    const linkTargets = new Map(); // 대상 경로 → Set(출발 쪽)
    const anchorRefs = []; // [출발, 대상, 앵커]
    const crawlQueue = [...seeds];
    const seen = new Set(seeds);
    while (crawlQueue.length) {
      const from = crawlQueue.shift();
      const info = pageInfo.get(from);
      if (!info?.hrefs) continue;
      for (const raw of info.hrefs) {
        let u;
        if (raw.startsWith("mailto:") || raw.startsWith("tel:") || raw.startsWith("javascript:") || raw.startsWith("sms:")) continue;
        try {
          u = new URL(raw, SITE + (from === "/" ? "/" : from));
        } catch {
          problems.push({ kind: "link-malformed", page: from, detail: raw });
          continue;
        }
        if (u.origin !== SITE && u.origin !== "https://public-id.co.kr") continue;
        const p = u.pathname;
        if (EXTERNAL_PREFIX.some((re) => re.test(p))) continue;
        const key = p + u.search;
        if (!linkTargets.has(key)) linkTargets.set(key, new Set());
        linkTargets.get(key).add(from);
        if (u.hash && u.hash.length > 1) anchorRefs.push([from, key, decodeURIComponent(u.hash.slice(1))]);
        if (!seen.has(key)) {
          seen.add(key);
          const ti = await fetchPage(key);
          if (ti.html && ti.status === 200 && !u.search) crawlQueue.push(key);
        }
      }
    }

    // 리다이렉트를 끝까지 따라가 최종 상태를 얻는다
    const finalOf = async (p, depth = 0) => {
      const info = pageInfo.get(p) ?? (await fetchPage(p));
      if (info.status >= 300 && info.status < 400 && info.location && depth < 5) {
        const loc = new URL(info.location, base + "/");
        if (loc.origin !== base && loc.origin !== SITE) return { status: 200, external: true, path: loc.href };
        const lp = loc.pathname + loc.search;
        const f = await finalOf(lp, depth + 1);
        return { ...f, via: [p, ...(f.via ?? [])], hash: loc.hash };
      }
      return { status: info.status, path: p, info };
    };

    // 1. 깨진 내부 링크
    const redirectsLinked = [];
    for (const [target, froms] of linkTargets) {
      const f = await finalOf(target);
      if (f.status !== 200) {
        problems.push({ kind: "link-broken", page: [...froms].slice(0, 3).join(", ") + (froms.size > 3 ? ` 외 ${froms.size - 3}쪽` : ""), detail: `${target} → ${f.status}` });
      } else if (f.via) {
        redirectsLinked.push(`${target} → ${f.path}${f.hash ?? ""} (${froms.size}쪽에서 링크)`);
      }
    }
    for (const [from, target, anchor] of anchorRefs) {
      const f = await finalOf(target);
      if (f.status === 200 && f.info?.ids && !f.info.ids.has(anchor)) {
        problems.push({ kind: "link-anchor", page: from, detail: `${target}#${anchor} — 대상 쪽에 id="${anchor}" 없음` });
      }
    }

    // 2·4. 쪽별 메타 검사
    const indexable = [];
    const titles = new Map();
    const descs = new Map();
    const jsonldTypes = new Set();
    let ldBlocks = 0;
    for (const [p, info] of pageInfo) {
      if (!info.html || info.status !== 200 || p.includes("?")) continue;
      const noindex = /noindex/i.test(info.robots ?? "") || /noindex/i.test(info.xRobots);
      const canonical = info.canonical ? toLocal(info.canonical) : null;
      const selfCanonical = canonical === p;
      for (const raw of info.ld) {
        ldBlocks++;
        checkLd(raw, p, problems, jsonldTypes);
      }
      if (!info.title) problems.push({ kind: "meta-title-missing", page: p, detail: "" });
      if (!noindex) {
        if (!info.description) problems.push({ kind: "meta-desc-missing", page: p, detail: "" });
        if (!canonical) problems.push({ kind: "meta-canonical-missing", page: p, detail: "" });
        if (info.title && charLen(info.title) > TITLE_MAX)
          problems.push({ kind: "meta-title-long", page: p, detail: `${charLen(info.title)}자 — ${info.title}` });
        if (info.description && charLen(info.description) > DESC_MAX)
          problems.push({ kind: "meta-desc-long", page: p, detail: `${charLen(info.description)}자 — ${info.description.slice(0, 50)}…` });
        if (info.title) titles.set(info.title, [...(titles.get(info.title) ?? []), p]);
        if (info.description) descs.set(info.description, [...(descs.get(info.description) ?? []), p]);
      }
      // canonical이 없는 쪽도 noindex가 아니면 색인 대상이다(정적 HTML 등)
      if (!noindex && (selfCanonical || !canonical)) indexable.push(p);
      if (!noindex && canonical && !selfCanonical && !sitemapSet.has(canonical))
        problems.push({ kind: "canonical-target", page: p, detail: `canonical ${canonical}가 사이트맵에 없음` });
    }
    for (const [t, ps] of titles) if (ps.length > 1) problems.push({ kind: "meta-title-dup", page: ps.join(", "), detail: t });
    for (const [d, ps] of descs) if (ps.length > 1) problems.push({ kind: "meta-desc-dup", page: ps.join(", "), detail: d.slice(0, 50) + "…" });

    // 2. 사이트맵 ↔ 색인 대상
    const excludedRows = [];
    for (const p of indexable) {
      if (sitemapSet.has(p)) continue;
      const ex = SITEMAP_EXCLUDED.find(([re]) => re.test(p));
      if (ex) excludedRows.push([p, ex[1] + " ⚠️ 그런데 색인 허용 상태"]);
      else problems.push({ kind: "sitemap-missing", page: p, detail: "색인 대상인데 사이트맵에 없음" });
    }
    for (const [p, info] of pageInfo) {
      if (sitemapSet.has(p) || p.includes("?") || !info.html) continue;
      const ex = SITEMAP_EXCLUDED.find(([re]) => re.test(p));
      if (ex && !excludedRows.some((r) => r[0] === p)) excludedRows.push([p, ex[1]]);
    }
    for (const p of sitemap) {
      const info = pageInfo.get(p);
      if (!info || info.status !== 200) {
        problems.push({ kind: "sitemap-bad-url", page: p, detail: `상태 ${info?.status}` });
        continue;
      }
      if (/noindex/i.test(info.robots ?? "") || /noindex/i.test(info.xRobots)) problems.push({ kind: "sitemap-noindex", page: p, detail: "사이트맵에 있는데 noindex" });
      const c = info.canonical ? toLocal(info.canonical) : null;
      if (c && c !== p) problems.push({ kind: "sitemap-canonical", page: p, detail: `canonical이 다른 주소(${c})` });
      if (disallows.some((d) => p.startsWith(d))) problems.push({ kind: "sitemap-disallowed", page: p, detail: "robots.txt Disallow에 걸림" });
    }

    // 5. llms-full.txt · /md
    const expectedMd = [
      "/",
      "/products",
      "/os",
      ...inv.pages.filter((p) => /^\/(os|news|answers)\/[^/]+$/.test(p)),
    ];
    const mdSet = new Set(inv.mdPrerendered);
    for (const p of expectedMd) if (!mdSet.has(p)) problems.push({ kind: "md-missing", page: p, detail: "마크다운 판(/md) 없음" });
    for (const p of inv.mdPrerendered) if (!pageInfo.get(p) || pageInfo.get(p).status !== 200) problems.push({ kind: "md-orphan", page: p, detail: "마크다운 판은 있는데 사람용 쪽이 200이 아님" });
    for (const p of expectedMd) {
      const info = pageInfo.get(p);
      if (info?.status === 200 && !info.markdownAlt) problems.push({ kind: "md-alt-missing", page: p, detail: '<link rel="alternate" type="text/markdown"> 없음(pageMeta markdown: true)' });
    }
    const full = await (await fetch(`${base}/llms-full.txt`)).text();
    const fullDocs = full.split("\n\n---\n\n").length;
    if (fullDocs !== inv.mdPrerendered.length)
      problems.push({ kind: "llms-full-count", page: "/llms-full.txt", detail: `문서 ${fullDocs}개 ≠ /md ${inv.mdPrerendered.length}개` });
    for (const p of expectedMd) {
      if (p === "/") continue;
      if (!full.includes(`원문 ${SITE}${p}\n`) && !full.includes(`원문 ${SITE}${p} `))
        problems.push({ kind: "llms-full-missing", page: p, detail: "llms-full.txt에 이 쪽 문서 없음" });
    }
    const llmsTxt = fs.readFileSync(path.join(ROOT, "public/llms.txt"), "utf8").replace(/\r\n/g, "\n");  // 윈도 체크아웃은 CRLF
    const llmsLinks = [...new Set([...llmsTxt.matchAll(/https:\/\/www\.public-id\.co\.kr(\/[^\s)`,]*)?/g)].map((m) => m[1] || "/"))];
    for (const raw of llmsLinks) {
      const p = raw.replace(/[.。]$/, "");
      if (p.includes("<") || p.startsWith("/search?")) continue;
      const u = new URL(p, SITE);
      const f = await finalOf(u.pathname + u.search);
      if (f.status !== 200) problems.push({ kind: "llms-txt-link", page: "public/llms.txt", detail: `${p} → ${f.status}` });
    }
    const kitPages = inv.pages.filter((p) => /^\/os\/[^/]+$/.test(p));
    for (const p of kitPages) if (!llmsTxt.includes(`${SITE}${p}\n`) && !llmsTxt.includes(`${SITE}${p} `)) problems.push({ kind: "llms-txt-kit", page: p, detail: "public/llms.txt 킷 목록에 없음" });

    // ───────── 출력 ─────────
    const byKind = {};
    for (const pr of problems) (byKind[pr.kind] ??= []).push(pr);
    const LABEL = {
      "link-broken": "깨진 내부 링크",
      "link-anchor": "없는 #앵커로 가는 링크",
      "link-malformed": "주소 형식 오류",
      "sitemap-missing": "사이트맵에 빠진 색인 대상 쪽",
      "sitemap-bad-url": "사이트맵 주소가 200 아님",
      "sitemap-noindex": "사이트맵에 noindex 쪽",
      "sitemap-canonical": "사이트맵 주소의 canonical 불일치",
      "sitemap-disallowed": "사이트맵 주소가 robots 차단",
      "sitemap-dup": "사이트맵 중복",
      "canonical-target": "canonical 대상이 사이트맵에 없음",
      "jsonld-syntax": "JSON-LD 문법 오류",
      "jsonld-context": "JSON-LD @context 없음",
      "jsonld-required": "JSON-LD 필수 칸 없음",
      "jsonld-empty": "JSON-LD 빈 값",
      "meta-title-missing": "제목 없음",
      "meta-desc-missing": "설명 없음",
      "meta-canonical-missing": "canonical 없음",
      "meta-title-long": `제목 ${TITLE_MAX}자 초과`,
      "meta-desc-long": `설명 ${DESC_MAX}자 초과`,
      "meta-title-dup": "제목 중복",
      "meta-desc-dup": "설명 중복",
      "md-missing": "마크다운 판 없음",
      "md-orphan": "사람용 쪽 없는 마크다운 판",
      "md-alt-missing": "마크다운 alternate 링크 없음",
      "llms-full-count": "llms-full.txt 문서 수 불일치",
      "llms-full-missing": "llms-full.txt에 빠진 문서",
      "llms-txt-link": "llms.txt 깨진 링크",
      "llms-txt-kit": "llms.txt 킷 목록 누락",
    };

    console.log(`# SEO·AEO 구조 점검 — ${new Date().toISOString().slice(0, 10)}`);
    console.log(`\n검사한 주소 ${pageInfo.size}개 · 공개 쪽(빌드 목록) ${inv.pages.length}개 · 색인 대상 ${indexable.length}개 · 사이트맵 ${sitemap.length}개 · 내부 링크 대상 ${linkTargets.size}개 · JSON-LD 블록 ${ldBlocks}개(형식: ${[...jsonldTypes].sort().join(", ")}) · /md ${inv.mdPrerendered.length}개\n`);
    console.log("## 요약\n");
    console.log("| 항목 | 건수 |\n|---|---|");
    for (const [k, label] of Object.entries(LABEL)) console.log(`| ${label} | ${(byKind[k] ?? []).length} |`);
    console.log(`| **합계** | **${problems.length}** |`);
    for (const [k, list] of Object.entries(byKind)) {
      console.log(`\n## ${LABEL[k] ?? k} (${list.length})\n`);
      for (const pr of list.slice(0, 60)) console.log(`- \`${pr.page}\` ${pr.detail}`);
      if (list.length > 60) console.log(`- … 외 ${list.length - 60}건`);
    }
    console.log("\n## 사이트맵에서 일부러 뺀 쪽\n\n| 쪽 | 이유 |\n|---|---|");
    for (const [re, why] of SITEMAP_EXCLUDED) {
      const found = excludedRows.filter(([p]) => re.test(p)).map(([p]) => p);
      console.log(`| ${found.length ? found.map((p) => `\`${p}\``).join(" ") : `\`${re.source}\``} | ${why} |`);
    }
    for (const r of inv.runtimeOnly) {
      const why = RUNTIME_ONLY.find(([re]) => re.test(r))?.[1] ?? "빌드 때 목록 없음(확인 필요)";
      console.log(`| \`${r}\` | ${why} |`);
    }
    if (redirectsLinked.length) {
      console.log("\n## 참고: 리다이렉트를 거치는 내부 링크(깨진 것 아님)\n");
      for (const r of redirectsLinked) console.log(`- ${r}`);
    }

    const out = argVal("--json");
    if (out) fs.writeFileSync(out, JSON.stringify({ problems, sitemap, indexable, excluded: excludedRows }, null, 2));
    process.exitCode = problems.length ? 1 : 0;
  } finally {
    server.stop();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(2);
});
