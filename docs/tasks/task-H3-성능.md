# task H3 — 성능(LCP·CLS·전송량) 점검·수리 (11-04)

AGENTS.md(클라우드 절)를 먼저 읽고 따른다. 브랜치+PR.

## 의도
- 문제: 영상·이미지·소식이 늘어 첫 화면이 무거워졌을 수 있다. 09-27 성능 작업 이후 다시 잰 적이 없다.
- 성공한 모습: 주요 쪽(홈·/os·/products·/news·/videos·/answers)을 로컬 프로덕션 빌드로 Lighthouse(모바일) 전후 측정해, 고친 쪽의 LCP·CLS·전송 바이트가 줄었고 나빠진 쪽이 없다.
- 닿는 곳: 이미지 크기·형식·priority/lazy, 폰트 로딩, 큰 클라이언트 번들(동적 import), 캐시 헤더.
- 지킬 것·안 할 것: 화면 모양·문구 그대로, 새 의존성 금지(Lighthouse는 측정용 npx만), 분석 스크립트 제거 금지.
- 가정: 측정은 `next build && next start` + `npx lighthouse --preset=perf --form-factor=mobile` 3회 중앙값.

## 검증
- 전후 표(쪽 × LCP·CLS·TBT·바이트)와 빌드·lint 결과를 PR 본문에.
