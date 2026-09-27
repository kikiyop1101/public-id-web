// IndexNow 제출 — 이번 배포에서 바뀐 공개 페이지 URL만 골라 빙·네이버·얀덱스 등 IndexNow 참여 엔진에 통지한다.
// (구글은 IndexNow 미지원. ChatGPT 검색은 빙 색인을 쓴다.)
//
// 사용:
//   node scripts/indexnow.mjs --base <sha> [--head <sha>] [--dry-run]   두 커밋 diff로 URL 선정
//   node scripts/indexnow.mjs [--dry-run]                                 base 없음 → sitemap lastmod 최근 7일
//   node scripts/indexnow.mjs --all [--dry-run]                           sitemap 전체(큰 개편 때 수동)
//
// 자동 실행 = .github/workflows/indexnow.yml (Vercel 프로덕션 배포 성공 뒤, base = 직전 성공 배포 커밋).
// 키 파일 = public/<KEY>.txt — https://www.public-id.co.kr/<KEY>.txt 로 검증된다. 키는 공개가 원래 설계(비밀값 아님).
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";

const HOST = "www.public-id.co.kr";
const ORIGIN = `https://${HOST}`;
const KEY = "9706e13d3e584e3e0a8eac7f7ff78fdd";
const ENDPOINT = "https://api.indexnow.org/indexnow";
const BATCH = 100;
const RECENT_DAYS = 7;

const args = process.argv.slice(2);
const flag = (name) => args.includes(name);
const opt = (name) => {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : undefined;
};
const dryRun = flag("--dry-run");
const base = opt("--base");
const head = opt("--head") ?? "HEAD";

const git = (...a) => execFileSync("git", a, { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 });
const url = (path) => `${ORIGIN}${path}`;

// 공개 URL 목록 = src/app/sitemap.ts의 고정 경로 + 소식 개별 페이지. admin·api·발주처 전용 링크는 여기 없으므로 제출되지 않는다.
function staticRoutes() {
  const src = readFileSync("src/app/sitemap.ts", "utf8");
  const block = src.match(/const routes = \[([\s\S]*?)\];/);
  if (!block) throw new Error("sitemap.ts에서 routes 배열을 못 찾음");
  const lines = block[1].split("\n").map((l) => l.replace(/\/\/.*$/, ""));
  return new Set([...lines.join("\n").matchAll(/"([^"]*)"/g)].map((m) => m[1] || "/"));
}

function readNews(rev) {
  try {
    const text = rev ? git("show", `${rev}:src/content/news.json`) : readFileSync("src/content/news.json", "utf8");
    return JSON.parse(text);
  } catch {
    return [];
  }
}

// news.json 변경 → 추가·수정된 글의 /news/<slug> + 목록(/news·/press) + 홈(NewsStrip)
function newsChanges(from, to) {
  const before = new Map(readNews(from).map((n) => [n.slug, JSON.stringify(n)]));
  const paths = new Set(["/", "/news", "/press"]);
  for (const n of readNews(to)) {
    if (before.get(n.slug) !== JSON.stringify(n)) paths.add(`/news/${n.slug}`);
  }
  return paths;
}

// 파일 경로 → 공개 경로. 반환: { paths } | { ambiguous: true } | null(공개 페이지와 무관)
function mapFile(file, routes, from, to) {
  if (file === "src/content/news.json") return { paths: newsChanges(from, to) };
  if (file === "src/content/videos.json") return { paths: new Set(["/", "/videos"]) };
  if (file.startsWith("src/content/")) return { ambiguous: true };

  if (file.startsWith("public/")) {
    // 키 파일·llms.txt는 페이지가 아니다. 이미지·영상 등은 어느 페이지가 쓰는지 단정할 수 없다.
    if (file === `public/${KEY}.txt` || file === "public/llms.txt") return null;
    return { ambiguous: true };
  }

  if (!file.startsWith("src/app/")) return null;
  const segs = file.slice("src/app/".length).split("/");
  segs.pop(); // 파일명
  if (segs[0] === "api" || segs[0] === "admin") return null;
  // 루트 직속: page.tsx = 홈, 그 밖(layout·globals.css·아이콘 등)은 전 페이지 공용
  if (segs.length === 0) {
    const name = file.split("/").pop();
    if (/^page\.(tsx|ts|jsx|js)$/.test(name)) return { paths: new Set(["/"]) };
    if (/^(sitemap|robots|manifest)\.ts$/.test(name)) return null;
    return { ambiguous: true };
  }
  const routeSegs = segs.filter((s) => !/^\(.*\)$/.test(s) && !s.startsWith("_"));
  // 동적 세그먼트([slug] 등)는 여러 URL의 템플릿 — 공개 경로가 아니면(board/[id]·p/[token]) 무시
  const dyn = routeSegs.findIndex((s) => s.startsWith("["));
  if (dyn >= 0) {
    const parent = "/" + routeSegs.slice(0, dyn).join("/");
    return routes.has(parent) && ["/news", "/blog"].includes(parent) ? { ambiguous: true } : null;
  }
  const path = "/" + routeSegs.join("/");
  return routes.has(path) ? { paths: new Set([path]) } : null;
}

async function fetchSitemap() {
  try {
    const res = await fetch(`${ORIGIN}/sitemap.xml`, { headers: { "User-Agent": "public-id-indexnow" } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const xml = await res.text();
    return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].map((m) => ({
      loc: m[1].match(/<loc>([^<]+)<\/loc>/)?.[1],
      lastmod: m[1].match(/<lastmod>([^<]+)<\/lastmod>/)?.[1],
    })).filter((e) => e.loc);
  } catch (e) {
    console.warn(`sitemap.xml을 못 읽음(${e.message}) — src/content/news.json 날짜로 대체`);
    return null;
  }
}

// 매핑이 애매할 때: sitemap lastmod가 최근 7일인 URL(= 최근 소식·블로그 글)
async function recentUrls() {
  const cutoff = Date.now() - RECENT_DAYS * 24 * 60 * 60 * 1000;
  const recent = (d) => d && !Number.isNaN(Date.parse(d)) && Date.parse(d) >= cutoff;
  const sitemap = await fetchSitemap();
  if (sitemap) return sitemap.filter((e) => recent(e.lastmod)).map((e) => e.loc);
  // sitemap.ts와 같은 규칙(lastModified = datePublished). 블로그 글은 DB라 여기선 빠진다.
  return readNews().filter((n) => recent(n.dateModified ?? n.datePublished)).map((n) => url(`/news/${n.slug}`));
}

async function selectUrls() {
  if (flag("--all")) {
    const sitemap = await fetchSitemap();
    if (!sitemap?.length) throw new Error("--all은 sitemap.xml이 필요함");
    return { urls: sitemap.map((e) => e.loc), reason: "sitemap 전체" };
  }
  if (!base) return { urls: await recentUrls(), reason: `기준 커밋 없음 → sitemap lastmod 최근 ${RECENT_DAYS}일` };

  const files = git("diff", "--name-only", "--no-renames", base, head).split("\n").filter(Boolean);
  const routes = staticRoutes();
  const paths = new Set();
  const ambiguous = [];
  for (const f of files) {
    const m = mapFile(f, routes, base, head);
    if (!m) continue;
    if (m.ambiguous) ambiguous.push(f);
    else m.paths.forEach((p) => paths.add(p));
  }
  const urls = new Set([...paths].map((p) => url(p === "/" ? "" : p)));
  if (ambiguous.length) {
    console.log(`매핑이 애매한 변경 ${ambiguous.length}건(예: ${ambiguous.slice(0, 3).join(", ")}) → 최근 ${RECENT_DAYS}일 URL 추가`);
    (await recentUrls()).forEach((u) => urls.add(u));
  }
  const short = (rev) => git("rev-parse", "--short", rev).trim();
  return { urls: [...urls], reason: `${short(base)}..${short(head)} 변경 파일 ${files.length}개` };
}

const { urls, reason } = await selectUrls();
console.log(`[${reason}] 제출 대상 ${urls.length}개`);
urls.forEach((u) => console.log(`  ${u}`));

if (urls.length === 0) {
  console.log("변경된 공개 페이지 없음 — 제출하지 않음");
} else if (dryRun) {
  console.log("--dry-run: 제출하지 않음");
} else {
  let failed = false;
  for (let i = 0; i < urls.length; i += BATCH) {
    const urlList = urls.slice(i, i + BATCH);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({ host: HOST, key: KEY, keyLocation: `${ORIGIN}/${KEY}.txt`, urlList }),
    });
    console.log(`IndexNow: ${res.status} ${res.statusText} — ${urlList.length}개 제출`);
    if (!res.ok) {
      failed = true;
      console.log(await res.text());
    }
  }
  if (failed) process.exitCode = 1;
}
