# 배포 가이드 — www.public-id.co.kr

Next.js(App Router) 사이트를 Vercel에 배포한다. 대부분의 페이지는 빌드 때 정적으로 만들어지고, 블로그·게시판·안전신고·관리자 등 일부는 요청 때마다 서버에서 렌더한다(`force-dynamic`). 사이트맵은 1시간 ISR이다(관리자 글 등록·삭제 때 바로 갱신).

## 도메인 현황

| 항목 | 값 |
|---|---|
| 소유자(등록인) | 주식회사 퍼블릭아이디 |
| 등록기관 | 후이즈 / Whois Corp. — https://whois.co.kr (2026-06 확인) |
| 만료일 | 2028-08-16 (2026-06 확인) |
| 현재 네임서버 | `ns1.vercel-dns.com`, `ns2.vercel-dns.com` (Vercel DNS, 2026-09 확인) |
| 기준 주소 | `https://www.public-id.co.kr` — apex(`public-id.co.kr`)는 www로 308 이동 |
| 메일 | public-id@naver.com (도메인 메일 없음) |

DNS 레코드는 Vercel 프로젝트의 **Settings → Domains**에서 관리한다. 네임서버 자체를 바꿀 때만 후이즈(등록기관)에서 작업한다.

## 배포

1. `npm run build`로 빌드가 통과하는지 확인한다(빌드가 깨진 채 push 금지).
2. `git push` — `master`에 push 하면 Vercel이 프로덕션을 자동으로 다시 배포한다. `npx vercel --prod` 수동 배포는 필요 없다.
3. 배포 뒤 실제 브라우저로 데스크톱·모바일 2벌을 확인한다(방법은 `AGENTS.md`의 '배포 검증').

- 환경변수는 Vercel 프로젝트 설정에만 둔다. `.env*`는 커밋하지 않는다.
- 프로덕션 배포가 성공하면 `.github/workflows/indexnow.yml`이 바뀐 공개 URL을 IndexNow로 자동 제출한다.
- 볼트 없이 이 저장소만 받은 환경(클라우드 세션)에서는 `master`에 직접 push 하지 말고 브랜치+PR로 낸다.

## 로컬 명령어

```bash
npm run dev    # 개발 서버 http://localhost:3000
npm run build  # 프로덕션 빌드 검증
npm start      # 빌드 결과 로컬 실행
npm run lint   # eslint
```
