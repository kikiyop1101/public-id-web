# 배포 가이드 — public-id.co.kr

Next.js 16 (App Router) 사이트. 빌드 시 전 페이지 정적 생성(SSG) → Vercel에 그대로 배포.

## 도메인 현황 (2026-06 확인)

| 항목 | 값 |
|---|---|
| 소유자(등록인) | 주식회사 퍼블릭아이디 |
| 등록기관(DNS 변경 위치) | **후이즈 / Whois Corp. — https://whois.co.kr** |
| 만료일 | 2028-08-16 |
| 현재 네임서버 | `ns4.wixdns.net`, `ns5.wixdns.net` (= Wix) |
| 메일 | public-id@naver.com (도메인 메일 없음 → NS 이전 안전) |

> 기존 사이트는 **Wix**로 제작됨. DNS를 Vercel로 옮기면 Wix 연결이 끊기고 새 사이트로 전환됨. 전환 확인 후 Wix 구독 해지.

## 1. Vercel 배포

### A. CLI (가장 빠름)
```bash
cd public-id-web
npx vercel        # 로그인(브라우저) → 프로젝트 생성, 프리뷰 배포
npx vercel --prod # 정식 배포 → https://<project>.vercel.app
```

### B. GitHub 연동 (권장 — push 시 자동 재배포)
1. GitHub에 빈 저장소 생성 (예: `public-id-web`)
2. ```bash
   git remote add origin https://github.com/<계정>/public-id-web.git
   git push -u origin master
   ```
3. vercel.com → Add New → Project → 저장소 import (Next.js 자동 감지) → Deploy

## 2. 도메인 연결

1. Vercel 프로젝트 → **Settings → Domains** → `public-id.co.kr`, `www.public-id.co.kr` 추가
2. Vercel이 표시하는 연결 값 확인 (둘 중 하나)
   - **네임서버 방식(권장)**: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`
   - **레코드 방식**: A `@ → 76.76.21.21`, CNAME `www → cname.vercel-dns.com`
3. **후이즈(whois.co.kr) 로그인 → 도메인 관리 → public-id.co.kr → 네임서버 변경**
   - Wix 네임서버를 위 Vercel 값(또는 후이즈 기본 DNS + 레코드)으로 교체 → **Wix 제거됨**
   - ※ 실제 값은 Vercel 화면에 표시된 것을 사용
4. DNS 전파(수십 분~최대 48h) → Vercel이 **HTTPS 자동 발급** → `https://public-id.co.kr` 확인
5. 정상 확인 후 **Wix 구독 해지**

## 3. 배포 전 체크리스트

- [ ] **문의 폼 키** — `src/components/ContactForm.tsx`의 `WEB3FORMS_ACCESS_KEY`에 무료 키 입력
      (https://web3forms.com 에서 public-id@naver.com 으로 발급). 비어 있으면 메일앱 열기 폴백.
- [ ] (선택) 인증마크·고객사 로고 이미지, FAQ/후기 등 추가 콘텐츠
- [ ] OG 이미지(`public/og.png`) 최종 확인

## 로컬 명령어
```bash
npm run dev    # 개발 서버 http://localhost:3000
npm run build  # 프로덕션 빌드 검증
npm start      # 빌드 결과 로컬 실행
```
