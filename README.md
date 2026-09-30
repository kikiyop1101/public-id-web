# public-id-web

주식회사 퍼블릭아이디 공식 홈페이지(https://www.public-id.co.kr) 소스. Next.js(App Router) + Tailwind CSS v4, Vercel 배포.

## 명령

```bash
npm run dev    # 개발 서버 http://localhost:3000
npm run build  # 프로덕션 빌드 검증 (push 전 필수)
npm run lint   # eslint
```

## 먼저 읽을 문서

- `AGENTS.md` — 작업 규칙(공개 카피 절대규칙, 변경 금지 항목, 메타데이터·소식·IndexNow 규약)
- `DEPLOY.md` — 배포와 도메인 현황
- `docs/design-canon.md` — 시각 규칙(화면을 바꾸기 전에 읽는다)

`master` 브랜치에 push 하면 Vercel 프로덕션이 자동으로 다시 배포된다.
