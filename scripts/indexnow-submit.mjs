// IndexNow 제출 — 사이트맵의 전체 URL을 Bing·네이버 등 IndexNow 참여 엔진에 통지.
// 사용: node scripts/indexnow-submit.mjs   (배포 후 실행. 새 페이지·큰 개편 때마다 돌리면 됨)
// 키 파일 = public/<KEY>.txt (배포되어 https://www.public-id.co.kr/<KEY>.txt 로 검증됨)
const HOST = "www.public-id.co.kr";
const KEY = "9706e13d3e584e3e0a8eac7f7ff78fdd";

const sitemapXml = await (await fetch(`https://${HOST}/sitemap.xml`)).text();
const urls = [...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
if (urls.length === 0) throw new Error("sitemap에서 URL을 못 읽음");

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: `https://${HOST}/${KEY}.txt`,
    urlList: urls,
  }),
});
console.log(`IndexNow: ${res.status} ${res.statusText} — ${urls.length}개 URL 제출`);
if (!res.ok) console.log(await res.text());
