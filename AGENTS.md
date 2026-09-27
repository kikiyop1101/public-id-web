<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Next.js 16.2.x. `node_modules/next/dist/docs/`가 없으면(클론/CI 환경) 공식 nextjs.org 문서를 참조하거나 document-specialist에 위임한다.

## Commands

- dev: `npm run dev` (localhost:3000)
- build: `npm run build` (⚠️ git push 전 필수 — 빌드 깨진 채 push 금지. master push 시 Vercel 프로덕션 public-id.co.kr 자동 재배포)
- lint: `npm run lint` (스크립트는 `eslint`)
- deploy: `git push` (master → Vercel 자동 재배포, `npx vercel --prod` 수동 불필요)
- 소식(/news 전체 · /press 보도자료만, 탭 공용 컴포넌트 NewsListSection) 데이터 = `src/content/news.json`(최신이 맨 앞, 날짜 필드 없음 — 대표 확정 2026-09-08). 볼트 `Agent\콘텐츠본부\보도자료\publisher\news_publish.py`가 주 3건(월·수·금) 자동으로 검증→선두 삽입→build→commit→push 한다. 손으로 고칠 땐 slug 유일·플레인 텍스트 문단만 지키면 된다.

- **페이지 메타데이터는 `pageMeta()`(`src/lib/seo.ts`) 하나로 쓴다**(2026-09-08 감사). Next는 openGraph를 병합이 아니라 통째 교체하므로 손으로 `openGraph: {…}`를 쓰면 og:image·siteName이 사라지고, 안 쓰면 홈 문구가 상속된다. 새 페이지 = `export const metadata: Metadata = pageMeta({ title, description, path })`. 루트 layout에는 canonical을 두지 않는다. FAQ가 있는 페이지는 `FaqBlock`(FAQPage JSON-LD 동반)으로.

환경 함정(Windows PowerShell): npx가 차단되면 npm.cmd 절대경로로 우회 — `& 'C:\Program Files\nodejs\npm.cmd' exec <pkg>` (또는 Bash 툴 사용).

배포 검증: push 후 https://public-id.co.kr 를 실제 브라우저로 렌더해 눈으로 확인한다(curl은 Cloudflare 봇차단으로 403). **데스크톱+모바일 2벌 필수** — `node <시스템>\Agent\관리본부\_tools\shot.mjs <url> <out> [--mobile]`. 홈의 스크롤 연동 모션(히어로 깊이 레이어·게이트웨이 스티키 스택·스탯 카운트업 = `ScrollDepth`·`.stack-card`·`CountUp`)은 `--scroll` 연속 프레임으로 이동량·겹침·잘림을 본다(정본 = `_design-system\design.md` §5 스크롤 연동, 2026-09-03).

클라우드 세션(볼트 없이 이 저장소만 클론된 환경): 시각 규칙 = `docs/design-canon.md`(볼트 `Agent\PI정본\_design-system\design.md` 사본, 화면을 바꾸기 전에 읽는다). `shot.mjs`가 없으니 Playwright로 데스크톱 1440px·모바일 390px 2벌을 캡처해 확인한다. master에 직접 push하지 말고 브랜치+PR로 낸다(master = 프로덕션 자동 배포).

## 공개 카피 절대규칙 (사이트 카피 수정 시 위반 금지)

- 마스코트는 항상 '퍼이'(청록 펭귄). 일반명칭('마스코트 펭귄' 등) 금지.
- '노란발자국'은 제품명으로만 쓴다(공동사용 상표, 단독 소유 아님). 또한 차도가 아니라 인도/보도의 횡단 대기 공간 표시다.
- 특허는 '자체 특허(제10-1974029호)와 국제특허(유럽특허 EP 1 677 974) 보유'라고 표기할 수 있다. 법적 권리 주장(침해 경고 등)은 하지 않는다. 노란볼라드에는 '특허' 표현 금지(디자인등록·GD2023 선정).
- 협력·제조 기관은 일반화한다(특정 기관 단정 금지). 단 시공실적·고객사 레퍼런스 실명 표기는 허용(대표 확정 2026-08-26 — /credibility 등).
- 회사 규모 수치(임직원·매출)는 비공개.
- 가격은 '기준가'로 표기하고 정확한 견적은 문의로 안내한다.
- 노면표시재 = 인쇄된 알루미늄 박판 점착식 스티커(특허·미끄럼저항 46BPN). 페인트 도색 아님.
- 목록 외 제품·모르는 사실 환각 금지.

⚠️ 이 규칙의 단일 출처와 전체 문구는 `src/lib/assistant-knowledge.ts`의 절대 규칙 블록이다. 카피 변경 전 그 블록을 확인하고 양쪽을 어긋나게 두지 말 것(중복 작성 금지, 출처를 가리킬 것).

## 변경 금지 (의도적 설계)

- `src/lib/clientLinks.ts`의 SALT·ADMIN_KEY 평문 상수는 현 공개 쇼케이스 설계상 의도적 수용 — 데이터 비공개 전환 전까지 env var로 옮기거나 토큰 스킴을 바꾸지 말 것(발주처 전용 링크 /safety-map/c/<token>·/api/facility-links 깨짐).
- `next.config.ts`의 부분 CSP(form-action/frame-ancestors만)는 SSG nonce 한계로 의도적 — default-src/script-src 임의 추가 금지.
- apex→www 308 redirect·보안헤더 5종은 의도적 유지.
- `.env*`·`.omc/`·`_세션복원-홈페이지.md`·`안전관리지도-운영가이드.md`·`.vercel`은 gitignore 유지(절대 커밋·추적 금지).
