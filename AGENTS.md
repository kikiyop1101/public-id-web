<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

Next.js 16.2.x. `node_modules/next/dist/docs/`가 없으면(클론/CI 환경) 공식 nextjs.org 문서를 참조하거나 document-specialist에 위임한다.

## Commands

- dev: `npm run dev` (localhost:3000)
- build: `npm run build` (⚠️ git push 전 필수 — 빌드 깨진 채 push 금지. master push 시 Vercel 프로덕션 public-id.co.kr 자동 재배포)
- lint: `npm run lint` (스크립트는 `eslint`)
- deploy: `git push` (master → Vercel 자동 재배포, `npx vercel --prod` 수동 불필요)

환경 함정(Windows PowerShell): npx가 차단되면 npm.cmd 절대경로로 우회 — `& 'C:\Program Files\nodejs\npm.cmd' exec <pkg>` (또는 Bash 툴 사용).

배포 검증: push 후 https://public-id.co.kr 를 실제 브라우저로 렌더해 눈으로 확인한다(curl은 Cloudflare 봇차단으로 403).

## 공개 카피 절대규칙 (사이트 카피 수정 시 위반 금지)

- 마스코트는 항상 '퍼이'(청록 펭귄). 일반명칭('마스코트 펭귄' 등) 금지.
- '노란발자국'은 제품명으로만 쓴다(공동사용 상표, 단독 소유 아님). 또한 차도가 아니라 인도/보도의 횡단 대기 공간 표시다.
- 특허는 '특허받은'까지만 표기한다(국가 등록특허·국제특허 등 종류 단정 금지).
- 협력·제조 기관은 일반화한다(특정 기관 단정 금지).
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
