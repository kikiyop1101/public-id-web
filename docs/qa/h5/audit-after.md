# SEO·AEO 구조 점검 — 2026-11-04

검사한 주소 224개 · 공개 쪽(빌드 목록) 126개 · 색인 대상 149개 · 사이트맵 149개 · 내부 링크 대상 221개 · JSON-LD 블록 535개(형식: AggregateOffer, Answer, Article, Brand, BreadcrumbList, CollectionPage, CreativeWork, EntryPoint, FAQPage, ImageObject, ItemList, LearningResource, ListItem, LocalBusiness, NewsArticle, Offer, OfferCatalog, Organization, Person, PostalAddress, Product, PropertyValue, Question, SearchAction, Service, UnitPriceSpecification, VideoObject, WebSite) · /md 94개

## 요약

| 항목 | 건수 |
|---|---|
| 깨진 내부 링크 | 0 |
| 없는 #앵커로 가는 링크 | 0 |
| 주소 형식 오류 | 0 |
| 사이트맵에 빠진 색인 대상 쪽 | 0 |
| 사이트맵 주소가 200 아님 | 0 |
| 사이트맵에 noindex 쪽 | 0 |
| 사이트맵 주소의 canonical 불일치 | 0 |
| 사이트맵 주소가 robots 차단 | 0 |
| 사이트맵 중복 | 0 |
| canonical 대상이 사이트맵에 없음 | 0 |
| JSON-LD 문법 오류 | 0 |
| JSON-LD @context 없음 | 0 |
| JSON-LD 필수 칸 없음 | 0 |
| JSON-LD 빈 값 | 0 |
| 제목 없음 | 0 |
| 설명 없음 | 0 |
| canonical 없음 | 0 |
| 제목 60자 초과 | 0 |
| 설명 160자 초과 | 0 |
| 제목 중복 | 0 |
| 설명 중복 | 0 |
| 마크다운 판 없음 | 0 |
| 사람용 쪽 없는 마크다운 판 | 0 |
| 마크다운 alternate 링크 없음 | 0 |
| llms-full.txt 문서 수 불일치 | 0 |
| llms-full.txt에 빠진 문서 | 0 |
| llms.txt 깨진 링크 | 0 |
| llms.txt 킷 목록 누락 | 0 |
| **합계** | **0** |

## 사이트맵에서 일부러 뺀 쪽

| 쪽 | 이유 |
|---|---|
| `/admin/login` | 관리자 화면 — robots.txt Disallow·noindex |
| `/search` | 사이트 검색 결과 — noindex(검색 결과 쪽 색인 금지) |
| `^\/board\/[^/]+$` | 게시판 개별 글 — 무검수 UGC라 noindex(2026-08-26 대표 위임 판단) |
| `^\/p\/[^/]+$` | 아웃리치 제안서 열람(토큰 주소) — noindex·비공개 |
| `^\/safety-map\/c\/[^/]+$` | 발주처 전용 링크(토큰 주소) — noindex·비공개 |
| `/safety-map/links` | 발주처 링크 관리 화면 — noindex |
| `^\/pis(\/|$)` | 사내 업무 웹앱 PI-System(외부 프로젝트 rewrite) — X-Robots-Tag noindex |
| `/blog/[slug]` | 자체 블로그 글 — Supabase 게시분을 sitemap.ts가 런타임에 추가 |
| `/board/[id]` | 게시판 글 — noindex |
| `/p/[token]` | 제안서 열람 — noindex |
| `/safety-map/c/[token]` | 발주처 전용 링크 — noindex |

## 참고: 리다이렉트를 거치는 내부 링크(깨진 것 아님)

- /admin → /admin/login (1쪽에서 링크)
